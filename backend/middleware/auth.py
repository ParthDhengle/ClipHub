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
        # First try to verify as Firebase ID token
        try:
            decoded_token = auth.verify_id_token(credentials.credentials)
            user_id = decoded_token["uid"]
            email = decoded_token.get("email", "")
            name = decoded_token.get("name", "")
            
            # Fetch user from Firestore
            from services.user_service import get_user
            user = await get_user(user_id)
            if user:
                return user.dict()
            else:
                # User doesn't exist in Firestore, return basic info
                return {
                    "user_id": user_id,
                    "email": email,
                    "name": name
                }
        except auth.InvalidIdTokenError:
            # If Firebase verification fails, try custom JWT
            payload = jwt.decode(credentials.credentials, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
            user_id = payload.get("sub")
            if user_id is None:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid authentication token"
                )
            
            # Fetch user from Firestore
            from services.user_service import get_user
            user = await get_user(user_id)
            return user.dict() if user else {"user_id": user_id}
            
    except JWTError as e:
        print(f"Token verification failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token"
        )
    except Exception as e:
        print(f"Authentication error: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication failed"
        )

async def get_current_user_optional(credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)):
    if not credentials:
        return None
    try:
        # First try Firebase ID token
        try:
            decoded_token = auth.verify_id_token(credentials.credentials)
            user_id = decoded_token["uid"]
            email = decoded_token.get("email", "")
            name = decoded_token.get("name", "")
            
            from services.user_service import get_user
            user = await get_user(user_id)
            if user:
                return user.dict()
            else:
                return {
                    "user_id": user_id,
                    "email": email,
                    "name": name
                }
        except auth.InvalidIdTokenError:
            # Try custom JWT
            payload = jwt.decode(credentials.credentials, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
            user_id = payload.get("sub")
            if user_id is None:
                return None
            
            from services.user_service import get_user
            user = await get_user(user_id)
            return user.dict() if user else {"user_id": user_id}
    except Exception as e:
        print(f"Optional auth error: {e}")
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
        # Try Firebase ID token first
        try:
            decoded_token = auth.verify_id_token(token)
            request.state.user = {
                "user_id": decoded_token["uid"],
                "email": decoded_token.get("email", ""),
                "name": decoded_token.get("name", "")
            }
        except auth.InvalidIdTokenError:
            # Try custom JWT
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
            request.state.user = payload
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