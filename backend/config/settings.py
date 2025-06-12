from pydantic_settings import BaseSettings
from typing import List
from pathlib import Path

class Settings(BaseSettings):
    FIREBASE_CREDENTIALS_PATH: str
    JWT_SECRET_KEY: str
    ALLOWED_ORIGINS: List[str]
    GCS_BUCKET_NAME: str

    class Config:
        env_file = Path(__file__).parent.parent.parent / ".env"
        env_file_encoding = "utf-8"

settings = Settings()