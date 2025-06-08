from fastapi import APIRouter, Depends, HTTPException
from pymongo import MongoClient
from dotenv import load_dotenv
import os
from models.collection import Collection
from middleware.auth import get_current_user

load_dotenv()
router = APIRouter()
client = MongoClient(os.getenv("MONGODB_URI", "mongodb://localhost:27017"))
db = client["cliphub"]

@router.post("/")
async def create_collection(collection: Collection, current_user: dict = Depends(get_current_user)):
    collection.creator = current_user["id"]
    for media_id in collection.media:
        if not db.media.find_one({"_id": media_id}):
            raise HTTPException(status_code=404, detail=f"Media {media_id} not found")
    result = db.collections.insert_one(collection.dict())
    return collection.dict() | {"id": str(result.inserted_id)}

@router.get("/")
async def get_collections():
    collections = list(db.collections.find())
    for item in collections:
        item["id"] = str(item["_id"])
        del item["_id"]
    return collections