from pydantic import BaseModel
from typing import Optional, List
from models.common import TimestampModel
from enum import Enum

class MediaType(str, Enum):
    PHOTO = "photo"
    VIDEO = "video"
    MUSIC = "music"
    COLLECTION = "collection"

class MediaStatus(str, Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"

class MediaBase(BaseModel):
    title: str
    url: str
    thumbnail_url: Optional[str] = None
    type: MediaType
    category_id: Optional[str] = None
    is_premium: bool = False
    tags: List[str] = []
    likes: int = 0
    views: int = 0
    downloads: int = 0
    status: MediaStatus = MediaStatus.PENDING

class MediaCreate(MediaBase):
    pass

class MediaUpdate(MediaBase):
    pass

class MediaInDB(MediaBase, TimestampModel):
    media_id: str
    user_id: str