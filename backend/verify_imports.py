import sys
import os

# Add current path to python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

print("Starting backend imports verification...")

try:
    from app.config import settings
    print("[OK] Config settings imported successfully.")
    
    from app.database import Base, engine, get_db
    print("[OK] Database session and base imported successfully.")
    
    from app.models import User, DiaryEntry, ChatHistory, Complaint
    print("[OK] SQLAlchemy models imported successfully.")
    
    from app.schemas import UserCreate, UserResponse, Token, DiaryEntryCreate, ChatRequest, ComplaintCreate, SchemeQuery
    print("[OK] Pydantic schemas imported successfully.")
    
    from app.auth import get_password_hash, verify_password, create_access_token, get_current_user
    print("[OK] Auth dependencies imported successfully.")
    
    from app.services.elastic_ai import elastic_ai_service
    print("[OK] Elastic AI Service class imported successfully.")
    
    from app.routers import auth, chat, rights, schemes, complaints, diary, profile, upload
    print("[OK] Routers imported successfully.")
    
    from app.main import app
    print("[OK] FastAPI main app imported successfully.")
    
    print("\nSUCCESS: All backend modules and dependencies imported successfully without syntax errors!")
except Exception as e:
    print(f"\nFAILURE: Verification failed with error:\n{e}")
    sys.exit(1)
