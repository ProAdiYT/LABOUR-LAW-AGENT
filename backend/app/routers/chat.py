from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models import User, ChatHistory
from app.schemas import ChatRequest, ChatResponse
from app.auth import get_current_user
from app.services.elastic_ai import elastic_ai_service

router = APIRouter(prefix="/chat", tags=["AI Chat"])

@router.get("/", response_model=List[ChatResponse])
def get_chat_history(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    chats = db.query(ChatHistory).filter(ChatHistory.user_id == current_user.id).order_by(ChatHistory.timestamp.asc()).all()
    return chats

@router.post("/", response_model=ChatResponse)
def send_chat_message(
    chat_req: ChatRequest, 
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    user_message = chat_req.message
    
    # Load recent history for context
    db_history = db.query(ChatHistory).filter(ChatHistory.user_id == current_user.id).order_by(ChatHistory.timestamp.desc()).limit(10).all()
    
    # Format for AI service context
    history_list = []
    for h in reversed(db_history):
        history_list.append({"role": "user", "content": h.message})
        history_list.append({"role": "model", "content": h.response})
    
    # Add current message to context
    history_list.append({"role": "user", "content": user_message})

    # Call Elastic AI service
    ai_response = elastic_ai_service.chat(user_message, history_list)

    # Save to database
    chat_entry = ChatHistory(
        user_id=current_user.id,
        message=user_message,
        response=ai_response
    )
    db.add(chat_entry)
    db.commit()
    db.refresh(chat_entry)
    
    return chat_entry

@router.delete("/clear", status_code=status.HTTP_204_NO_CONTENT)
def clear_chat_history(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db.query(ChatHistory).filter(ChatHistory.user_id == current_user.id).delete()
    db.commit()
    return
