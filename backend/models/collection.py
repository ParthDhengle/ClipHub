from pydantic import BaseModel
from typing import Optional, List
from models.common import TimestampModel

class CollectionBase(BaseModel):
    title: str
    item_count: int = 0

class CollectionCreate(CollectionBase):
    media_ids: List[str] = []

class CollectionUpdate(CollectionBase):
    media_ids: Optional[List[str]] = None

class CollectionInDB(CollectionBase, TimestampModel):
    collection_id: str
    user_id: str
    media_ids: List[str]