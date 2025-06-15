from fastapi import Request, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from firebase_admin import auth
from typing import Optional

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
    public_paths = ["/health", "/docs", "/redoc", "/openapi.json", "/api/auth/"]
    
    if any(request.url.path.startswith(path) for path in public_paths):
        response = await call_next(request)
        return response
    
    authorization = request.headers.get("Authorization")
    if not authorization or not authorization.startswith("Bearer "):
        response = await call_next(request)
        return response
    
    token = authorization.split(" ")[1]
    
    try:
        decoded_token = auth.verify_id_token(token)
        request.state.user = decoded_token
    except Exception as e:
        print(f"Auth middleware error: {e}")
        pass
    
    response = await call_next(request)
    return response

async def require_auth(request: Request):
    """Dependency that requires authentication"""
    if not hasattr(request.state, 'user'):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required"
        )
    return request.state.user

async def optional_auth(request: Request):
    """Dependency for optional authentication"""
    return getattr(request.state, 'user', None)