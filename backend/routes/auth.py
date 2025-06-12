from fastapi import APIRouter, HTTPException
from models.user import UserCreate
from services.auth_service import signup, login
from pydantic import EmailStr

router = APIRouter()

@router.post("/signup")
async def signup_endpoint(user: UserCreate):
    user_in_db = await signup(user)
    return user_in_db

@router.post("/login")
async def login_endpoint(email: EmailStr, password: str):
    token = await login(email, password)
    return token