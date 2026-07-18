from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    password_hash = Column(String, nullable=True)  # Nullable for guest users
    role = Column(String, default="user")          # "user" or "guest"
    preferred_language = Column(String, default="en") # "en" or "hi"
    created_at = Column(DateTime, default=datetime.utcnow)

    diary_entries = relationship("DiaryEntry", back_populates="user", cascade="all, delete-orphan")
    chat_histories = relationship("ChatHistory", back_populates="user", cascade="all, delete-orphan")
    complaints = relationship("Complaint", back_populates="user", cascade="all, delete-orphan")

class DiaryEntry(Base):
    __tablename__ = "diary_entries"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    date = Column(String, nullable=False)          # YYYY-MM-DD
    employer = Column(String, nullable=False)
    hours_worked = Column(Float, default=0.0)
    salary_earned = Column(Float, default=0.0)
    notes = Column(String, nullable=True)

    user = relationship("User", back_populates="diary_entries")

class ChatHistory(Base):
    __tablename__ = "chat_histories"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    message = Column(String, nullable=False)
    response = Column(String, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="chat_histories")

class Complaint(Base):
    __tablename__ = "complaints"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    employer_name = Column(String, nullable=False)
    issue = Column(String, nullable=False)
    date = Column(String, nullable=False)
    description = Column(String, nullable=False)
    content_en = Column(String, nullable=False)    # Generated English text
    content_hi = Column(String, nullable=False)    # Generated Hindi text
    timestamp = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="complaints")
