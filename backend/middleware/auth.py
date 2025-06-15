from fastapi import Request, HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from firebase_admin import auth
from typing import Optional
from jose import JWTError, jwt
from config.settings import settings

security = HTTPBearer(auto_error=False)

async def get_current_user(credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)):
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required"
        )
    try:
        payload = jwt.decode(credentials.credentials, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication token"
            )
        # Optionally fetch user from Firestore
        from services.user_service import get_user
        user = await get_user(user_id)
        return user.dict() if user else {"user_id": user_id}
    except JWTError as e:
        print(f"Token verification failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token"
        )

async def get_current_user_optional(credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)):
    if not credentials:
        return None
    try:
        payload = jwt.decode(credentials.credentials, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            return None
        from services.user_service import get_user
        user = await get_user(user_id)
        return user.dict() if user else {"user_id": user_id}
    except JWTError as e:
        print(f"Token verification failed: {e}")
        return None

async def auth_middleware(request: Request, call_next):
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
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        request.state.user = payload
    except JWTError as e:
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