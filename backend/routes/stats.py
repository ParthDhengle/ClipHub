from fastapi import APIRouter
from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()
router = APIRouter()
client = MongoClient(os.getenv("MONGODB_URI", "mongodb://localhost:27017"))
db = client["cliphub"]

@router.get("/leaderboard")
async def get_leaderboard():
    pipeline = [
        {"$group": {"_id": "$creator", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
        {"$limit": 10},
        {"$lookup": {
            "from": "users",
            "localField": "_id",
            "foreignField": "_id",
            "as": "creator"
        }},
        {"$unwind": "$creator"},
        {"$project": {"_id": 0, "creator_id": "$_id", "count": 1, "creator_name": "$creator.name"}}
    ]
    stats = list(db.media.aggregate(pipeline))
    return stats
