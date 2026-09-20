import re

def select_engine(text: str) -> str:
    """
    Selects the best translation engine based on the text characteristics.
    """
    # Count words
    word_count = len(re.findall(r'\w+', text))
    
    if word_count < 10:
        # Short strings, titles, labels -> LibreTranslate is faster and sufficient
        return "libre"
    else:
        # Sentences, paragraphs -> Ollama (Qwen) provides much better contextual translation
        return "ollama"
