from config.database import get_db
from models.collection import CollectionInDB, CollectionCreate
from typing import Optional, List

async def create_collection(user_id: str, collection_data: CollectionCreate) -> CollectionInDB:
    db = get_db()
    doc_ref = db.collection("collections").document()
    collection_dict = {
        **collection_data.dict(),
        "collection_id": doc_ref.id,
        "user_id": user_id,
        "created_at": firestore.SERVER_TIMESTAMP
    }
    doc_ref.set(collection_dict)
    return CollectionInDB(**collection_dict)

async def get_collection(collection_id: str) -> Optional[CollectionInDB]:
    db = get_db()
    doc_ref = db.collection("collections").document(collection_id)
    doc = doc_ref.get()
    if doc.exists:
        return CollectionInDB(**doc.to_dict())
    return None