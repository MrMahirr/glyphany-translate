import boto3
import logging
from src.config import S3_ENDPOINT, S3_ACCESS_KEY, S3_SECRET_KEY, S3_BUCKET
import os

logger = logging.getLogger("worker.storage")

def get_s3_client():
    return boto3.client(
        's3',
        endpoint_url=S3_ENDPOINT,
        aws_access_key_id=S3_ACCESS_KEY,
        aws_secret_access_key=S3_SECRET_KEY,
        region_name="us-east-1"
    )

def download_file(s3_path: str, local_path: str):
    """Downloads a file from S3/MinIO to local disk"""
    client = get_s3_client()
    logger.info(f"Downloading s3://{S3_BUCKET}/{s3_path} to {local_path}")
    
    # Ensure directory exists
    os.makedirs(os.path.dirname(local_path), exist_ok=True)
    
    client.download_file(S3_BUCKET, s3_path, local_path)
    logger.info(f"Download complete: {local_path}")

def upload_file(local_path: str, s3_path: str):
    """Uploads a local file to S3/MinIO"""
    client = get_s3_client()
    logger.info(f"Uploading {local_path} to s3://{S3_BUCKET}/{s3_path}")
    client.upload_file(local_path, S3_BUCKET, s3_path)
    logger.info(f"Upload complete: {s3_path}")
