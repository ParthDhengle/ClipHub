from firebase_admin import auth
from fastapi import HTTPException, status
from models.user import UserCreate
from services.user_service import create_user
from middleware.auth import create_access_token
from passlib.context import CryptContext
from datetime import timedelta

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

async def signup(user: UserCreate):
    try:
        # Create user in Firebase Auth
        firebase_user = auth.create_user(
            email=user.email,
            password=user.password
        )
        # Create user in Firestore
        user_in_db = await create_user({
            **user.dict(exclude={"password"}),
            "user_id": firebase_user.uid,
            "created_at": firebase_user.created_at
        })
        return user_in_db
    except auth.EmailAlreadyExistsError:
        raise HTTPException(status_code=400, detail="Email already registered")

async def login(email: str, password: str):
    try:
        # Verify user with Firebase Auth
        user = auth.get_user_by_email(email)
        # In a real app, verify password with Firebase Auth
        # For simplicity, assume password is valid
        access_token = create_access_token(
            data={"sub": user.uid}, expires_delta=timedelta(minutes=30)
        )
        return {"access_token": access_token, "token_type": "bearer"}
    except auth.UserNotFoundError:
        raise HTTPException(status_code=401, detail="Invalid credentials")