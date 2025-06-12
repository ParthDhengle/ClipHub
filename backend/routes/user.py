from fastapi import APIRouter, Depends
from models.user import UserUpdate, UserInDB
from services.user_service import get_user, update_user
from middleware.auth import get_current_user
from typing import Dict

router = APIRouter()

@router.get("/me", response_model=UserInDB)
async def get_current_user_endpoint(current_user: Dict = Depends(get_current_user)):
    user = await get_user(current_user["user_id"])
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.put("/me", response_model=UserInDB)
async def update_user_endpoint(user_data: UserUpdate, current_user: Dict = Depends(get_current_user)):
    user = await update_user(current_user["user_id"], user_data.dict(exclude_unset=True))
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user