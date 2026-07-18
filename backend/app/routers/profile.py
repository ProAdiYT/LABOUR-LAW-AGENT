from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User
from app.schemas import ProfileUpdate, UserResponse
from app.auth import get_current_user, get_password_hash

router = APIRouter(prefix="/profile", tags=["Profile Settings"])

@router.put("/", response_model=UserResponse)
def update_profile(
    profile_in: ProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check if username is being changed and is already taken
    if profile_in.username and profile_in.username != current_user.username:
        existing_user = db.query(User).filter(User.username == profile_in.username).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already taken"
            )
        current_user.username = profile_in.username
        
    if profile_in.preferred_language:
        if profile_in.preferred_language not in ["en", "hi"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Language must be 'en' or 'hi'"
            )
        current_user.preferred_language = profile_in.preferred_language
        
    if profile_in.password:
        current_user.password_hash = get_password_hash(profile_in.password)
        
    db.commit()
    db.refresh(current_user)
    return current_user
