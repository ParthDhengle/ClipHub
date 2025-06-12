from pydantic import BaseModel, EmailStr
from typing import Optional
from models.common import TimestampModel

class UserBase(BaseModel):
    email: EmailStr
    name: Optional[str] = None
    avatar_url: Optional[str] = None
    bio: Optional[str] = None
    location: Optional[str] = None
    specialty: Optional[str] = None
    is_verified: bool = False

class UserCreate(UserBase):
    password: str

class UserUpdate(UserBase):
    pass

class UserInDB(UserBase, TimestampModel):
    user_id: str
    subscription_id: Optional[str] = None