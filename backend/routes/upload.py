from fastapi import APIRouter, Depends, UploadFile, File
from services.storage_service import upload_file
from middleware.auth import get_current_user
from typing import Dict

router = APIRouter()

@router.post("/media")
async def upload_media(file: UploadFile = File(...), current_user: Dict = Depends(get_current_user)):
    url = await upload_file(file, "media")
    return {"url": url}