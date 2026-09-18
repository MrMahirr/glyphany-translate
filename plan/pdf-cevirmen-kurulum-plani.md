# PDF/Kitap Çevirmen — Detaylı Kurulum Planı

## 0. Mimari özet

```
[Next.js frontend]  ──►  [NestJS API]  ──►  [Redis kuyruk]  ──►  [Python worker]
                              │                                        │
                          [Postgres]                              [S3 / MinIO]
```

- **Frontend (Next.js):** yükleme, dil seçimi, iki panelli senkron okuyucu (sol: figür-çevirili PDF, sağ: gövde çeviri metni)
- **Backend (NestJS):** auth, job yönetimi, API, Swagger docs
- **Worker (Python/FastAPI):** PDF parse, sayfa/bölge sınıflandırma, OCR, çeviri çağrıları, PDF yeniden yazma
- **Redis:** iş kuyruğu (BullMQ ↔ NestJS tarafı, Celery/RQ ↔ Python tarafı arasında köprü — bkz. §4)
- **Postgres:** kullanıcı, job, sayfa-paragraf eşleşme, çeviri cache
- **S3/MinIO:** orijinal PDF, çıktı PDF, çıktı JSON

---

## 1. Backend — NestJS

### Kurulum
```bash
npm i -g @nestjs/cli
nest new pdf-translator-api
cd pdf-translator-api
```

### Gerekli paketler
```bash
# API temel
npm i @nestjs/config @nestjs/swagger swagger-ui-express

# Kuyruk (BullMQ)
npm i @nestjs/bullmq bullmq ioredis

# DB (raw SQL tercihine uygun — ORM yok)
npm i pg
npm i -D @types/pg

# Auth
npm i @nestjs/jwt @nestjs/passport passport passport-jwt

# Dosya upload
npm i @nestjs/platform-express multer
npm i -D @types/multer

# S3/MinIO client
npm i @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

### NestJS'in görevleri
- `POST /jobs` — PDF yükle, S3'e koy, Postgres'e job kaydı at, Redis kuyruğuna mesaj bırak
- `GET /jobs/:id` — durum sorgulama (queued/processing/done/failed)
- `GET /jobs/:id/result` — çıktı PDF + JSON linkleri (presigned S3 URL)
- Worker bitince sonucu nasıl haber verir: worker Postgres'teki job satırını günceller, NestJS tarafında ya polling ya da Postgres `LISTEN/NOTIFY` ile anlık haber al, frontend'e SSE/WebSocket ile ilet
- Swagger: `/api` altında otomatik dokümantasyon (`@nestjs/swagger` decorator'ları ile)

---

## 2. Python Worker — asıl iş burada

### Kurulum
```bash
python3 -m venv venv
source venv/bin/activate
pip install fastapi uvicorn celery redis
```

### Gerekli kütüphaneler ve rolleri

| Kütüphane | Rol |
|---|---|
| `PyMuPDF` (`pip install pymupdf`) | PDF'ten metin/bbox çıkarma, figür bölgesine overlay metin yazma — projenin omurgası |
| `docling` (`pip install docling`) veya `marker-pdf` (`pip install marker-pdf`) | Sayfayı text-block / figure / table bölgelerine otomatik ayırma (layout detection) |
| `pytesseract` + `tesseract-ocr` (sistem paketi) | Taranmış sayfalar / raster diyagram içindeki etiketleri OCR ile okuma, kelime bazlı bbox |
| `pdf2image` + `poppler-utils` (sistem paketi) | Sayfaları/bölgeleri rasterize edip OCR'a hazırlama |
| `langdetect` veya `fasttext` (lid.176 modeliyle) | Kaynak dil otomatik tespiti |
| `deepl` (resmi Python SDK) | Ana çeviri motoru |
| `anthropic` (Claude API SDK) | Bağlam gereken/kalite kritik bölümler için opsiyonel ikincil çeviri motoru |
| `celery` + `redis` | Kuyruk tüketici — NestJS'ten gelen job'ları işler |
| `psycopg2-binary` | Postgres bağlantısı (raw SQL) |
| `boto3` | S3/MinIO okuma-yazma |
| `fastapi` + `uvicorn` | Worker'ın kendi iç health-check/debug endpoint'leri için (opsiyonel, job'lar zaten kuyruktan geliyor) |

### Sistem seviyesi bağımlılıklar (Dockerfile'a girecek)
```bash
apt-get install -y tesseract-ocr tesseract-ocr-eng tesseract-ocr-tur poppler-utils
```
(Kitapların dillerine göre ek `tesseract-ocr-<dil>` paketleri eklenmeli)

### Worker'ın adım adım görevleri
1. S3'ten PDF'i indir
2. Docling/Marker ile sayfa sayfa bölge tespiti (text block / figure / table)
3. Her figür bölgesi için: vektör metin mi raster mi kontrol et → raster ise crop + OCR
4. Gövde metnini okuma sırasına göre paragraf paragraf, sayfa numarası etiketiyle çıkar
5. Dil tespiti (`langdetect`/`fasttext`) — tüm doküman için bir kez yeterli
6. Çeviri:
   - Figür etiketleri → DeepL, küçük/hızlı batch'ler halinde
   - Gövde paragrafları → DeepL (varsayılan) veya Claude API (kalite gerekiyorsa), 3-5 paragraflık bağlam pencereleriyle
   - Her çeviri öncesi Postgres cache tablosuna bak (`source_text_hash` üzerinden), varsa tekrar çevirme
7. Figür overlay: PyMuPDF ile `insert_textbox` kullanarak `"orijinal (çeviri)"` yaz, sığmazsa diyagram altına numaralı lejant ekle
8. Gövde çevirisini JSON olarak üret: `{page, paragraphs: [{original, translated}]}`
9. Çıktı PDF + JSON'u S3'e yükle, Postgres job satırını `done` yap

---

## 3. Çeviri motoru kurulumu

### DeepL (ana motor)
```bash
pip install deepl
```
```python
import deepl
translator = deepl.Translator("DEEPL_API_KEY")
result = translator.translate_text("metin", target_lang="TR")
```
- Pro plan hacimli kullanım için gerekli (kitap boyu içerik)
- Rate limit'e karşı worker tarafında batch + retry/backoff mantığı kur

### Claude API (opsiyonel, bağlam gereken bölümler için)
```bash
pip install anthropic
```
```python
import anthropic
client = anthropic.Anthropic(api_key="...")
msg = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=1000,
    messages=[{"role": "user", "content": f"Bu paragrafı {hedef_dil} diline çevir, teknik terimleri koru: {paragraf}"}]
)
```
- Teknik terim tutarlılığı önemli kitaplarda (örneğin akademik/mühendislik kitapları) devreye al
- Maliyet DeepL'den yüksek, bu yüzden sadece flag'lenen bölümlerde kullan

### Çeviri cache tablosu (Postgres)
```sql
CREATE TABLE translation_cache (
    source_hash TEXT PRIMARY KEY,
    source_lang TEXT,
    target_lang TEXT,
    source_text TEXT,
    translated_text TEXT,
    engine TEXT,           -- 'deepl' | 'claude'
    created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## 4. Kuyruk / job akışı (NestJS ↔ Python köprüsü)

İki seçenek var, ikisi de geçerli:

**Seçenek A — Ortak Redis, farklı worker'lar:**
NestJS tarafında BullMQ ile job'u Redis'e yazarsın, Python tarafında da aynı Redis'i dinleyen bir Celery/RQ worker kurarsın (queue formatını elle uyumlu hale getirmen gerekir — BullMQ'nun kendi iç formatı Celery ile doğrudan uyumlu değil, bu yüzden basit bir JSON mesaj sözleşmesi tanımla).

