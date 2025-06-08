from pydantic import BaseModel
from typing import Optional

class User(BaseModel):
    name: str
    email: str
    password: str
    role: str = "creator"

class UserInDB(User):
    id: Optional[str] = None
    hashed_password: str
