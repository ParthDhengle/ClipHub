from fastapi import APIRouter, Depends, HTTPException
from pymongo import MongoClient
from passlib.context import CryptContext
from models.user import User, UserInDB
from datetime import datetime, timedelta
import jwt
from dotenv import load_dotenv
import os

load_dotenv()
router = APIRouter()
client = MongoClient(os.getenv("MONGODB_URI", "mongodb://localhost:27017"))
db = client["cliphub"]
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@router.post("/register")
async def register(user: User):
    existing_user = db.users.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_password = pwd_context.hash(user.password)
    user_dict = user.dict()
    user_dict["hashed_password"] = hashed_password
    del user_dict["password"]
    result = db.users.insert_one(user_dict)
    return {"id": str(result.inserted_id), "name": user.name, "email": user.email}

@router.post("/login")
async def login(user: User):
    db_user = db.users.find_one({"email": user.email})
    if not db_user or not pwd_context.verify(user.password, db_user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = jwt.encode(
        {"sub": str(db_user["_id"]), "role": db_user["role"], "exp": datetime.utcnow() + timedelta(hours=1)},
        os.getenv("JWT_SECRET"),
        algorithm="HS256"
    )
    return {"token": token, "user": {"id": str(db_user["_id"]), "name": db_user["name"], "email": db_user["email"]}}
