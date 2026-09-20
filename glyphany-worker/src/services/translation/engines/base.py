from abc import ABC, abstractmethod

class TranslationEngine(ABC):
    @abstractmethod
    def translate(self, text: str, source_lang: str, target_lang: str, context: str = None) -> str:
        """Translates the text from source_lang to target_lang."""
        pass
    
    @abstractmethod
    def generate(self, prompt: str) -> str:
        """For complex prompt-based interactions (LLMs). Non-LLMs might just raise NotImplementedError."""
        pass
