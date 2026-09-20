import requests
import logging
from .base import TranslationEngine

logger = logging.getLogger("worker.engines.libre")

class LibreTranslateEngine(TranslationEngine):
    def __init__(self, endpoint_url: str = "http://libretranslate:5000/translate"):
        self.endpoint_url = endpoint_url

    def translate(self, text: str, source_lang: str, target_lang: str, context: str = None) -> str:
        # Libretranslate usually expects language codes like 'en', 'tr'
        payload = {
            "q": text,
            "source": source_lang.lower() if source_lang else "auto",
            "target": target_lang.lower(),
            "format": "text"
        }
        
        try:
            response = requests.post(self.endpoint_url, json=payload, timeout=10)
            response.raise_for_status()
            data = response.json()
            return data.get("translatedText", text)
        except Exception as e:
            logger.error(f"LibreTranslate request failed: {e}")
            raise

    def generate(self, prompt: str) -> str:
        raise NotImplementedError("LibreTranslate does not support raw prompts.")
