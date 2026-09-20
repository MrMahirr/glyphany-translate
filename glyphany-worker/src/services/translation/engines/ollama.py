import requests
import logging
import json
from .base import TranslationEngine

logger = logging.getLogger("worker.engines.ollama")

class OllamaEngine(TranslationEngine):
    def __init__(self, endpoint_url: str = "http://ollama:11434/api/generate", model: str = "qwen2.5:7b"):
        self.endpoint_url = endpoint_url
        self.model = model

    def translate(self, text: str, source_lang: str, target_lang: str, context: str = None) -> str:
        prompt = f"Translate the following text from {source_lang} to {target_lang}. Provide ONLY the translation, no extra text, no markdown backticks, no explanations.\n\nTEXT:\n{text}"
        if context:
            prompt = f"Translate the following text from {source_lang} to {target_lang}. Use the following context to understand the domain and terminology, but DO NOT translate the context.\n\nCONTEXT:\n{context}\n\nTEXT:\n{text}\n\nProvide ONLY the translation, no extra text."
            
        return self.generate(prompt)

    def generate(self, prompt: str) -> str:
        payload = {
            "model": self.model,
            "prompt": prompt,
            "stream": False,
            "options": {
                "temperature": 0.1 # Low temperature for consistent translation
            }
        }
        
        try:
            response = requests.post(self.endpoint_url, json=payload, timeout=120)
            response.raise_for_status()
            data = response.json()
            return data.get("response", "").strip()
        except Exception as e:
            logger.error(f"Ollama request failed: {e}")
            raise
