import asyncio
import os
import sys

# Add the project root to the Python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))

from backend.services.gemini import gemini_service

async def test_recommendation():
    print("Testing Project Recommendation Service...")
    sample_jd = """
    Cloud DevOps Engineer
    Requires strong experience with GCP (Google Cloud Platform), Terraform, and GKE.
    Must be able to implement CI/CD with GitLab and manage logs using ELK stack.
    Experience with Python for automation is a must.
    """
    
    current_skills = ["Python", "Docker", "Basic GCP"]
    
    result = await gemini_service.recommend_projects(sample_jd, current_skills)
    
    if "error" in result:
        print(f"FAILED: {result['error']}")
    else:
        print("SUCCESS! Recommendations received:")
        import json
        print(json.dumps(result, indent=2))

if __name__ == "__main__":
    asyncio.run(test_recommendation())
