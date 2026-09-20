import fitz # PyMuPDF
import logging
import os
import json
from .translation.pipeline import run_translation_pipeline

logger = logging.getLogger("worker.pdf")

def process_pdf(
    job_id: str,
    input_path: str, 
    output_pdf_path: str,
    output_json_path: str,
    source_lang: str,
    target_lang: str
):
    """
    Reads a PDF, extracts text blocks, translates them, 
    and writes them to a new PDF and JSON.
    """
    logger.info(f"Job {job_id}: Processing PDF {input_path}")
    
    # Open document
    doc = fitz.open(input_path)
    page_count = len(doc)
    
    all_translated_pages = []
    
    # Create a new PDF for output
    out_doc = fitz.open()

    for page_num in range(page_count):
        logger.info(f"Job {job_id}: Extracting text from page {page_num + 1}/{page_count}")
        page = doc[page_num]
        
        # Get blocks of text
        blocks = page.get_text("blocks")
        # Filter out image blocks (type 1) and empty strings
        text_blocks = [b[4].strip() for b in blocks if b[6] == 0 and b[4].strip()]
        
        # Calculate percentage ranges for this page
        # E.g., if 2 pages: Page 1: 15% -> 50%, Page 2: 50% -> 85%
        start_percent = 15 + int((page_num / page_count) * 70)
        end_percent = 15 + int(((page_num + 1) / page_count) * 70)
        
        # Run translation pipeline on the text blocks
        translated_blocks = run_translation_pipeline(
            job_id,
            text_blocks,
            source_lang,
            target_lang,
            start_percentage=start_percent,
            end_percentage=end_percent
        )
        
        all_translated_pages.append({
            "page": page_num + 1,
            "original_blocks": text_blocks,
            "translated_blocks": translated_blocks
        })
        
        # Write translated text to a new PDF page
        out_page = out_doc.new_page(width=page.rect.width, height=page.rect.height)
        
        y_offset = 50
        for tb in translated_blocks:
            # Very basic text insertion (no advanced layout preservation yet)
            out_page.insert_textbox(
                fitz.Rect(50, y_offset, out_page.rect.width - 50, out_page.rect.height - 50), 
                tb, 
                fontsize=11,
                fontname="helv",
                align=0 # left
            )
            # Roughly estimate height consumed by text (assume 50 chars per line)
            lines = max(1, len(tb) // 50)
            y_offset += (lines * 15) + 10
            
            if y_offset > out_page.rect.height - 50:
                # Add another page if we overflow (simple fallback)
                out_page = out_doc.new_page(width=page.rect.width, height=page.rect.height)
                y_offset = 50

    # Save outputs
    os.makedirs(os.path.dirname(output_pdf_path), exist_ok=True)
    out_doc.save(output_pdf_path)
    out_doc.close()
    doc.close()
    
    os.makedirs(os.path.dirname(output_json_path), exist_ok=True)
    with open(output_json_path, 'w', encoding='utf-8') as f:
        json.dump(all_translated_pages, f, ensure_ascii=False, indent=2)
        
    return page_count
