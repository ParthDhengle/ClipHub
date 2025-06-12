from fastapi import APIRouter, Depends
from models.analytics import AnalyticsCreate, AnalyticsInDB
from services.analytics_service import record_analytics
from middleware.auth import get_current_user
from typing import Dict

router = APIRouter()

@router.post("/", response_model=AnalyticsInDB)
async def record_analytics_endpoint(analytics: AnalyticsCreate, current_user: Dict = Depends(get_current_user)):
    analytics_in_db = await record_analytics(current_user["user_id"], None, analytics)
    return analytics_in_db