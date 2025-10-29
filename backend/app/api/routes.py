from fastapi import APIRouter
from ..schemas.io import StudentProfile, RoleResponse, RoleRecommendation
from ..core.config import settings
from ..serve import predict_top3

router = APIRouter()

@router.get("/health")
def health():
    return {"status": "ok", "env": settings.ENV}

@router.post("/recommend-role", response_model=RoleResponse)
def recommend_role(profile: StudentProfile):
    return predict_top3(profile)
