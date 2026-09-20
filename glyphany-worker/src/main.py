import time
import json
import redis
import logging
import os
from src.config import REDIS_URL
from src.services.database import update_job_status, update_job_progress, update_job_completed, update_job_failed
from src.services.storage import download_file, upload_file
from src.services.pdf_processor import process_pdf

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger("worker")

def main():
    if not REDIS_URL:
        logger.error("REDIS_URL is not set")
        return

    redis_client = redis.Redis.from_url(REDIS_URL, decode_responses=True)
    queue_name = "translation_queue"

    logger.info(f"Worker started. Listening to queue: {queue_name}")

    while True:
        try:
            # BRPOP blocks until a message is available
            result = redis_client.brpop(queue_name, timeout=0)
            if result:
                _, message = result
                job_data = json.loads(message)
                job_id = job_data.get("job_id")
                
                logger.info(f"Received job: {job_id}")
                
                if job_id:
                    # Also need to extract S3 keys and languages from job_data or DB. 
                    # For now, we assume the backend passed them in job_data, or we can fetch them from DB.
                    # Actually, we added original_file_name to jobs in DB, but backend queue sends job_id.
                    # Backend currently only sends: {"job_id": "uuid"} (assuming).
                    # We can fetch job info from DB, or expect backend to provide it.
                    # Let's fetch job details from DB to get the user_id for the S3 path.
                    
                    try:
                        # 1. status -> processing
                        update_job_status(job_id, "processing")
                        update_job_progress(job_id, percentage=5, current_step="initializing_worker", estimated_time=120)
                        
                        # In a real scenario, we fetch the job from DB to get the actual s3 paths.
                        # For this implementation, let's assume standard paths based on job_id.
                        # Back-end uploads to: uploads/{user_id}/{job_id}.pdf
                        # Since we don't have user_id easily here without DB query, let's just query it.
                        import psycopg2
                        from psycopg2.extras import RealDictCursor
                        from src.services.database import get_db_connection
                        
                        conn = get_db_connection()
                        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
                            cur.execute("SELECT user_id, source_pdf_path, original_file_name, target_lang FROM jobs WHERE id = %s", (job_id,))
                            job_row = cur.fetchone()
                        conn.close()
                        
                        if not job_row:
                            raise ValueError(f"Job {job_id} not found in database.")
                            
                        user_id = job_row["user_id"]
                        source_pdf_path = job_row["source_pdf_path"]
                        target_lang = job_row["target_lang"] or "TR"
                        
                        # Paths
                        s3_input_key = source_pdf_path
                        local_input_path = f"/tmp/{job_id}_input.pdf"
                        local_output_pdf = f"/tmp/{job_id}_output.pdf"
                        local_output_json = f"/tmp/{job_id}_output.json"
                        
                        s3_output_pdf_key = f"translations/{job_id}.pdf"
                        s3_output_json_key = f"translations/{job_id}.json"
                        
                        # Step: Downloading from S3
                        update_job_progress(job_id, percentage=10, current_step="downloading_file", estimated_time=115)
                        download_file(s3_input_key, local_input_path)
                        
                        # Step: Processing and Translating
                        # By default we pass 'auto' -> 'TR' since we haven't fetched settings
                        page_count = process_pdf(
                            job_id=job_id,
                            input_path=local_input_path,
                            output_pdf_path=local_output_pdf,
                            output_json_path=local_output_json,
                            source_lang="EN", # Should ideally come from job request
                            target_lang=target_lang
                        )
                        
                        # Step: Uploading to S3
                        update_job_progress(job_id, percentage=90, current_step="uploading_results", estimated_time=10)
                        upload_file(local_output_pdf, s3_output_pdf_key)
                        upload_file(local_output_json, s3_output_json_key)
                        
                        # Step: Finalizing
                        update_job_progress(job_id, percentage=95, current_step="finalizing", estimated_time=2)
                        
                        # status -> completed
                        update_job_completed(
                            job_id, 
                            output_pdf_path=s3_output_pdf_key,
                            output_json_path=s3_output_json_key,
                            detected_source_lang="EN",
                            page_count=page_count
                        )
                        logger.info(f"Job {job_id}: Processing completed successfully.")
                        
                        # Cleanup local files
                        try:
                            os.remove(local_input_path)
                            os.remove(local_output_pdf)
                            os.remove(local_output_json)
                        except OSError:
                            pass
                        
                    except Exception as job_err:
                        logger.error(f"Error processing job {job_id}: {job_err}")
                        update_job_failed(job_id, str(job_err))
        except Exception as e:
            logger.error(f"Error in worker loop: {e}")
            time.sleep(5) # Backoff on error

if __name__ == "__main__":
    main()
