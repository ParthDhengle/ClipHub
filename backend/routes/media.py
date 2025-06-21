from fastapi import APIRouter, Depends, HTTPException, Request
from models.media import MediaCreate, MediaInDB
from services.media_service import (
    create_media,
    get_media,
    list_media,
    like_media,
    unlike_media,
    download_media,
    view_media
)
from middleware.auth import get_current_user
from typing import List, Dict
import os
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/api/media",
    tags=["Media"]
)

# ----------------------
# Create Media
# ----------------------
@router.post("/", response_model=MediaInDB)
async def create_media_endpoint(
    media: MediaCreate,
    current_user: Dict = Depends(get_current_user)
):
    logger.info(f"Received request to create media for user: {current_user['user_id']}")
    try:
        media_in_db = await create_media(current_user["user_id"], media)
        logger.info(f"Media created successfully: {media_in_db.media_id}")
        return media_in_db
    except Exception as e:
        logger.error(f"Error creating media: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to create media: {str(e)}")

# ----------------------
# Get Media by ID
# ----------------------
@router.get("/{media_id}", response_model=MediaInDB)
async def get_media_endpoint(media_id: str):
    logger.info(f"Fetching media with ID: {media_id}")
    media = await get_media(media_id)
    if not media:
        logger.warning(f"Media not found: {media_id}")
        raise HTTPException(status_code=404, detail="Media not found")
    logger.info(f"Media retrieved: {media_id}")
    return media

# ----------------------
# List Media for User
# ----------------------
@router.get("/", response_model=List[MediaInDB])
async def list_media_endpoint(current_user: Dict = Depends(get_current_user)):
    logger.info(f"Listing media for user: {current_user['user_id']}")
    try:
        media_list = await list_media(current_user["user_id"])
        logger.info(f"Found {len(media_list)} media items for user: {current_user['user_id']}")
        return media_list
    except Exception as e:
        logger.error(f"Error listing media: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to list media")

# ----------------------
# Like Media
# ----------------------
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

# ----------------------
# Unlike Media
# ----------------------
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

# ----------------------
# Download Media
# ----------------------
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

# ----------------------
# View Media
# ----------------------
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

# ----------------------
# List Public Photos (No Auth)
# ----------------------
@router.get("/photos")
async def list_photos():
    photo_dir = "uploads/photos"
    try:
        files = [
            f for f in os.listdir(photo_dir)
            if os.path.isfile(os.path.join(photo_dir, f))
        ]
        return [
            {
                "filename": f,
                "url": f"/photos/{f}",
                "type": "image/jpeg",  # You can improve this using `mimetypes.guess_type()`
                "size": os.path.getsize(os.path.join(photo_dir, f))
            }
            for f in files
        ]
    except Exception as e:
        logger.error(f"Error listing photos: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to list photos")

# ----------------------
# List Media by Type (photos, videos, music) – For Public Pages
# ----------------------
@router.get("/list")
async def list_public_media(media_type: str):
    if media_type not in ["photos", "videos", "music"]:
        raise HTTPException(status_code=400, detail="Invalid media type")

    folder = f"uploads/{media_type}"
    try:
        files = [
            f for f in os.listdir(folder)
            if os.path.isfile(os.path.join(folder, f))
        ]
        urls = [f"/{media_type}/{f}" for f in files]
        return {"files": urls}
    except Exception as e:
        logger.error(f"Failed to list media: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to read media folder")
