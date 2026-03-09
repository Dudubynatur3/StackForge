from pydantic import BaseModel
from typing import List, Optional

class JobDescriptionRequest(BaseModel):
    jd_text: str
    user_id: Optional[str] = None

class ProjectRecommendationRequest(BaseModel):
    jd_text: str
    current_skills: Optional[List[str]] = None
    user_id: Optional[str] = None

class ImplementationPlanRequest(BaseModel):
    project_title: str
    project_description: Optional[str] = None
    tech_stack: Optional[str] = None
    user_id: Optional[str] = None

class ProjectUpgradeRequest(BaseModel):
    project_description: str
    current_tech_stack: Optional[str] = None
    user_id: Optional[str] = None
