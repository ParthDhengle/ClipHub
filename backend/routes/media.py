from fastapi import APIRouter, Depends, HTTPException
from models.media import MediaCreate, MediaInDB
from services.media_service import create_media, get_media, list_media
from middleware.auth import get_current_user
from typing import List, Dict

router = APIRouter()

@router.post("/", response_model=MediaInDB)
async def create_media_endpoint(media: MediaCreate, current_user: Dict = Depends(get_current_user)):
    media_in_db = await create_media(current_user["user_id"], media)
    return media_in_db

@router.get("/{media_id}", response_model=MediaInDB)
async def get_media_endpoint(media_id: str):
    media = await get_media(media_id)
    if not media:
        raise HTTPException(status_code=404, detail="Media not found")
    return media

@router.get("/", response_model=List[MediaInDB])
async def list_media_endpoint(current_user: Dict = Depends(get_current_user)):
    media_list = await list_media(current_user["user_id"])
    return media_list
