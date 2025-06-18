from pydantic_settings import BaseSettings
from pydantic import Field
from pathlib import Path
from typing import Optional, List
import os

class Settings(BaseSettings):
    PROJECT_NAME: str = "ClipHub"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = "development"
    BACKEND_API_URL: str = "http://localhost:8000"
    
    # Firebase Configuration
    FIREBASE_API_KEY: str = ""
    FIREBASE_AUTH_DOMAIN: str = ""
    FIREBASE_PROJECT_ID: str = ""
    FIREBASE_STORAGE_BUCKET: str = ""
    FIREBASE_MESSAGING_SENDER_ID: str = ""
    FIREBASE_APP_ID: str = ""    
    FIREBASE_CREDENTIALS_PATH: str = os.getenv("FIREBASE_CREDENTIALS_PATH", "firebase-service-account.json")
    # Database
    DATABASE_URL: Optional[str] = None
    
    # Security
    SECRET_KEY: str = "your-secure-secret-key-change-me"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # CORS - Simple string that we'll parse
    ALLOWED_ORIGINS: str = "http://localhost:3000,http://192.168.97.247:3000"
    
    # Storage
    STORAGE_BUCKET: Optional[str] = None
    UPLOAD_DIR: str = str(Path(__file__).parent.parent / "uploads")
    CLOUDINARY_CLOUD_NAME: str
    CLOUDINARY_API_KEY: str
    CLOUDINARY_API_SECRET: str
    CLOUDINARY_URL: str
        
    @property
    def allowed_origins_list(self) -> List[str]:
        """Convert ALLOWED_ORIGINS string to list"""
        if not self.ALLOWED_ORIGINS:
            return ["http://localhost:3000"]
        return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(',') if origin.strip()]

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True

settings = Settings()