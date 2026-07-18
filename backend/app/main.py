import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, HTMLResponse

from app.config import settings
from app.database import engine, Base
from app.routers import auth, chat, rights, schemes, complaints, diary, profile, upload

# Automatically create tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Backend API for ShramikMitra AI - Labour Rights Assistant for Migrant Workers in Delhi.",
    version="1.0.0"
)

# Configure CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api")
app.include_router(chat.router, prefix="/api")
app.include_router(rights.router, prefix="/api")
app.include_router(schemes.router, prefix="/api")
app.include_router(complaints.router, prefix="/api")
app.include_router(diary.router, prefix="/api")
app.include_router(profile.router, prefix="/api")
app.include_router(upload.router, prefix="/api")

# Static files serving
static_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "static")

@app.get("/")
def read_root():
    index_file = os.path.join(static_dir, "index.html")
    if os.path.exists(index_file):
        return FileResponse(index_file)
    return HTMLResponse(
        content="<h1>ShramikMitra AI API is online</h1><p>Static client interface not found in static/index.html.</p>",
        status_code=200
    )
