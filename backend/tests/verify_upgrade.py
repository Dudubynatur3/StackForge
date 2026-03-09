import asyncio
import os
import sys

# Add the project root to the Python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))

from backend.services.gemini import gemini_service

async def test_upgrade_advice():
    print("Testing Project Upgrade Advice Service...")
    project_description = "A basic static website hosted on AWS S3 with a CloudFront distribution. The code is in GitHub."
    current_tech_stack = "AWS S3, CloudFront, GitHub"
    
    result = await gemini_service.generate_upgrade_advice(project_description, current_tech_stack)
    
    if "error" in result:
        print(f"FAILED: {result['error']}")
    else:
        print("SUCCESS! Upgrade Advice received:")
        import json
        print(json.dumps(result, indent=2))

if __name__ == "__main__":
    asyncio.run(test_upgrade_advice())
