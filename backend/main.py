from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config.settings import settings
from middleware.error import add_error_handling
from routes import auth, user, media, collection, analytics, admin, upload,preferences
import os
import sys
sys.path.append(os.path.abspath(os.path.dirname(__file__)))
                                   
app = FastAPI(title="ClipHub API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add error handling middleware
add_error_handling(app)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(user.router, prefix="/api/users", tags=["users"])
app.include_router(media.router, prefix="/api/media", tags=["media"])
app.include_router(collection.router, prefix="/api/collections", tags=["collections"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["analytics"])
app.include_router(admin.router, prefix="/api/admin", tags=["admin"])
app.include_router(upload.router, prefix="/api/upload", tags=["upload"])
app.include_router(preferences.router, prefix="/api/user")
                   
@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)