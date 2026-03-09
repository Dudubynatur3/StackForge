from fastapi import APIRouter, HTTPException
from backend.models.job import ProjectRecommendationRequest
from backend.services.gemini import gemini_service

router = APIRouter(
    prefix="/recommend",
    tags=["Recommend"],
)

@router.post("/")
async def recommend_projects(request: ProjectRecommendationRequest):
    """
    Recommends 3-5 specific projects based on a job description and optional skills.
    """
    if not request.jd_text:
        raise HTTPException(status_code=400, detail="Job description text is required.")
    
    recommendation_result = await gemini_service.recommend_projects(
        request.jd_text, 
        request.current_skills
    )
    
    if "error" in recommendation_result and isinstance(recommendation_result, dict):
         raise HTTPException(status_code=500, detail=f"AI Service Error: {recommendation_result['error']}")

    return {"recommendations": recommendation_result}
