from config.database import get_db
from models.media import MediaInDB, MediaCreate
from typing import Optional, List
from google.cloud import firestore
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def create_media(user_id: str, media_data: MediaCreate) -> MediaInDB:
    db = get_db()
    doc_ref = db.collection("media").document()
    media_dict = {
        **media_data.dict(),
        "media_id": doc_ref.id,
        "user_id": user_id,
        "created_at": firestore.SERVER_TIMESTAMP
    }
    logger.info(f"Attempting to create media document: {doc_ref.id} with data: {media_dict}")
    try:
        doc_ref.set(media_dict)
        logger.info(f"Media document created successfully: {doc_ref.id}")
    except Exception as e:
        logger.error(f"Failed to set media document: {str(e)}")
        raise
    return MediaInDB(**media_dict)

async def get_media(media_id: str) -> Optional[MediaInDB]:
    db = get_db()
    doc_ref = db.collection("media").document(media_id)
    logger.info(f"Retrieving media document: {media_id}")
    doc = doc_ref.get()
    if doc.exists:
        logger.info(f"Media document found: {media_id}")
        return MediaInDB(**doc.to_dict())
    logger.info(f"No media document found for ID: {media_id}")
    return None

async def list_media(user_id: Optional[str] = None) -> List[MediaInDB]:
    db = get_db()
    query = db.collection("media")
    if user_id:
        query = query.where("user_id", "==", user_id)
    logger.info(f"Querying media for user_id: {user_id}")
    docs = query.stream()
    media_list = [MediaInDB(**doc.to_dict()) for doc in docs]
    logger.info(f"Retrieved {len(media_list)} media items")
    return media_list