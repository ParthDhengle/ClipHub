from pydantic import BaseModel
from typing import Optional
from models.common import TimestampModel

class AnalyticsBase(BaseModel):
    views: int = 0
    downloads: int = 0
    likes: int = 0
    engagement_rate: Optional[float] = None
    approval_rate: Optional[float] = None
    quality_score: Optional[float] = None

class AnalyticsCreate(AnalyticsBase):
    pass

class AnalyticsInDB(AnalyticsBase, TimestampModel):
    analytics_id: str
    user_id: str
    media_id: Optional[str] = None