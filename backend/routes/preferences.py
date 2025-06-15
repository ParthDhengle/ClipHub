from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from services.user_service import get_user, update_user
from middleware.auth import get_current_user
from typing import Dict, List

router = APIRouter()

class PreferencesRequest(BaseModel):
    preferences: List[str]

@router.get("/preferences", response_model=List[str])
async def get_user_preferences(current_user: Dict = Depends(get_current_user)):
    """Retrieve the current user's preferences."""
    user = await get_user(current_user["user_id"])
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user.preferences

@router.post("/preferences", response_model=List[str])
async def update_user_preferences(request: PreferencesRequest, current_user: Dict = Depends(get_current_user)):
    """Update the current user's preferences."""
    update_data = {"preferences": request.preferences}
    updated_user = await update_user(current_user["user_id"], update_data)
    if not updated_user:
        raise HTTPException(status_code=404, detail="User not found")
    return updated_user.preferences