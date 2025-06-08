from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from pymongo import MongoClient
from dotenv import load_dotenv
import os
from models.media import Media
from middleware.auth import get_current_user
import shutil

load_dotenv()
router = APIRouter()
client = MongoClient(os.getenv("MONGODB_URI", "mongodb://localhost:27017"))
db = client["cliphub"]

@router.post("/upload")
async def upload_media(
    file: UploadFile = File(...),
    title: str = Form(...),
    current_user: dict = Depends(get_current_user)
):
    file_ext = file.filename.split(".")[-1]
    file_type = "image" if file.content_type.startswith("image") else "video" if file.content_type.startswith("video") else "audio"
    file_path = f"uploads/{file_type}/{current_user['id']}_{title}_{file.filename}"
    os.makedirs(os.path.dirname(file_path), exist_ok=True)
    with open(file_path, "wb") as f:
        shutil.copyfileobj(file.file, f)
    media = Media(
        title=title,
        type=file_type,
        url=f"/{file_path}",
        creator=current_user["id"],
        approved=False
    )
    result = db.media.insert_one(media.dict())
    return media.dict() | {"id": str(result.inserted_id)}

@router.get("/")
async def get_media():
    media = list(db.media.find())
    for item in media:
        item["id"] = str(item["_id"])
        del item["_id"]
    return media
