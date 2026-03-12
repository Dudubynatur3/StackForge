from fastapi import APIRouter, HTTPException
from backend.models.job import ProjectUpgradeRequest
from backend.services import gemini_service

router = APIRouter(
    prefix="/upgrade",
    tags=["Upgrade"],
)

@router.post("/")
async def generate_upgrade_advice(request: ProjectUpgradeRequest):
    """
    Analyses a project and provides production-grade upgrade advice.
    """
    if not request.project_description:
        raise HTTPException(status_code=400, detail="Project description is required.")
    
    upgrade_result = await gemini_service.generate_upgrade_advice(
        request.project_description, 
        request.current_tech_stack
    )
    
    if "error" in upgrade_result and isinstance(upgrade_result, dict):
         raise HTTPException(status_code=500, detail=f"AI Service Error: {upgrade_result['error']}")

    return {"upgrade_advice": upgrade_result}
