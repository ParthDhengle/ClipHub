from config.database import get_db
from models.media import MediaInDB, MediaCreate
from typing import Optional, List
from google.cloud import firestore
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# --------------------------
# CREATE Media
# --------------------------
async def create_media(user_id: str, media_data: MediaCreate) -> MediaInDB:
    db = get_db()
    doc_ref = db.collection("media").document()
    media_dict = {
        **media_data.dict(),
        "media_id": doc_ref.id,
        "user_id": user_id,
        "likes": 0,
        "views": 0,
        "downloads": 0,
        "status": "pending",
        "created_at": firestore.SERVER_TIMESTAMP,
        "updated_at": firestore.SERVER_TIMESTAMP
    }

    logger.info(f"Attempting to create media document: {doc_ref.id}")
    try:
        doc_ref.set(media_dict)
        doc = doc_ref.get()
        if doc.exists:
            media_data_fetched = doc.to_dict()
            logger.info(f"Media document created successfully: {doc_ref.id}")
            return MediaInDB(**media_data_fetched)
        else:
            raise Exception("Document was not created")
    except Exception as e:
        logger.error(f"Failed to create media document: {str(e)}")
        raise

# --------------------------
# GET Media by ID
# --------------------------
async def get_media(media_id: str) -> Optional[MediaInDB]:
    db = get_db()
    doc_ref = db.collection("media").document(media_id)
    doc = doc_ref.get()
    if doc.exists:
        return MediaInDB(**doc.to_dict())
    return None

# --------------------------
# LIST Media (all or by user)
# --------------------------
async def list_media(user_id: Optional[str] = None) -> List[MediaInDB]:
    db = get_db()
    query = db.collection("media")
    if user_id:
        query = query.where("user_id", "==", user_id)
    docs = query.stream()
    return [MediaInDB(**doc.to_dict()) for doc in docs]

# --------------------------
# LIKE Media
# --------------------------
async def like_media(media_id: str, user_id: str):
    db = get_db()
    doc_ref = db.collection("media").document(media_id)
    try:
        doc_ref.update({"likes": firestore.Increment(1), "updated_at": firestore.SERVER_TIMESTAMP})
        logger.info(f"User {user_id} liked media {media_id}")
    except Exception as e:
        logger.error(f"Failed to like media: {str(e)}")
        raise

# --------------------------
# UNLIKE Media
# --------------------------
async def unlike_media(media_id: str, user_id: str):
    db = get_db()
    doc_ref = db.collection("media").document(media_id)
    try:
        doc_ref.update({"likes": firestore.Increment(-1), "updated_at": firestore.SERVER_TIMESTAMP})
        logger.info(f"User {user_id} unliked media {media_id}")
    except Exception as e:
        logger.error(f"Failed to unlike media: {str(e)}")
        raise

# --------------------------
# VIEW Media
# --------------------------
async def view_media(media_id: str, user_id: str):
    db = get_db()
    doc_ref = db.collection("media").document(media_id)
    try:
        doc_ref.update({"views": firestore.Increment(1), "updated_at": firestore.SERVER_TIMESTAMP})
        logger.info(f"User {user_id} viewed media {media_id}")
    except Exception as e:
        logger.error(f"Failed to update views: {str(e)}")
        raise

# --------------------------
# DOWNLOAD Media
# --------------------------
async def download_media(media_id: str, user_id: str):
    db = get_db()
    doc_ref = db.collection("media").document(media_id)
    try:
        doc_ref.update({"downloads": firestore.Increment(1), "updated_at": firestore.SERVER_TIMESTAMP})
        logger.info(f"User {user_id} downloaded media {media_id}")
    except Exception as e:
        logger.error(f"Failed to update downloads: {str(e)}")
        raise
