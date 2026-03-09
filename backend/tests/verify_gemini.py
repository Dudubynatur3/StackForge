import asyncio
import os
import sys

# Add the project root to the Python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))

from backend.services.gemini import gemini_service

async def test_analysis():
    print("Testing Job Description Analysis Service...")
    sample_jd = """
    Cloud Engineer Role
    We are looking for a Cloud Engineer with 3+ years of experience in AWS.
    Key Responsibilities:
    - Manage AWS infrastructure using Terraform.
    - Containerize applications with Docker and orchestrate them with Kubernetes.
    - Implement CI/CD pipelines using GitHub Actions.
    - Monitor application performance with Prometheus and Grafana.
    Required Skills:
    - Experience with AWS, Terraform, Docker, and Kubernetes.
    - Proficiency in Python or Go.
    - Strong understanding of networking and security.
    """
    
    result = await gemini_service.analyse_job_description(sample_jd)
    
    if "error" in result:
        print(f"FAILED: {result['error']}")
    else:
        print("SUCCESS! Analysis received:")
        import json
        print(json.dumps(result, indent=2))

if __name__ == "__main__":
    asyncio.run(test_analysis())
