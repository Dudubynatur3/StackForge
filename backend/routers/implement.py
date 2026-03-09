from fastapi import APIRouter, HTTPException
from backend.models.job import ImplementationPlanRequest
from backend.services.gemini import gemini_service
from backend.services.supabase_service import supabase_service

router = APIRouter(
    prefix="/implement",
    tags=["Implement"],
)

@router.post("/")
async def generate_implementation_plan(request: ImplementationPlanRequest):
    """
    Generates a complete step-by-step implementation plan for a project.
    """
    if not request.project_title:
        raise HTTPException(status_code=400, detail="Project title is required.")
    
    plan_result = await gemini_service.generate_implementation_plan(
        request.project_title, 
        request.project_description,
        request.tech_stack
    )
    
    if "error" in plan_result and isinstance(plan_result, dict):
         raise HTTPException(status_code=500, detail=f"AI Service Error: {plan_result['error']}")

    # Save project to history if user_id is provided
    if request.user_id:
        try:
            project_data = {
                "title": request.project_title,
                "description": request.project_description,
                "tech_stack": request.tech_stack,
                "implementation_plan": plan_result
            }
            await supabase_service.save_project(request.user_id, project_data)
        except Exception as e:
            print(f"Failed to save project: {e}")

    return {"implementation_plan": plan_result}
