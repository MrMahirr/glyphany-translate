import logging
from .engines.factory import create_engine
from .router import select_engine
from ..database import update_job_progress

logger = logging.getLogger("worker.pipeline")

def run_translation_pipeline(
    job_id: str,
    text_blocks: list[str],
    source_lang: str,
    target_lang: str,
    start_percentage: int = 15,
    end_percentage: int = 85
) -> list[str]:
    """
    Translates a list of text blocks.
    It routes each block to the most appropriate engine (Libre vs Ollama).
    Updates job progress in the database as it translates.
    """
    total_blocks = len(text_blocks)
    translated_blocks = []
    
    # Instantiate engines once to reuse them
    libre_engine = create_engine("libre")
    ollama_engine = create_engine("ollama")

    for i, block in enumerate(text_blocks):
        if not block.strip():
            translated_blocks.append(block)
            continue
            
        # Select engine based on block length
        engine_type = select_engine(block)
        engine = libre_engine if engine_type == "libre" else ollama_engine
        
        # Build context from previous block if it exists
        context = text_blocks[i-1] if i > 0 else None
        
        try:
            logger.info(f"Job {job_id}: Translating block {i+1}/{total_blocks} using {engine_type}...")
            
            translated_text = engine.translate(
                text=block, 
                source_lang=source_lang, 
                target_lang=target_lang, 
                context=context if engine_type == "ollama" else None
            )
            translated_blocks.append(translated_text)
            
        except Exception as e:
            logger.error(f"Job {job_id}: Translation failed for block {i+1} with {engine_type}: {e}")
            # Fallback to original text on error
            translated_blocks.append(block)
            
        # Update progress
        if total_blocks > 0:
            current_percent = start_percentage + int((i / total_blocks) * (end_percentage - start_percentage))
            update_job_progress(
                job_id, 
                percentage=current_percent, 
                current_step="translating"
            )

    return translated_blocks
