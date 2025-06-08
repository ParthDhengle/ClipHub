# backend/models/collection.py
from pydantic import BaseModel
from typing import List, Optional

class Collection(BaseModel):
    title: str
    media: List[str]
    creator: str
    id: Optional[str] = None