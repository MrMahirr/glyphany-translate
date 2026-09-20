# Hibrit Çeviri Motoru Kurulum ve Entegrasyon Planı
**(Qwen3 8B + LibreTranslate — 16GB RAM / 12 Core CPU için Optimize Edilmiş)**

Bu plan, 16GB RAM'li ve GPU'suz bir Linux sunucusunda OOM (Out of Memory) hatası almadan, uzun metinlerde yüksek kalite (Qwen3 8B) ve kısa/basit metinlerde yüksek hız (LibreTranslate) elde etmek için tasarlanmış hibrit mimarinin kurulumunu adım adım anlatır.

---

## 0. Mimari Özet

- **Ollama (Qwen3 8B):** Uzun paragraflar, bağlam gerektiren akademik/karmaşık metinler ve terim tutarlılığı (Multi-Pass) için kullanılacak. RAM tüketimi: ~5-6 GB.
- **LibreTranslate:** Kısa başlıklar, tablo verileri, figür etiketleri veya Ollama'nın zaman aşımına uğradığı durumlar için (Fallback) kullanılacak. RAM tüketimi: ~2 GB.
- **Router (Yönlendirici):** Gelen metnin uzunluğuna ve içeriğine bakarak hangi motora gideceğine dinamik karar verecek.
- **Worker (Python):** Çeviri isteklerini yönetecek ve her iki motorla da REST API üzerinden (HTTP `requests`) haberleşecek.

---

## Adım 1: Docker Compose Yapılandırması

Mevcut `docker-compose.yml` dosyanıza her iki çeviri motorunu ekleyeceğiz.

```yaml
# docker-compose.yml (Mevcut servislere eklenecek kısım)

  # 1. LibreTranslate Servisi
  libretranslate:
    image: libretranslate/libretranslate:latest
    ports:
      - "5000:5000"
    environment:
      # Sadece gerekli dilleri yükleyerek RAM tasarrufu (Örn: İngilizce, Türkçe, Almanca)
      - LT_LOAD_ONLY=en,tr,de
    volumes:
      - libretranslate_data:/home/libretranslate/.local
    restart: unless-stopped

  # 2. Ollama Servisi (CPU Modunda)
  ollama:
    image: ollama/ollama:latest
    ports:
      - "11434:11434"
    volumes:
      - ollama_data:/root/.ollama
    restart: unless-stopped

volumes:
  # Mevcut volume'lerin altına eklenecek
  libretranslate_data:
  ollama_data:
```

### Modellerin İndirilmesi
Sunucuda `docker compose up -d` çalıştırdıktan sonra, Ollama konteyneri içine girip Qwen3 8B modelini indireceğiz:
```bash
docker exec -it <proje_adi>-ollama-1 ollama pull qwen:8b
```

---

## Adım 2: Worker (Python) Bağımlılıkları ve Hazırlık

Worker projesi HTTP üzerinden bu motorlara istek atacağı için `requests` kütüphanesi yeterlidir. Eğer asenkron HTTP kullanılacaksa `aiohttp` eklenebilir.

`glyphany-worker/requirements.txt`:
```text
redis==5.*
psycopg2-binary==2.*
boto3==1.*
python-dotenv==1.*
requests==2.*
aiohttp==3.*  # Asenkron pipeline için önerilir
```

`glyphany-worker/src/config.py` dosyasına endpoint'leri ekleyeceğiz:
```python
OLLAMA_API_URL = os.getenv("OLLAMA_API_URL", "http://ollama:11434/api/generate")
LIBRETRANSLATE_API_URL = os.getenv("LIBRETRANSLATE_API_URL", "http://libretranslate:5000/translate")
```

---

## Adım 3: Çeviri Motorlarının Entegrasyonu (Strategy Pattern)

SOLID'in Open/Closed prensibine uygun olarak motorları soyutlayacağız.

`src/services/translation/base.py`:
```python
from abc import ABC, abstractmethod

class TranslationEngine(ABC):
    @abstractmethod
    async def translate(self, text: str, source_lang: str, target_lang: str, **kwargs) -> str:
        pass
```

`src/services/translation/libre_engine.py`:
```python
import aiohttp
from src.config import LIBRETRANSLATE_API_URL
from .base import TranslationEngine

class LibreTranslateEngine(TranslationEngine):
    async def translate(self, text: str, source_lang: str, target_lang: str, **kwargs) -> str:
        async with aiohttp.ClientSession() as session:
            payload = {
                "q": text,
                "source": source_lang.lower(),
                "target": target_lang.lower()
            }
            async with session.post(LIBRETRANSLATE_API_URL, json=payload) as response:
                response.raise_for_status()
                data = await response.json()
                return data["translatedText"]
```

`src/services/translation/ollama_engine.py`:
```python
import aiohttp
from src.config import OLLAMA_API_URL
from .base import TranslationEngine

class OllamaEngine(TranslationEngine):
    def __init__(self, model_name="qwen:8b"):
        self.model_name = model_name

    async def translate(self, text: str, source_lang: str, target_lang: str, **kwargs) -> str:
        prompt = kwargs.get("prompt") or f"Translate the following text from {source_lang} to {target_lang}. Output ONLY the translated text, nothing else.\n\nText: {text}"
        
        async with aiohttp.ClientSession() as session:
            payload = {
                "model": self.model_name,
                "prompt": prompt,
                "stream": False
            }
            # CPU'da çalıştığı için timeout yüksek tutulmalı
            async with session.post(OLLAMA_API_URL, json=payload, timeout=300) as response:
                response.raise_for_status()
                data = await response.json()
                return data["response"].strip()
```

