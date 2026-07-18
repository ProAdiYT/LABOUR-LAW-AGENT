import os
import json
from fastapi import APIRouter, HTTPException, status
from typing import List, Dict

router = APIRouter(prefix="/rights", tags=["Labour Rights Library"])

# Helper to get the absolute path to shared JSON folder
def get_shared_file_path(filename: str) -> str:
    current_dir = os.path.dirname(os.path.abspath(__file__)) # routers/
    app_dir = os.path.dirname(current_dir)                   # app/
    backend_dir = os.path.dirname(app_dir)                   # backend/
    shared_dir = os.path.join(os.path.dirname(backend_dir), "shared") # shared/
    return os.path.join(shared_dir, filename)

@router.get("/", response_model=List[Dict])
def get_all_rights():
    file_path = get_shared_file_path("rights_library.json")
    if not os.path.exists(file_path):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Rights library file not found at {file_path}"
        )
    
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        return data
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error loading rights library: {e}"
        )

@router.get("/{right_id}", response_model=Dict)
def get_right_by_id(right_id: str):
    file_path = get_shared_file_path("rights_library.json")
    if not os.path.exists(file_path):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Rights library file not found"
        )
        
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        for item in data:
            if item["id"] == right_id:
                return item
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Right item with ID '{right_id}' not found"
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error loading right item: {e}"
        )
