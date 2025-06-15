from config.database import get_db
from models.media import MediaInDB, MediaCreate
from typing import Optional, List
from google.cloud import firestore

async def create_media(user_id: str, media_data: MediaCreate) -> MediaInDB:
    db = get_db()
    doc_ref = db.collection("media").document()
    media_dict = {
        **media_data.dict(),
        "media_id": doc_ref.id,
        "user_id": user_id,
        "created_at": firestore.SERVER_TIMESTAMP
    }
    doc_ref.set(media_dict)
    return MediaInDB(**media_dict)

async def get_media(media_id: str) -> Optional[MediaInDB]:
    db = get_db()
    doc_ref = db.collection("media").document(media_id)
    doc = doc_ref.get()
    if doc.exists:
        return MediaInDB(**doc.to_dict())
    return None

async def list_media(user_id: Optional[str] = None) -> List[MediaInDB]:
    db = get_db()
    query = db.collection("media")
    if user_id:
        query = query.where("user_id", "==", user_id)
    docs = query.stream()
    return [MediaInDB(**doc.to_dict()) for doc in docs]
