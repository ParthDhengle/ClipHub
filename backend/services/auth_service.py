from firebase_admin import auth
from fastapi import HTTPException, status
from ..models.user import UserCreate, UserInDB
from ..services.user_service import create_user
from ..utils.security import create_access_token
from datetime import timedelta , datetime
from ..config.database import get_db
from ..config.settings import settings
from google.cloud.firestore_v1 import FieldValue

async def signup(user: UserCreate) -> UserInDB:
    try:
        firebase_user = auth.create_user(
            email=user.email,
            password=user.password,
            display_name=user.name
        )
        user_data = {
            **user.dict(exclude={"password"}),
            "user_id": firebase_user.uid,
            "created_at": datetime.utcnow(),  # Use datetime for Pydantic compatibility
            "updated_at": datetime.utcnow()
        }
        user_in_db = await create_user(user_data)
        return user_in_db
    except auth.EmailAlreadyExistsError:
        raise HTTPException(status_code=400, detail="Email already registered")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Signup failed: {str(e)}")
    

async def login(token: str) -> dict:
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
                "created_at": datetime.utcnow(),  # Use datetime for Pydantic compatibility
                "updated_at": datetime.utcnow()
            }
            user_ref.set(user_data)
        
        # Generate custom JWT
        access_token = create_access_token(
            data={"sub": firebase_uid},
            expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        )
        return {"access_token": access_token, "token_type": "bearer"}
    except auth.InvalidIdTokenError:
        raise HTTPException(status_code=401, detail="Invalid authentication token")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Login failed: {str(e)}")