from fastapi import APIRouter, Depends, HTTPException
from pymongo import MongoClient
from dotenv import load_dotenv
import os
from middleware.auth import get_admin_user

load_dotenv()
router = APIRouter()
client = MongoClient(os.getenv("MONGODB_URI", "mongodb://localhost:27017"))
db = client["cliphub"]

@router.put("/media/{id}/approve")
async def approve_media(id: str, current_user: dict = Depends(get_admin_user)):
    result = db.media.find_one_and_update(
        {"_id": id},
        {"$set": {"approved": True}},
        return_document=True
    )
    if not result:
        raise HTTPException(status_code=404, detail="Media not found")
    result["id"] = str(result["_id"])
    del result["_id"]
    return result

@router.delete("/media/{id}")
async def remove_media(id: str, current_user: dict = Depends(get_admin_user)):
    result = db.media.find_one_and_delete({"_id": id})
    if not result:
        raise HTTPException(status_code=404, detail="Media not found")
    return {"message": "Media removed"}