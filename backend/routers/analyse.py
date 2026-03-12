from fastapi import APIRouter, HTTPException
from backend.models.job import JobDescriptionRequest
from backend.services.gemini import gemini_service
from backend.services.supabase_service import supabase_service

router = APIRouter(
    prefix="/analyse",
    tags=["Analyse"],
)

@router.post("/")
async def analyse_job_description(request: JobDescriptionRequest):
    """
    Analyses a job description using Gemini and extracts skills, tools, and recommended projects.
    """
    print(f"Analyse Router: Received request. UserID: {request.user_id}")
    if not request.jd_text:
        raise HTTPException(status_code=400, detail="Job description text is required.")
    
    # Check quota for logged-in users
    if request.user_id:
        print(f"Analyse Router: Checking quota for {request.user_id}")
        can_analyse = await supabase_service.check_user_quota(request.user_id)
        if not can_analyse:
            print(f"Analyse Router: Quota exceeded for {request.user_id}")
            raise HTTPException(status_code=403, detail="Daily analysis limit reached for free tier. Upgrade to Pro for unlimited access.")

    print("Analyse Router: Calling gemini_service.analyse_job_description")
    analysis_result = await gemini_service.analyse_job_description(request.jd_text)
    
    if "error" in analysis_result and isinstance(analysis_result, dict):
         print(f"Analyse Router: AI Error: {analysis_result['error']}")
         raise HTTPException(status_code=500, detail=f"AI Service Error: {analysis_result['error']}")

    # Save to history if user_id is provided
    if request.user_id:
        try:
            print(f"Analyse Router: Saving analysis to history for {request.user_id}")
            await supabase_service.save_analysis(request.user_id, request.jd_text, analysis_result)
        except Exception as e:
            print(f"Analyse Router: Failed to save analysis: {e}")

    print("Analyse Router: Returning successful response")
    return {"analysis": analysis_result}

@router.get("/history/{user_id}")
async def get_analysis_history(user_id: str):
    """
    Retrieves the analysis history for a specific user.
    """
    try:
        history = await supabase_service.get_user_history(user_id)
        return {"history": history.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve history: {str(e)}")