**Seçenek B — Basitleştirilmiş (önerilen, MVP için):**
NestJS job'u Postgres'e yazar + doğrudan bir Redis `LPUSH` ile ham JSON mesaj gönderir (`{job_id, s3_path, target_lang}`). Python worker `BRPOP` ile bu kuyruğu dinler, kendi Celery/BullMQ'suna gerek kalmaz. Bitince Postgres'i günceller. Basit, az bağımlılık, MVP için yeterli.

---

## 5. Veritabanı şeması (Postgres, raw SQL)

```sql
CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    status TEXT DEFAULT 'queued',   -- queued | processing | done | failed
    source_pdf_path TEXT,
    target_lang TEXT,
    detected_source_lang TEXT,
    output_pdf_path TEXT,
    output_json_path TEXT,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE page_paragraph_map (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID REFERENCES jobs(id),
    page_number INT,
    paragraph_order INT,
    original_text TEXT,
    translated_text TEXT
);
```

---

## 6. Frontend — Next.js

### Kurulum
```bash
npx create-next-app@latest pdf-translator-web
cd pdf-translator-web
```

### Gerekli paketler
```bash
npm i react-pdf pdfjs-dist        # PDF render (sol panel)
npm i zustand                     # sayfa senkronizasyon state'i
npm i @tanstack/react-query       # job durumu polling/SSE
npm i axios
npm i tailwindcss                 # senin FSD yapı tercihine uygun, minimal stil
```

### Bileşen yapısı (FSD'ye uygun)
```
src/
  pages/           # veya app/ router
  widgets/
    dual-pane-reader/     # sol PDF panel + sağ çeviri panel + scroll sync
  features/
    upload-pdf/
    select-language/
    job-status-polling/
  entities/
    job/
    translation-page/
  shared/
    api/
    ui/
```

