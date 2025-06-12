from fastapi import APIRouter, Depends, HTTPException
from services.user_service import get_user
from middleware.auth import get_current_user
from typing import Dict

router = APIRouter()

@router.get("/users/{user_id}")
async def get_user_admin(user_id: str, current_user: Dict = Depends(get_current_user)):
    # Simple admin check (extend with proper RBAC)
    if not current_user["user_id"].startswith("admin_"):
        raise HTTPException(status_code=403, detail="Admin access required")
    user = await get_user(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user