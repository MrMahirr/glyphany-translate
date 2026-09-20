from .base import TranslationEngine
from .libretranslate import LibreTranslateEngine
from .ollama import OllamaEngine

def create_engine(engine_type: str) -> TranslationEngine:
    if engine_type == "libre":
        return LibreTranslateEngine()
    elif engine_type == "ollama":
        # The user wanted Qwen2.5 7b as default before, I'll use it or pull it from env.
        return OllamaEngine(model="qwen2.5:7b")
    else:
        raise ValueError(f"Unknown engine type: {engine_type}")