### Senkron okuyucu mantığı
1. Sol panelde `react-pdf` ile sayfa render edilir
2. Sağ panelde `output.json`'dan gelen paragraflar, her sayfa başlangıcı bir `id="page-N"` çapasıyla render edilir
3. Sol panelde sayfa değiştiğinde (`onPageChange`) → sağ panel `document.getElementById('page-N').scrollIntoView()`
4. Sağ panelde `IntersectionObserver` ile hangi `page-N` çapası görünüyorsa → sol panele "şu sayfaya git" sinyali gönderilir (zustand store üzerinden iki yönlü senkron)
5. Çeviri 2 sayfa tutuyorsa sağ panel doğal olarak o kadar uzun render olur, kullanıcı orada scroll ettikçe sonraki orijinal sayfaya geçilmez — sadece bir sonraki çapaya ulaşınca sol panel ilerler

---

## 7. Object storage — S3/MinIO

Yerel geliştirme için MinIO (self-hosted, S3 uyumlu):
```yaml
# docker-compose.yml içinde
minio:
  image: minio/minio
  command: server /data --console-address ":9001"
  ports: ["9000:9000", "9001:9001"]
  environment:
    MINIO_ROOT_USER: admin
    MINIO_ROOT_PASSWORD: admin12345
  volumes: ["minio_data:/data"]
```
Prod'da doğrudan AWS S3'e geçiş, kod tarafında sadece endpoint değişikliği (`@aws-sdk/client-s3` zaten S3-uyumlu her şeyle çalışır).

---

## 8. Docker Compose — tüm sistemi ayağa kaldırma

```yaml
version: "3.9"
services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_DB: pdf_translator
      POSTGRES_USER: app
      POSTGRES_PASSWORD: app
    ports: ["5432:5432"]
    volumes: ["pg_data:/var/lib/postgresql/data"]

  redis:
    image: redis:7
    ports: ["6379:6379"]

  minio:
    image: minio/minio
    command: server /data --console-address ":9001"
    ports: ["9000:9000", "9001:9001"]
    environment:
      MINIO_ROOT_USER: admin
      MINIO_ROOT_PASSWORD: admin12345
    volumes: ["minio_data:/data"]

  nest-api:
    build: ./pdf-translator-api
    ports: ["3000:3000"]
    depends_on: [postgres, redis, minio]
    env_file: .env

  python-worker:
    build: ./pdf-translator-worker
    depends_on: [postgres, redis, minio]
    env_file: .env

  next-web:
    build: ./pdf-translator-web
    ports: ["3001:3000"]
    depends_on: [nest-api]

volumes:
  pg_data:
  minio_data:
```

---

## 9. Ortam değişkenleri (.env)

```
DATABASE_URL=postgres://app:app@postgres:5432/pdf_translator
REDIS_URL=redis://redis:6379
S3_ENDPOINT=http://minio:9000
S3_ACCESS_KEY=admin
S3_SECRET_KEY=admin12345
S3_BUCKET=pdf-translator
DEEPL_API_KEY=...
ANTHROPIC_API_KEY=...          # opsiyonel, kalite-kritik çeviri için
JWT_SECRET=...
```

---

## 10. Geliştirme sırası (roadmap)

1. **Faz 1 — Altyapı:** Docker Compose ile Postgres/Redis/MinIO ayağa kaldır, NestJS iskeleti + tek endpoint (upload → S3 → job kaydı)
2. **Faz 2 — Worker temel akış:** Python worker sadece metin-katmanlı, tek-tip (taramasız) PDF'lerde çalışsın; Docling ile bölge ayrımı, DeepL ile gövde çevirisi, JSON çıktısı
3. **Faz 3 — Frontend okuyucu:** İki panelli reader, sol pdf.js + sağ JSON render, basit sayfa senkronu (henüz figür overlay yok)
4. **Faz 4 — Figür/diyagram overlay:** Figür bölgesi tespiti + OCR (raster diyagramlar için) + PyMuPDF overlay yazımı
5. **Faz 5 — Karışık PDF desteği:** Taranmış sayfalar için tam sayfa OCR, dil tespiti güçlendirme
6. **Faz 6 — Cache + maliyet optimizasyonu:** Çeviri cache tablosu, batch çağrılar, Claude API'yi sadece flag'li bölümlerde devreye alma
7. **Faz 7 — Prod hazırlığı:** Auth, rate limiting, S3 prod geçişi, hata/retry mekanizmaları, job progress UI (yüzde bazlı ilerleme)

Faz 1-3 çalışan bir MVP verir (figürsüz, basit PDF'ler için), Faz 4-5 asıl istediğin "karışık PDF + diyagram çevirisi" özelliğini tamamlar.
