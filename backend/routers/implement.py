from fastapi import APIRouter, HTTPException
from backend.models.job import ImplementationPlanRequest
from backend.services import gemini_service, supabase_service

router = APIRouter(
    prefix="/implement",
    tags=["Implement"],
)

@router.post("/")
async def generate_implementation_plan(request: ImplementationPlanRequest):
    """
    Generates a complete step-by-step implementation plan for a project.
    """
    print(f"Implement Router: Request received for {request.project_title}. User: {request.user_id}")
    
    if not request.project_title:
        raise HTTPException(status_code=400, detail="Project title is required.")
    
    # Check quota for logged-in users (monthly limit)
    if request.user_id:
        can_implement = await supabase_service.check_user_quota(request.user_id, feature="implement")
        if not can_implement:
            print(f"Implement Router: Quota exceeded for {request.user_id}")
            raise HTTPException(status_code=403, detail="Monthly implementation plan limit reached for free tier. Upgrade to Pro for unlimited plans.")

    # Call AI first
    print("Implement Router: Calling gemini_service.generate_implementation_plan")
    plan_result = await gemini_service.generate_implementation_plan(
        request.project_title, 
        request.project_description,
        request.tech_stack
    )
    
    if "error" in plan_result and isinstance(plan_result, dict):
         print(f"Implement Router: AI Error: {plan_result['error']}")
         raise HTTPException(status_code=500, detail=f"AI Service Error: {plan_result['error']}")

    # ONLY save project to history if AI succeeded
    if request.user_id:
        try:
            print(f"Implement Router: Saving successful plan for {request.user_id}")
            project_data = {
                "title": request.project_title,
                "description": request.project_description,
                "tech_stack": request.tech_stack,
                "implementation_plan": plan_result
            }
            await supabase_service.save_project(request.user_id, project_data)
        except Exception as e:
            print(f"Implement Router: Database Warning (non-fatal): {e}")

    return {"implementation_plan": plan_result}
