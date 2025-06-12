from google.cloud import storage
from config.settings import settings
from fastapi import UploadFile
import uuid

async def upload_file(file: UploadFile, folder: str) -> str:
    storage_client = storage.Client()
    bucket = storage_client.bucket(settings.GCS_BUCKET_NAME)
    blob_name = f"{folder}/{uuid.uuid4()}_{file.filename}"
    blob = bucket.blob(blob_name)
    blob.upload_from_file(file.file)
    return blob.public_url