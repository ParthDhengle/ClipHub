from fastapi import APIRouter
from ..config.database import get_db

router = APIRouter()

@router.get("/leaderboard")
async def get_leaderboard():
    db = get_db()
    media_docs = db.collection("media").stream()
    creator_counts = {}
    for doc in media_docs:
        creator_id = doc.to_dict().get("user_id")
        if creator_id:
            creator_counts[creator_id] = creator_counts.get(creator_id, 0) + 1
    top_creators = sorted(creator_counts.items(), key=lambda x: x[1], reverse=True)[:10]
    result = []
    for creator_id, count in top_creators:
        user_doc = db.collection("users").document(creator_id).get()
        if user_doc.exists:
            result.append({
                "creator_id": creator_id,
                "count": count,
                "creator_name": user_doc.to_dict().get("name", "Unknown")
            })
    return result