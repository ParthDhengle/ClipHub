from config.database import get_db
from models.user import UserInDB
from typing import Dict, Optional

async def create_user(user_data: Dict) -> UserInDB:
    db = get_db()
    doc_ref = db.collection("users").document(user_data["user_id"])
    doc_ref.set(user_data)
    return UserInDB(**user_data)

async def get_user(user_id: str) -> Optional[UserInDB]:
    db = get_db()
    doc_ref = db.collection("users").document(user_id)
    doc = doc_ref.get()
    if doc.exists:
        return UserInDB(**doc.to_dict())
    return None

async def update_user(user_id: str, user_data: Dict) -> Optional[UserInDB]:
    db = get_db()
    doc_ref = db.collection("users").document(user_id)
    doc_ref.update(user_data)
    doc = doc_ref.get()
    if doc.exists:
        return UserInDB(**doc.to_dict())
    return None