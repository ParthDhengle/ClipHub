from fastapi import Request, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from config.settings import settings
import firebase_admin
from firebase_admin import auth, credentials
from typing import Optional
import os

# Initialize Firebase Admin SDK
def initialize_firebase():
    if not firebase_admin._apps:
        # Try to load service account key
        service_account_path = getattr(settings, 'FIREBASE_SERVICE_ACCOUNT_PATH', './firebase-service-account.json')
        
        if os.path.exists(service_account_path):
            cred = credentials.Certificate(service_account_path)
            firebase_admin.initialize_app(cred)
        else:
            # Initialize with default credentials (for development)
            try:
                firebase_admin.initialize_app()
            except Exception as e:
                print(f"Warning: Could not initialize Firebase Admin SDK: {e}")

# Initialize Firebase on import
initialize_firebase()

security = HTTPBearer(auto_error=False)

async def get_current_user(credentials: Optional[HTTPAuthorizationCredentials] = None):
    """Get current user from Firebase token"""
    if not credentials:
        return None
    
    try:
        # Verify Firebase ID token
        decoded_token = auth.verify_id_token(credentials.credentials)
        return decoded_token
    except Exception as e:
        print(f"Token verification failed: {e}")
        return None

async def auth_middleware(request: Request, call_next):
    """Authentication middleware for FastAPI"""
    # Skip auth for public endpoints
    public_paths = ["/health", "/docs", "/redoc", "/openapi.json", "/api/auth/"]
    
    if any(request.url.path.startswith(path) for path in public_paths):
        response = await call_next(request)
        return response
    
    # Get token from Authorization header
    authorization = request.headers.get("Authorization")
    if not authorization or not authorization.startswith("Bearer "):
        response = await call_next(request)
        return response
    
    token = authorization.split(" ")[1]
    
    try:
        # Verify Firebase token
        decoded_token = auth.verify_id_token(token)
        request.state.user = decoded_token
    except Exception as e:
        print(f"Auth middleware error: {e}")
        # Don't block request, just don't set user
        pass
    
    response = await call_next(request)
    return response

# Dependency for routes that require authentication
async def require_auth(request: Request):
    """Dependency that requires authentication"""
    if not hasattr(request.state, 'user'):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required"
        )
    return request.state.user

# Optional auth dependency
async def optional_auth(request: Request):
    """Dependency for optional authentication"""
    return getattr(request.state, 'user', None)