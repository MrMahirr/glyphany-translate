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
