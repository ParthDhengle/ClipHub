from pydantic import BaseModel, validator
from datetime import datetime
from typing import Optional, Any
from google.cloud import firestore

class TimestampModel(BaseModel):
    created_at: datetime
    updated_at: Optional[datetime] = None

    @validator("created_at", "updated_at", pre=True)
    def convert_timestamp(cls, v: Any) -> datetime:
        if isinstance(v, datetime):
            return v
        if v == firestore.SERVER_TIMESTAMP:
            return datetime.utcnow()  # Fallback for Pydantic
        raise ValueError("Invalid timestamp format")