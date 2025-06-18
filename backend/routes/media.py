from fastapi import APIRouter, Depends, HTTPException
from models.media import MediaCreate, MediaInDB
from services.media_service import create_media, get_media, list_media
from middleware.auth import get_current_user
from typing import List, Dict
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/", response_model=MediaInDB)
async def create_media_endpoint(media: MediaCreate, current_user: Dict = Depends(get_current_user)):
    logger.info(f"Received request to create media for user: {current_user['user_id']}")
    try:
        media_in_db = await create_media(current_user["user_id"], media)
        logger.info(f"Media created successfully: {media_in_db.media_id}")
        return media_in_db
    except Exception as e:
        logger.error(f"Error creating media: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to create media: {str(e)}")

@router.get("/{media_id}", response_model=MediaInDB)
async def get_media_endpoint(media_id: str):
    logger.info(f"Fetching media with ID: {media_id}")
    media = await get_media(media_id)
    if not media:
        logger.warning(f"Media not found: {media_id}")
        raise HTTPException(status_code=404, detail="Media not found")
    logger.info(f"Media retrieved: {media_id}")
    return media

@router.get("/", response_model=List[MediaInDB])
async def list_media_endpoint(current_user: Dict = Depends(get_current_user)):
    logger.info(f"Listing media for user: {current_user['user_id']}")
    media_list = await list_media(current_user["user_id"])
    logger.info(f"Found {len(media_list)} media items for user: {current_user['user_id']}")
    return media_list