from pydantic import BaseModel
from typing import Optional

class Media(BaseModel):
    title: str
    type: str
    url: str
    creator: str
    approved: bool = False
    id: Optional[str] = None