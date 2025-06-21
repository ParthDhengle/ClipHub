import os
import shutil
import uuid
import logging
from fastapi import FastAPI, UploadFile, File, APIRouter, status, HTTPException, Request, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
from typing import Annotated
from pydantic import BaseModel, Field

# ---------- Logging ----------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# ---------- Settings ----------
class Settings(BaseModel):
    allowed_origins: list[str] = Field(
        default=["http://localhost:3000"],
        description="Allowed CORS origins"
    )
    max_file_size: int = Field(
        default=1024 * 1024 * 100,  # 100MB
        description="Max upload size"
    )
    allowed_file_types: list[str] = Field(
        default=["image/jpeg", "image/png", "video/mp4", "audio/mpeg"],
        description="Allowed MIME types"
    )

settings = Settings()

# ---------- Startup/Shutdown ----------
@asynccontextmanager
async def lifespan(app: FastAPI):
    for dir_path in ["uploads/photos", "uploads/videos", "uploads/music"]:
        os.makedirs(dir_path, exist_ok=True)
        logger.info(f"Ensured directory exists: {dir_path}")
    yield
    logger.info("Application is shutting down.")

# ---------- App Setup ----------
app = FastAPI(
    title="ClipHub API",
    description="Media upload and serving API",
    version="1.0.0",
    lifespan=lifespan
)

# ---------- Middleware ----------
@app.middleware("http")
async def security_headers_middleware(request, call_next):
    response = await call_next(request)
    response.headers.update({
        "Strict-Transport-Security": "max-age=63072000; includeSubDomains",
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "DENY",
        "X-XSS-Protection": "1; mode=block"
    })
    return response

@app.middleware("http")
async def log_requests(request, call_next):
    logger.info(f"Incoming request: {request.method} {request.url}")
    try:
        response = await call_next(request)
    except Exception as e:
        logger.error(f"Request failed: {str(e)}")
        raise
    logger.info(f"Response status: {response.status_code}")
    return response

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- Custom Exceptions ----------
class CustomException(Exception):
    def __init__(self, message: str, code: int = 400):
        self.message = message
        self.code = code

@app.exception_handler(CustomException)
async def custom_exception_handler(request, exc: CustomException):
    return JSONResponse(status_code=exc.code, content={"error": exc.message})

@app.exception_handler(413)
async def request_too_large_handler(request, exc):
    return JSONResponse(
        status_code=413,
        content={"error": "File size exceeds maximum allowed limit"}
    )

# ---------- Media Upload Router ----------
media_router = APIRouter(
    prefix="/api/media",
    tags=["Media"],
    responses={404: {"description": "Not found"}}
)

@media_router.post("/upload", status_code=status.HTTP_201_CREATED)
async def upload_media(
    request: Request,
    file: Annotated[UploadFile, File(description="Upload a media file")]
):
    if file.content_type not in settings.allowed_file_types:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type: {file.content_type}"
        )

    file.file.seek(0, 2)
    file_size = file.file.tell()
    file.file.seek(0)
    if file_size > settings.max_file_size:
        raise HTTPException(
            status_code=413,
            detail="File size exceeds limit"
        )

    media_type = "photos"
    if "video" in file.content_type:
        media_type = "videos"
    elif "audio" in file.content_type:
        media_type = "music"

    upload_dir = f"uploads/{media_type}"
    unique_filename = f"{uuid.uuid4().hex}_{file.filename}"
    file_path = os.path.join(upload_dir, unique_filename)

    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except IOError as e:
        logger.error(f"File upload failed: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to save file")

    return {
        "filename": file.filename,
        "saved_as": unique_filename,
        "url": f"{request.base_url}{media_type}/{unique_filename}",
        "size": file_size,
        "type": file.content_type
    }

# ---------- List Media Route ----------
@media_router.get("/list")
async def list_media(media_type: str = Query(..., description="photos | videos | music")):
    if media_type not in ["photos", "videos", "music"]:
        raise HTTPException(status_code=400, detail="Invalid media type")

    folder = f"uploads/{media_type}"
    try:
        files = os.listdir(folder)
        urls = [f"/{media_type}/{filename}" for filename in files]
        return {"files": urls}
    except Exception as e:
        logger.error(f"Failed to list media: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to read media folder")

# ---------- Static Files Mount ----------
for dir_path in ["uploads/photos", "uploads/videos", "uploads/music"]:
    os.makedirs(dir_path, exist_ok=True)

app.mount("/photos", StaticFiles(directory="uploads/photos"), name="photos")
app.mount("/videos", StaticFiles(directory="uploads/videos"), name="videos")
app.mount("/music", StaticFiles(directory="uploads/music"), name="music")

# ---------- Include Routers ----------
app.include_router(media_router)

# ---------- Health Check ----------
@app.get("/health", include_in_schema=False)
async def health_check():
    return {"status": "healthy", "version": app.version}

# ---------- Run Server ----------
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
