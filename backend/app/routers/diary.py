from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models import User, DiaryEntry
from app.schemas import DiaryEntryCreate, DiaryEntryResponse
from app.auth import get_current_user

router = APIRouter(prefix="/diary", tags=["Worker Diary"])

@router.get("/", response_model=List[DiaryEntryResponse])
def get_diary_entries(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    entries = db.query(DiaryEntry).filter(DiaryEntry.user_id == current_user.id).order_by(DiaryEntry.date.desc()).all()
    return entries

@router.post("/", response_model=DiaryEntryResponse, status_code=status.HTTP_201_CREATED)
def create_diary_entry(
    entry_in: DiaryEntryCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_entry = DiaryEntry(
        user_id=current_user.id,
        date=entry_in.date,
        employer=entry_in.employer,
        hours_worked=entry_in.hours_worked,
        salary_earned=entry_in.salary_earned,
        notes=entry_in.notes
    )
    db.add(db_entry)
    db.commit()
    db.refresh(db_entry)
    return db_entry

@router.put("/{entry_id}", response_model=DiaryEntryResponse)
def update_diary_entry(
    entry_id: int,
    entry_in: DiaryEntryCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_entry = db.query(DiaryEntry).filter(
        DiaryEntry.id == entry_id,
        DiaryEntry.user_id == current_user.id
    ).first()
    
    if not db_entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Diary entry not found"
        )
        
    db_entry.date = entry_in.date
    db_entry.employer = entry_in.employer
    db_entry.hours_worked = entry_in.hours_worked
    db_entry.salary_earned = entry_in.salary_earned
    db_entry.notes = entry_in.notes
    
    db.commit()
    db.refresh(db_entry)
    return db_entry

@router.delete("/{entry_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_diary_entry(
    entry_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_entry = db.query(DiaryEntry).filter(
        DiaryEntry.id == entry_id,
        DiaryEntry.user_id == current_user.id
    ).first()
    
    if not db_entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Diary entry not found"
        )
        
    db.delete(db_entry)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
