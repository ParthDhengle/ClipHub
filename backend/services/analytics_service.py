from config.database import get_db
from models.analytics import AnalyticsInDB, AnalyticsCreate
from typing import Optional

async def record_analytics(user_id: str, media_id: Optional[str], analytics_data: AnalyticsCreate) -> AnalyticsInDB:
    db = get_db()
    doc_ref = db.collection("analytics").document()
    analytics_dict = {
        **analytics_data.dict(),
        "analytics_id": doc_ref.id,
        "user_id": user_id,
        "media_id": media_id,
        "created_at": firestore.SERVER_TIMESTAMP
    }
    doc_ref.set(analytics_dict)
    return AnalyticsInDB(**analytics_dict)