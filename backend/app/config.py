import os
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    PROJECT_NAME: str = "ShramikMitra AI API"
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./shramikmitra.db")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "super-secret-key-for-shramik-mitra-ai-2026")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 hours
    
    # Elastic AI Configurations
    ELASTIC_API_KEY: str = os.getenv("ELASTIC_API_KEY", "")
    ELASTIC_URL: str = os.getenv("ELASTIC_URL", "http://localhost:9200")
    ELASTIC_MODEL_ID: str = os.getenv("ELASTIC_MODEL_ID", "elastic-chat-completion")

    class Config:
        case_sensitive = True

settings = Settings()
