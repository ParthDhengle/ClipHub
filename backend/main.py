from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pymongo import MongoClient
from dotenv import load_dotenv
import os
from routes import media, user, collection, stats, admin
from middleware.auth import get_current_user

load_dotenv()
app = FastAPI()

# CORS setup for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_URL", "http://localhost:3000")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB connection
client = MongoClient(os.getenv("MONGODB_URI", "mongodb://localhost:27017"))
db = client["cliphub"]

# Mount static files for serving uploads
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Include routes
app.include_router(media.router, prefix="/api/media")
app.include_router(user.router, prefix="/api/user")
app.include_router(collection.router, prefix="/api/collections")
app.include_router(stats.router, prefix="/api/stats")
app.include_router(admin.router, prefix="/api/admin")

@app.get("/")
async def root():
    return {"message": "ClipHub FastAPI Backend"}