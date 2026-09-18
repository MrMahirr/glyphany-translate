import time
import json
import redis
import logging
from src.config import REDIS_URL
from src.services.database import update_job_status

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
                    # Update status to processing
                    update_job_status(job_id, "processing")
                    
                    # TODO: Phase 2 - PDF processing and translation logic will go here
                    logger.info(f"Processing job {job_id}...")
                    
                    # Mock processing delay
                    time.sleep(2)
                    
                    # Update status to done (mock for now)
                    # update_job_status(job_id, "done") 
                    # Note: We keep it 'processing' or simulate done, but Phase 2 will complete it.
                    logger.info(f"Job {job_id} processed (MOCK)")
                    
        except Exception as e:
            logger.error(f"Error in worker loop: {e}")
            time.sleep(5) # Backoff on error

if __name__ == "__main__":
    main()
