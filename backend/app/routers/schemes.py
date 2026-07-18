import os
import json
from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
from typing import List, Dict

from app.database import get_db
from app.schemas import SchemeQuery, SchemeRecommendationResponse
from app.auth import get_current_user
from app.services.elastic_ai import elastic_ai_service

router = APIRouter(prefix="/schemes", tags=["Government Schemes"])

def get_shared_file_path(filename: str) -> str:
    current_dir = os.path.dirname(os.path.abspath(__file__))
    app_dir = os.path.dirname(current_dir)
    backend_dir = os.path.dirname(app_dir)
    shared_dir = os.path.join(os.path.dirname(backend_dir), "shared")
    return os.path.join(shared_dir, filename)

@router.post("/recommend", response_model=SchemeRecommendationResponse)
def get_scheme_recommendations(
    query: SchemeQuery,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    file_path = get_shared_file_path("schemes.json")
    if not os.path.exists(file_path):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Schemes database file not found"
        )
        
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            all_schemes = json.load(f)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error reading schemes data: {e}"
        )

    # Filter schemes locally
    matched_schemes = []
    for scheme in all_schemes:
        criteria = scheme.get("criteria", {})
        
        # Age check
        min_age = criteria.get("min_age", 0)
        max_age = criteria.get("max_age", 120)
        if not (min_age <= query.age <= max_age):
            continue
            
        # Gender check
        genders = [g.lower() for g in criteria.get("genders", [])]
        if "all" not in genders and query.gender.lower() not in genders:
            continue
            
        # Occupation check
        occupations = [o.lower() for o in criteria.get("occupations", [])]
        if "all" not in occupations and query.occupation.lower() not in occupations:
            continue
            
        # State check
        states = [s.lower() for s in criteria.get("states", [])]
        if "all" not in states and query.state.lower() not in states:
            continue
            
        matched_schemes.append(scheme)

    # Generate AI Recommendation text using Elastic AI
    ai_recommendation = None
    if matched_schemes:
        ai_recommendation = elastic_ai_service.recommend_schemes(
            age=query.age,
            gender=query.gender,
            occupation=query.occupation,
            state=query.state,
            schemes_list=matched_schemes
        )
    else:
        ai_recommendation = (
            "We could not find any active matching schemes for the provided profile at the moment. "
            "Please register on the national **e-Shram** portal or visit the local **Delhi Labour Welfare Board** office "
            "to check for manual registrations."
        )

    return {
        "schemes": matched_schemes,
        "ai_recommendation": ai_recommendation
    }
