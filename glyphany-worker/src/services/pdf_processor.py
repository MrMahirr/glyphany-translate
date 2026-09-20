import fitz # PyMuPDF
import logging
import os
import json
from collections import Counter
from langdetect import detect, DetectorFactory
from .translation.pipeline import run_translation_pipeline

# Ensure consistent language detection
DetectorFactory.seed = 0

logger = logging.getLogger("worker.pdf")

def detect_document_language(doc: fitz.Document, max_pages: int = 2) -> str:
    """
    Detect the source language of the document by sampling the first few pages.
    """
    text_samples = []
    for page_num in range(min(len(doc), max_pages)):
        page = doc[page_num]
        blocks = page.get_text("blocks")
        # Filter text blocks and append
        for b in blocks:
            if b[6] == 0 and b[4].strip():
                text_samples.append(b[4].strip())
    
    # Combine some blocks for better detection accuracy
    combined_text = " ".join(text_samples[:20])
    
    if not combined_text.strip():
        return "en" # Fallback if no text found
        
    try:
        lang_code = detect(combined_text)
        logger.info(f"Detected document language: {lang_code}")
        return lang_code
    except Exception as e:
        logger.warning(f"Language detection failed: {e}. Falling back to 'en'.")
        return "en"

def get_best_fontsize(text: str, bbox: fitz.Rect, original_size: float, fontname: str = "helv") -> float:
    """
    Estimate the maximum font size (up to original_size) that fits the text into bbox.
    """
    fontsize = original_size
    while fontsize >= 4.0:
        # A rough estimate of text width if drawn on one line
        text_len = fitz.get_text_length(text, fontname=fontname, fontsize=fontsize)
        
        # Estimate number of lines required with wrapping
        safe_width = max(1.0, bbox.width - 2.0)
        lines = (text_len / safe_width) + 1 # +1 for partial lines
        
        # Estimate height. Line height is roughly fontsize * 1.15
        estimated_height = lines * (fontsize * 1.15)
        
        if estimated_height <= bbox.height:
            return fontsize
            
        fontsize -= 0.5
        
    return 4.0 # Minimum size to keep text somewhat readable

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
    and writes them to a new PDF and JSON, preserving the original layout.
    """
    logger.info(f"Job {job_id}: Processing PDF {input_path}")
    
    doc = fitz.open(input_path)
    page_count = len(doc)
    
    final_source_lang = source_lang
    if source_lang.lower() == "auto":
        final_source_lang = detect_document_language(doc)
    
    all_translated_pages = []
    out_doc = fitz.open()

    for page_num in range(page_count):
        logger.info(f"Job {job_id}: Extracting text from page {page_num + 1}/{page_count}")
        page = doc[page_num]
        
        # Copy the original page to preserve background, images, and layout
        out_doc.insert_pdf(doc, from_page=page_num, to_page=page_num)
        out_page = out_doc[page_num]
        
        # Get blocks of text using dict to extract color and size
        dict_data = page.get_text("dict")
        blocks = dict_data.get("blocks", [])
        
        text_items = []
        text_blocks = []
        
        for b in blocks:
            if b.get("type") == 0: # Type 0 is text
                bbox = fitz.Rect(b["bbox"])
                
                # Extract all text, colors, and sizes from spans
                sizes = []
                colors = []
                full_text = ""
                
                for line in b.get("lines", []):
                    for span in line.get("spans", []):
                        sizes.append(span.get("size", 11.0))
                        colors.append(span.get("color", 0)) # Int format
                        full_text += span.get("text", "") + " "
                
                full_text = full_text.strip()
                if not full_text: 
                    continue
                
                # Find dominant size and color
                dom_size = Counter(sizes).most_common(1)[0][0] if sizes else 11.0
                dom_color_int = Counter(colors).most_common(1)[0][0] if colors else 0
                
                # Convert color int to RGB tuple (0-1 range)
                r = ((dom_color_int >> 16) & 255) / 255.0
                g = ((dom_color_int >> 8) & 255) / 255.0
                b_val = (dom_color_int & 255) / 255.0
                dom_color = (r, g, b_val)
                
                text_items.append({
                    "bbox": bbox,
                    "text": full_text,
                    "size": dom_size,
                    "color": dom_color
                })
                text_blocks.append(full_text)
        
        start_percent = 15 + int((page_num / page_count) * 70)
        end_percent = 15 + int(((page_num + 1) / page_count) * 70)
        
        translated_blocks = []
        if text_blocks:
            translated_blocks = run_translation_pipeline(
                job_id,
                text_blocks,
                final_source_lang,
                target_lang,
                start_percentage=start_percent,
                end_percentage=end_percent
            )
        
        all_translated_pages.append({
            "page": page_num + 1,
            "original_blocks": text_blocks,
            "translated_blocks": translated_blocks
        })
        
        for item, translated_text in zip(text_items, translated_blocks):
            bbox = item["bbox"]
            orig_size = item["size"]
            orig_color = item["color"]
            
            # Erase original text by drawing a white rectangle over the bounding box
            out_page.draw_rect(bbox, color=(1, 1, 1), fill=(1, 1, 1))
            
            # Calculate optimal font size
            best_size = get_best_fontsize(translated_text, bbox, orig_size, fontname="helv")
            
            # Insert translated text into the same bounding box
            out_page.insert_textbox(
                bbox,
                translated_text,
                fontsize=best_size,
                fontname="helv",
                color=orig_color,
                align=0 # Left aligned
            )

    os.makedirs(os.path.dirname(output_pdf_path), exist_ok=True)
    out_doc.save(output_pdf_path)
    out_doc.close()
    doc.close()
    
    os.makedirs(os.path.dirname(output_json_path), exist_ok=True)
    with open(output_json_path, 'w', encoding='utf-8') as f:
        json.dump(all_translated_pages, f, ensure_ascii=False, indent=2)
        
    return page_count, final_source_lang
