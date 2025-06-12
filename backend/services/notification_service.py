from config.database import get_db
from typing import Dict

async def create_notification(user_id: str, notification_data: Dict):
    db = get_db()
    doc_ref = db.collection("notifications").document()
    notification_dict = {
        "notification_id": doc_ref.id,
        "user_id": user_id,
        **notification_data,
        "created_at": firestore.SERVER_TIMESTAMP
    }
    doc_ref.set(notification_dict)
    return notification_dict