---

## Adım 4: Hibrit Yönlendirici (Router)

Sistemin kalbi burasıdır. Hangi metnin hangi motora gideceğine karar verir.

`src/services/translation/router.py`:
```python
import logging
from .libre_engine import LibreTranslateEngine
from .ollama_engine import OllamaEngine

logger = logging.getLogger(__name__)

class HybridTranslationRouter:
    def __init__(self):
        self.libre_engine = LibreTranslateEngine()
        self.llm_engine = OllamaEngine(model_name="qwen:8b")

    async def route_and_translate(self, text: str, source_lang: str, target_lang: str, content_type: str = "text") -> str:
        # Kural 1: Çok kısa metinler veya tablo/figür etiketleri LibreTranslate'e
        if len(text) < 100 or content_type in ["figure_label", "table_cell"]:
            logger.info("Routing to LibreTranslate (Short/Label)")
            try:
                return await self.libre_engine.translate(text, source_lang, target_lang)
            except Exception as e:
                logger.error(f"LibreTranslate failed: {e}. Falling back to LLM.")
        
        # Kural 2: Normal ve uzun paragraflar Ollama'ya
        logger.info("Routing to Ollama Qwen:8b (Long/Complex)")
        try:
            # Burada Multi-Pass Pipeline da çağrılabilir (bkz. Adım 5)
            return await self.llm_engine.translate(text, source_lang, target_lang)
        except Exception as e:
            # Kural 3: LLM timeout olursa veya çökerse, Fallback olarak LibreTranslate
            logger.error(f"Ollama failed or timeout: {e}. Falling back to LibreTranslate.")
            return await self.libre_engine.translate(text, source_lang, target_lang)
```

---

## Adım 5: Multi-Pass Pipeline Entegrasyonu (LLM İçin)

Qwen 8B gibi görece küçük bir modelden maksimum performans almak için terim çıkarımı ve bağlamlı çeviri pipeline'ı eklenmelidir.
(Önceki `perfect_translation_guide.md` dosyasındaki mantık buraya uyarlanır.)

`src/services/translation/pipeline.py`:
```python
from .ollama_engine import OllamaEngine

async def translate_paragraph_with_context(
    llm: OllamaEngine, 
    paragraph: str, 
    prev_context: str, 
    source_lang: str, 
    target_lang: str,
    glossary: str = ""
):
    prompt = f"""You are a professional translator. Translate from {source_lang} to {target_lang}.
Maintain formatting and tone. 

GLOSSARY TO USE:
{glossary}

PREVIOUS CONTEXT (Do not translate this):
{prev_context}

TEXT TO TRANSLATE:
{paragraph}
"""
    return await llm.translate(paragraph, source_lang, target_lang, prompt=prompt)
```

Worker'ın ana döngüsünde PDF'den çıkarılan her paragraf, Router'dan geçirilir. Paragraf uzunsa pipeline fonksiyonları işletilir.

---

## Adım 6: Sunucu Optimizasyonları (16GB RAM İçin Kritik Kurallar)

1. **Eşzamanlılık (Concurrency) Sınırı:** Python Worker, Ollama'ya aynı anda (paralel) birden fazla istek atmamalıdır. CPU ve RAM anında tükenir. Çeviri işlemleri asenkron olsa bile `asyncio.Semaphore(1)` kullanılarak LLM'e tek tek istek atılması sağlanmalıdır.
2. **Ollama Keep-Alive:** Ollama, model kullanılmadığında RAM'den düşürür. İlk çeviri isteğinde modeli yüklemesi (soğuk başlangıç) zaman alır. Bunu engellemek için Ollama API'ye atılan isteklerde `keep_alive` parametresi eklenebilir veya varsayılan süre 5 dakikadır, doküman bitene kadar RAM'de kalır.
3. **LibreTranslate Optimizasyonu:** `LT_LOAD_ONLY` parametresi çok kritiktir. Sadece hedef dillerinizi (örn: `en,tr,de`) yüklerseniz 2GB RAM harcar, hepsini yüklerseniz 6-8GB RAM harcar ve Qwen'e yer kalmaz.
4. **Swap (Takas Alanı):** 16GB RAM ucu ucuna yetebilir. Linux sunucunuzda en az 8GB'lık bir Swap alanı yapılandırıldığından emin olun.
   ```bash
   sudo fallocate -l 8G /swapfile
   sudo chmod 600 /swapfile
   sudo mkswap /swapfile
   sudo swapon /swapfile
   ```

---

## Geliştirme Akışı (Roadmap)

1. **Faz 1:** `docker-compose.yml` güncellenip motorlar ayağa kaldırılacak. Postman/Curl ile motorların HTTP'den cevap verdiği teyit edilecek.
2. **Faz 2:** Python projesine `base.py`, `libre_engine.py`, `ollama_engine.py` eklenecek ve unit test yazılacak.
3. **Faz 3:** `router.py` yazılarak PDF'den gelen parse edilmiş (docling/PyMuPDF) JSON verisi üzerinden test edilecek.
4. **Faz 4:** RAM kullanımı `htop` ile izlenerek 100 sayfalık test bir PDF işleme sokulacak ve OOM (Out Of Memory) olup olmadığı gözlemlenecek.
