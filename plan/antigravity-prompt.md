Elimde `pdf-cevirmen-kurulum-plani.md` adında bir proje planı dosyası var. Bu dosyayı oku ve içindeki mimariye birebir sadık kalarak projeyi sıfırdan kur.

## Genel talimatlar

- Plan dosyasındaki mimariyi, klasör yapısını, kütüphane seçimlerini ve veritabanı şemasını değiştirmeden uygula. Farklı bir kütüphane veya yaklaşım daha iyi olacağını düşünsen bile önce bana sor, sessizce değiştirme.
- Proje kök dizininde şu üç ayrı klasörü oluştur: `pdf-translator-api` (NestJS), `pdf-translator-worker` (Python), `pdf-translator-web` (Next.js). Kökte ayrıca `docker-compose.yml` ve `.env.example` olacak.
- Plandaki "Geliştirme sırası (roadmap)" bölümündeki fazları sırayla uygula, bir fazı bitirmeden sonrakine geçme. Her fazın sonunda bana ne tamamladığını kısaca özetle ve bir sonraki faza geçmeden önce onay iste.
- Backend'de ORM kullanma, raw SQL ile ilerle (plan dosyasında da bu şekilde belirtilmiş). Migration'ları basit `.sql` dosyaları halinde `migrations/` klasöründe tut.
- Frontend'de Feature-Sliced Design klasör yapısını uygula (plandaki `src/` ağacı örnek alınacak).
- API'leri Swagger/OpenAPI ile dokümante et (NestJS tarafında `@nestjs/swagger` decorator'ları).

## Faz 1 — Altyapı

- `docker-compose.yml` dosyasını plandaki §8'e göre oluştur (postgres, redis, minio, nest-api, python-worker, next-web servisleriyle).
- `.env.example` dosyasını plandaki §9'a göre oluştur, gerçek anahtarları boş bırak.
- NestJS iskeletini kur, plandaki §5 şemasına göre `jobs` ve `page_paragraph_map` tablolarını oluşturan migration'ı yaz.
- Tek bir endpoint yap: PDF yükleme → MinIO'ya kaydetme → `jobs` tablosuna satır ekleme → Redis'e job mesajı bırakma (plandaki §4 Seçenek B'ye göre, basit `LPUSH`/`BRPOP`).
- Bu faz sonunda `docker compose up` ile tüm servislerin ayağa kalktığını ve upload endpoint'inin çalıştığını doğrula.

## Faz 2 — Worker temel akış

- Python worker'ı plandaki §2'deki kütüphanelerle kur (PyMuPDF, docling, langdetect, deepl, psycopg2-binary, boto3).
- Şimdilik sadece metin-katmanlı, taramasız PDF'lerle çalış (OCR'ı bu fazda atla).
- Redis kuyruğunu dinleyen bir worker döngüsü yaz.
- Docling ile sayfaları bölgelere ayır, gövde metnini paragraf paragraf çıkar.
- DeepL API ile paragrafları çevir (API anahtarını `.env`'den oku, henüz gerçek anahtar yoksa mock/stub bir çeviri fonksiyonuyla ilerle ve bunu bana belirt).
- Sonucu plandaki JSON formatında (`{page, paragraphs: [{original, translated}]}`) üret ve MinIO'ya yükle, `jobs` tablosunu güncelle.

## Faz 3 — Frontend okuyucu

- Next.js projesini plandaki §6'daki paket listesiyle kur.
- Upload formu + dil seçimi + job durumu polling ekranı yap.
- İki panelli okuyucuyu kur: sol panel `react-pdf` ile orijinal PDF, sağ panel worker'ın ürettiği JSON'dan render edilen çeviri metni.
- Sayfa senkronizasyonunu plandaki §6 mantığına göre uygula (sol sayfa değişince sağ panel ilgili çapaya scroll etsin, `IntersectionObserver` ile tersi de çalışsın).
- Bu fazda henüz figür/diyagram overlay yok — sadece gövde metni çeviri akışı uçtan uca çalışmalı.

## Faz 4 ve sonrası

- Faz 4 (figür/diyagram overlay), Faz 5 (karışık/taranmış PDF desteği), Faz 6 (cache ve maliyet optimizasyonu) ve Faz 7 (prod hazırlığı) için plan dosyasındaki ilgili bölümleri birebir takip et, her fazdan önce bana onay sorusu sor.

## Genel kurallar

- Her faz sonunda çalışan bir durumda bırak (build hatasız, en azından temel happy-path test edilebilir).
- Belirsiz bir nokta olursa (ör. hangi çeviri motorunun varsayılan olacağı, port numaraları) plan dosyasındaki değerleri kullan; planda da yoksa bana sor.
- Kod yazarken açıklama/yorum satırlarını Türkçe değil İngilizce yaz, commit mesajlarını kısa ve açıklayıcı tut.
