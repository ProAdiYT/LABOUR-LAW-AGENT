from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List

# User Schemas
class UserCreate(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    role: str
    preferred_language: str
    created_at: datetime

    class Config:
        from_attributes = True

# Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

# Diary Schemas
class DiaryEntryCreate(BaseModel):
    date: str = Field(..., description="Date of work in YYYY-MM-DD format")
    employer: str
    hours_worked: float = Field(0.0, ge=0, le=24)
    salary_earned: float = Field(0.0, ge=0)
    notes: Optional[str] = None

class DiaryEntryResponse(BaseModel):
    id: int
    user_id: int
    date: str
    employer: str
    hours_worked: float
    salary_earned: float
    notes: Optional[str]

    class Config:
        from_attributes = True

# Chat Schemas
class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    id: int
    message: str
    response: str
    timestamp: datetime

    class Config:
        from_attributes = True

# Complaint Schemas
class ComplaintCreate(BaseModel):
    employer_name: str
    issue: str
    date: str
    description: str

class ComplaintResponse(BaseModel):
    id: int
    employer_name: str
    issue: str
    date: str
    description: str
    content_en: str
    content_hi: str
    timestamp: datetime

    class Config:
        from_attributes = True

# Government Schemes Schemas
class SchemeQuery(BaseModel):
    age: int
    occupation: str
    gender: str
    state: str

class SchemeDetails(BaseModel):
    id: str
    name_en: str
    name_hi: str
    description_en: str
    description_hi: str
    benefits_en: str
    benefits_hi: str
    required_documents_en: List[str]
    required_documents_hi: List[str]

class SchemeRecommendationResponse(BaseModel):
    schemes: List[SchemeDetails]
    ai_recommendation: Optional[str] = None

# Profile Schemas
class ProfileUpdate(BaseModel):
    username: Optional[str] = None
    preferred_language: Optional[str] = None
    password: Optional[str] = None
