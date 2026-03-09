import asyncio
import os
import sys

# Add the project root to the Python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))

from backend.services.gemini import gemini_service

async def test_implementation_plan():
    print("Testing Implementation Plan Generation Service...")
    project_title = "Self-Service GKE Cluster Provisioner with Terraform"
    project_description = "A system that allows developers to spin up GKE clusters on GCP using predefined Terraform modules."
    tech_stack = "GCP, Terraform, Python, Git"
    
    result = await gemini_service.generate_implementation_plan(project_title, project_description, tech_stack)
    
    if "error" in result:
        print(f"FAILED: {result['error']}")
    else:
        print("SUCCESS! Implementation Plan received:")
        import json
        print(json.dumps(result, indent=2))

if __name__ == "__main__":
    asyncio.run(test_implementation_plan())
