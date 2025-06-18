from fastapi import UploadFile, HTTPException
from config.settings import settings
import cloudinary
from cloudinary.uploader import upload
from cloudinary.utils import cloudinary_url
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configure Cloudinary
cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET
)

async def upload_file(file: UploadFile, folder: str) -> dict:
    try:
        # Determine resource type and thumbnail transformation
        if file.content_type.startswith("image/"):
            resource_type = "image"
            thumbnail_transformation = [{"width": 300, "crop": "scale"}]
        elif file.content_type.startswith("video/"):
            resource_type = "video"
            thumbnail_transformation = [{"width": 300, "crop": "scale"}]
        elif file.content_type.startswith("audio/"):
            resource_type = "video"  # Cloudinary handles audio as video
            thumbnail_transformation = None  # No thumbnail for audio
        else:
            resource_type = "raw"
            thumbnail_transformation = None
        
        # Upload file to Cloudinary
        result = upload(file.file, folder=folder, resource_type=resource_type)
        
        # Get the secure URL
        secure_url = result.get("secure_url")
        if not secure_url:
            raise Exception("Failed to get secure URL from Cloudinary")
        
        # Generate thumbnail URL if applicable
        if thumbnail_transformation:
            if resource_type == "image":
                thumbnail_url, _ = cloudinary_url(result["public_id"], transformation=thumbnail_transformation)
            elif resource_type == "video":
                thumbnail_url, _ = cloudinary_url(result["public_id"], resource_type="video", format="jpg", transformation=thumbnail_transformation)
        else:
            thumbnail_url = None
        
        return {"url": secure_url, "thumbnail_url": thumbnail_url}
    except Exception as e:
        logger.error(f"Cloudinary upload failed: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to upload to Cloudinary: {str(e)}")