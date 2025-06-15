from fastapi import APIRouter, HTTPException, status
from firebase_admin import auth
from ..config.database import get_db
from ..models.user import UserCreate, UserInDB
from ..services.auth_service import signup, login
from ..utils.validators import validate_email
from pydantic import BaseModel

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/signup", response_model=dict)
async def signup_endpoint(user_data: UserCreate):
    if not validate_email(user_data.email):
        raise HTTPException(status_code=400, detail="Invalid email format")
    try:
        user_in_db = await signup(user_data)
        access_token = create_access_token(data={"sub": user_in_db.user_id})
        return {
            "user": user_in_db.dict(),
            "access_token": access_token,
            "token_type": "bearer"
        }
    except auth.EmailAlreadyExistsError:
        raise HTTPException(status_code=400, detail="Email already registered")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Signup failed: {str(e)}")
    


class LoginRequest(BaseModel):
    token: str
@router.post("/login", response_model=dict)
async def login_endpoint(login_data: LoginRequest):
    try:
        # Verify Firebase ID token
        decoded_token = auth.verify_id_token(token)
        firebase_uid = decoded_token["uid"]
        email = decoded_token.get("email")
        
        # Check if user exists in Firestore, create if not
        db = get_db()
        user_ref = db.collection("users").document(firebase_uid)
        user_doc = user_ref.get()
        if not user_doc.exists:
            user_data = {
                "user_id": firebase_uid,
                "email": email,
                "name": decoded_token.get("name", ""),
                "avatar_url": None,
                "bio": None,
                "location": None,
                "specialty": None,
                "is_verified": False,
                "created_at": firestore.SERVER_TIMESTAMP,
                "updated_at": firestore.SERVER_TIMESTAMP
            }
            user_ref.set(user_data)
        else:
            user_data = user_doc.to_dict()
        
        # Generate custom JWT
        access_token = create_access_token(data={"sub": firebase_uid})
        return {"access_token": access_token, "token_type": "bearer"}
    except auth.InvalidIdTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token",
            headers={"WWW-Authenticate": "Bearer"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Login failed: {str(e)}")

@router.get("/")
async def auth_root():
    return {"message": "Auth endpoints"}