import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables from the root .env file
load_dotenv(os.path.join(os.path.dirname(__file__), '../../.env'))

# Configure Gemini API
api_key = os.getenv("GOOGLE_API_KEY")
if api_key:
    genai.configure(api_key=api_key)
else:
    print("Warning: GOOGLE_API_KEY not found in environment.")

class GeminiService:
    def __init__(self):
        self.model_name = "gemini-flash-lite-latest"
        self.model = genai.GenerativeModel(self.model_name)

    async def recommend_projects(self, jd_text: str, current_skills: list = None):
        """
        Based on the job description and user's current skills, recommends 3-5
        specific projects, ranked by impact.
        """
        skills_context = f"The user already knows: {', '.join(current_skills)}." if current_skills else "No prior skills provided."
        
        prompt = f"""
        You are an expert Cloud and DevOps Platform Engineer and technical recruiter.
        Based on the job description below, recommend 3-5 specific projects that will have the highest impact on an employer.
        
        Context: {skills_context}

        For each recommendation, include:
        1. Title
        2. Impact: Why this specific project matches the job and why it's high impact.
        3. Tech Stack: The tools and technologies covered.
        4. Estimated Build Time: A realistic timeframe (e.g., 2 weeks).
        5. Difficulty Level: Beginner, Intermediate, or Advanced.

        Rank these projects from highest to lowest impact.

        Format the output as a JSON object with a single key 'recommendations' which is a list of project objects.

        Example Format:
        {{
            "recommendations": [
                {{
                    "title": "Project Name",
                    "impact": "Explanation of ranking and match",
                    "stack": "Stack used",
                    "time": "Estimated time",
                    "difficulty": "Level"
                }}
            ]
        }}

        Job Description:
        {jd_text}
        """
        
        try:
            response = self.model.generate_content(
                prompt,
                generation_config={"response_mime_type": "application/json"}
            )
            return json.loads(response.text)
        except json.JSONDecodeError as jde:
            return {"error": f"Failed to parse JSON from AI response: {str(jde)}", "raw": response.text}
        except Exception as e:
            return {"error": str(e)}

    async def generate_implementation_plan(self, project_title: str, project_description: str = None, tech_stack: str = None):
        """
        Generates a complete step-by-step implementation plan for a given project.
        """
        prompt = f"""
        You are an expert Cloud and DevOps Platform Engineer.
        Generate a complete, professional, and technical implementation plan for the following project:
        
        Project Title: {project_title}
        Description: {project_description if project_description else 'No specific description provided.'}
        Tech Stack: {tech_stack if tech_stack else 'No specific tech stack provided.'}

        The implementation plan MUST include:
        1. Architecture Overview: A clear description of how the system is designed.
        2. File Structure: A recommended project directory and file layout.
        3. Implementation Steps: A detailed step-by-step guide from setup to deployment.
        4. Commands: Actual shell/terminal commands to run for setup, infrastructure, and deployment.
        5. Verification Steps: How to test and verify each stage works.

        Format the output as a clean JSON object with these keys: 
        'architecture', 'file_structure', 'steps', 'verification_steps'.
        The 'steps' key should be a list of objects, each with 'phase', 'action', and 'command'.

        Example Format:
        {{
            "architecture": "A serverless application using AWS Lambda and API Gateway...",
            "file_structure": "project/\\n├── src/\\n├── infra/\\n└── README.md",
            "steps": [
                {{
                    "phase": "Infrastructure Setup",
                    "action": "Initialize Terraform and apply the plan.",
                    "command": "terraform init && terraform apply"
                }}
            ],
            "verification_steps": ["Verify the API endpoint returns a 200 OK."]
        }}
        """
        
        try:
            response = self.model.generate_content(
                prompt,
                generation_config={"response_mime_type": "application/json"}
            )
            return json.loads(response.text)
        except json.JSONDecodeError as jde:
            return {"error": f"Failed to parse JSON from AI response: {str(jde)}", "raw": response.text}
        except Exception as e:
            return {"error": str(e)}

    async def generate_upgrade_advice(self, project_description: str, current_tech_stack: str = None):
        """
        Analyses an existing project and explains how to upgrade it to production grade.
        """
        prompt = f"""
        You are a senior Platform Engineer.
        Analyse the following existing project and explain how to upgrade it to production grade.
        
        Project Description: {project_description}
        Current Tech Stack: {current_tech_stack if current_tech_stack else 'No specific tech stack provided.'}

        Your advice should focus on:
        1. Missing Production Features (e.g., monitoring, security, HA, etc.)
        2. What a Senior Engineer would add to make it stand out.
        3. A step-by-step upgrade plan.

        Format the output as a clean JSON object with these keys: 
        'analysis', 'senior_additions', 'upgrade_steps'.
        Each value should be a list of strings.

        Example Format:
        {{
            "analysis": ["Add centralized logging...", "Implement secrets management..."],
            "senior_additions": ["Introduce a Service Mesh...", "Add SLO/SLI dashboards..."],
            "upgrade_steps": ["Step 1: Set up Prometheus...", "Step 2: Migrate to Vault..."]
        }}
        """
        
        try:
            response = self.model.generate_content(
                prompt,
                generation_config={"response_mime_type": "application/json"}
            )
            return json.loads(response.text)
        except json.JSONDecodeError as jde:
            return {"error": f"Failed to parse JSON from AI response: {str(jde)}", "raw": response.text}
        except Exception as e:
            return {"error": str(e)}

# Singleton instance
gemini_service = GeminiService()
