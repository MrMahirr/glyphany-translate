import psycopg2
from psycopg2.extras import RealDictCursor
from src.config import DATABASE_URL

def get_db_connection():
    if not DATABASE_URL:
        raise ValueError("DATABASE_URL is not set")
    return psycopg2.connect(DATABASE_URL, cursor_factory=RealDictCursor)

def update_job_status(job_id: str, status: str, error_message: str = None):
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(
                "UPDATE jobs SET status = %s, error_message = %s, updated_at = now() WHERE id = %s",
                (status, error_message, job_id)
            )
            conn.commit()
    finally:
        conn.close()

def update_job_progress(job_id: str, percentage: int, current_step: str, current_page: int = None, estimated_time: int = None):
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(
                """UPDATE jobs SET 
                   percentage = %s, 
                   current_step = %s, 
                   current_page = COALESCE(%s, current_page), 
                   estimated_time_remaining_sec = %s, 
                   updated_at = now() 
                   WHERE id = %s""",
                (percentage, current_step, current_page, estimated_time, job_id)
            )
            conn.commit()
    finally:
        conn.close()

def update_job_completed(job_id: str, output_pdf_path: str = None, output_json_path: str = None, detected_source_lang: str = None, page_count: int = None):
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(
                """UPDATE jobs SET 
                   status = 'completed',
                   percentage = 100,
                   current_step = 'completed',
                   output_pdf_path = %s,
                   output_json_path = %s,
                   source_lang = COALESCE(%s, source_lang),
                   page_count = COALESCE(%s, page_count),
                   completed_at = now(),
                   updated_at = now() 
                   WHERE id = %s""",
                (output_pdf_path, output_json_path, detected_source_lang, page_count, job_id)
            )
            conn.commit()
    finally:
        conn.close()

def update_job_failed(job_id: str, error_message: str):
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(
                """UPDATE jobs SET 
                   status = 'failed',
                   error_message = %s,
                   updated_at = now() 
                   WHERE id = %s""",
                (error_message, job_id)
            )
            conn.commit()
    finally:
        conn.close()
