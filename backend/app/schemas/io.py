from pydantic import BaseModel
from typing import List, Optional

class StudentProfile(BaseModel):
    student_id: Optional[str] = None
    courses: List[str]
    gpa_trend: List[float]  
    projects: List[str]
    certifications: List[str]
    extracurriculars: List[str]

class RoleRecommendation(BaseModel):
    role: str
    score: float
    top_features: List[str]

class RoleResponse(BaseModel):
    top3: List[RoleRecommendation]
