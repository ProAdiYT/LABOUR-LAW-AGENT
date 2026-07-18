from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, status
from typing import Dict

from app.auth import get_current_user
from app.services.elastic_ai import elastic_ai_service

router = APIRouter(prefix="/upload", tags=["Document Analyzer"])

@router.post("/", response_model=Dict)
async def upload_and_analyze_document(
    file: UploadFile = File(...),
    current_user = Depends(get_current_user)
):
    # Check file size (limit to 5MB)
    MAX_SIZE = 5 * 1024 * 1024
    content = await file.read()
    
    if len(content) > MAX_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File size exceeds maximum limit of 5MB"
        )
        
    if not file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Filename is missing"
        )
        
    # Check supported extensions
    allowed_extensions = {".pdf", ".jpg", ".jpeg", ".png"}
    file_ext = "".join(file.filename.split(".")[-1:]).lower()
    
    if not any(file.filename.lower().endswith(ext) for ext in allowed_extensions):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF, PNG, JPG, or JPEG files are allowed."
        )

    # Call Elastic AI service to analyze
    try:
        # Reset read pointer
        await file.seek(0)
        analysis_result = elastic_ai_service.analyze_document(
            filename=file.filename,
            content_type=file.content_type or "application/octet-stream",
            content=content
        )
        return analysis_result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred during analysis: {str(e)}"
        )
