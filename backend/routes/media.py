from fastapi import APIRouter, Depends, HTTPException
from models.media import MediaCreate, MediaInDB
from services.media_service import create_media, get_media, list_media, like_media, unlike_media, download_media, view_media
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

@router.post("/{media_id}/like")
async def like_media_endpoint(media_id: str, current_user: Dict = Depends(get_current_user)):
    logger.info(f"User {current_user['user_id']} liking media: {media_id}")
    try:
        await like_media(media_id, current_user["user_id"])
        logger.info(f"Media liked: {media_id} by user: {current_user['user_id']}")
        return {"status": "success"}
    except Exception as e:
        logger.error(f"Error liking media: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to like media: {str(e)}")

@router.post("/{media_id}/unlike")
async def unlike_media_endpoint(media_id: str, current_user: Dict = Depends(get_current_user)):
    logger.info(f"User {current_user['user_id']} unliking media: {media_id}")
    try:
        await unlike_media(media_id, current_user["user_id"])
        logger.info(f"Media unliked: {media_id} by user: {current_user['user_id']}")
        return {"status": "success"}
    except Exception as e:
        logger.error(f"Error unliking media: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to unlike media: {str(e)}")

@router.post("/{media_id}/download")
async def download_media_endpoint(media_id: str, current_user: Dict = Depends(get_current_user)):
    logger.info(f"User {current_user['user_id']} downloading media: {media_id}")
    try:
        await download_media(media_id, current_user["user_id"])
        logger.info(f"Media downloaded: {media_id} by user: {current_user['user_id']}")
        return {"status": "success"}
    except Exception as e:
        logger.error(f"Error downloading media: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to download media: {str(e)}")

@router.post("/{media_id}/view")
async def view_media_endpoint(media_id: str, current_user: Dict = Depends(get_current_user)):
    logger.info(f"User {current_user['user_id']} viewing media: {media_id}")
    try:
        await view_media(media_id, current_user["user_id"])
        logger.info(f"Media viewed: {media_id} by user: {current_user['user_id']}")
        return {"status": "success"}
    except Exception as e:
        logger.error(f"Error viewing media: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to view media: {str(e)}")