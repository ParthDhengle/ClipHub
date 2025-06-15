from fastapi import APIRouter, Depends, HTTPException
from models.collection import CollectionCreate, CollectionInDB
from services.collection_service import create_collection, get_collection
from middleware.auth import get_current_user
from typing import Dict

router = APIRouter()

@router.post("/", response_model=CollectionInDB)
async def create_collection_endpoint(collection: CollectionCreate, current_user: Dict = Depends(get_current_user)):
    collection_in_db = await create_collection(current_user["user_id"], collection)
    return collection_in_db

@router.get("/{collection_id}", response_model=CollectionInDB)
async def get_collection_endpoint(collection_id: str):
    collection = await get_collection(collection_id)
    if not collection:
        raise HTTPException(status_code=404, detail="Collection not found")
    return collection