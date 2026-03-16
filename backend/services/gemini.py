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

    def _parse_ai_json(self, raw_text: str):
        """
        Cleans and parses JSON from AI response, removing markdown code blocks if present.
        """
        cleaned_text = raw_text.strip()
        if cleaned_text.startswith("```"):
            # Remove start block (e.g., ```json)
            lines = cleaned_text.split("\n")
            if lines[0].startswith("```"):
                lines = lines[1:]
            # Remove end block (```)
            if lines[-1].strip() == "```":
                lines = lines[:-1]
            cleaned_text = "\n".join(lines).strip()
        
        try:
            return json.loads(cleaned_text)
        except json.JSONDecodeError as jde:
            print(f"GeminiService: JSON Decode Error. Raw: {raw_text[:100]}...")
            return {"error": f"Failed to parse AI response: {str(jde)}", "raw": raw_text}

    async def analyse_job_description(self, jd_text: str):
        """
        Analyses a cloud/DevOps job description to extract:
        - Required skills
        - Preferred skills
        - Tools and technologies
        - Recommended projects
        """
        print(f"GeminiService: Starting analysis for JD (length: {len(jd_text)})")
        
        prompt = f"""
        You are an expert Cloud and DevOps Platform Engineer and technical recruiter.
        Analyse the following job description and break it down into four specific categories:
        1. Required Skills: Fundamental skills mentioned as mandatory.
        2. Preferred Skills: Nice-to-have skills or advanced qualifications.
        3. Tools & Technologies: Specific software, cloud providers, and platforms mentioned.
        4. Recommended Projects: Based on this JD, suggest 3-5 high-impact projects a candidate should build to prove their competence. 
           For each project, provide a title, a one-sentence 'why it matches', the tech stack it covers, estimated build time, and difficulty level.

        Format the output as a JSON object with these keys: 
        "required_skills", "preferred_skills", "tools_technologies", "recommended_projects".
        Each value should be a list of strings, except "recommended_projects" which should be a list of objects.

        Job Description:
        {jd_text}
        """
        
        try:
            print(f"GeminiService: Sending request to model {self.model_name}")
            response = self.model.generate_content(
                prompt,
                generation_config={"response_mime_type": "application/json"}
            )
            print("GeminiService: Response received successfully")
            return self._parse_ai_json(response.text)
        except Exception as e:
            print(f"GeminiService: General Error: {str(e)}")
            return {"error": str(e)}

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

        Rank these projects from highest to lowest impact.
        Format the output as a JSON object with a single key 'recommendations' which is a list of project objects.

        Job Description:
        {jd_text}
        """
        
        try:
            response = self.model.generate_content(
                prompt,
                generation_config={"response_mime_type": "application/json"}
            )
            return self._parse_ai_json(response.text)
        except Exception as e:
            return {"error": str(e)}

    async def generate_implementation_plan(self, project_title: str, project_description: str = None, tech_stack: str = None):
        """
        Generates an ELITE step-by-step implementation plan for a given project.
        """
        prompt = f"""
        You are an Elite Staff Platform Engineer at a Tier-1 tech company. 
        Provide a 'Gold-Standard' implementation plan for:
        
        Project: {project_title}
        Context: {project_description if project_description else 'Standard production deployment.'}
        Tech: {tech_stack if tech_stack else 'Best-in-class DevOps tools.'}

        Format as JSON with keys: 'architecture', 'file_structure', 'steps', 'verification_steps'.
        """
        
        try:
            response = self.model.generate_content(
                prompt,
                generation_config={"response_mime_type": "application/json"}
            )
            return self._parse_ai_json(response.text)
        except Exception as e:
            return {"error": str(e)}

    async def generate_upgrade_advice(self, project_description: str, current_tech_stack: str = None):
        """
        Analyses an existing project and explains how to upgrade it to production grade.
        """
        prompt = f"""
        You are a senior Platform Engineer.
        Analyse the following project and explain how to upgrade it to production grade.
        
        Project Description: {project_description}
        Current Tech Stack: {current_tech_stack if current_tech_stack else 'No specific tech stack provided.'}

        Format as JSON with keys: 'analysis', 'senior_additions', 'upgrade_steps'.
        """
        
        try:
            response = self.model.generate_content(
                prompt,
                generation_config={"response_mime_type": "application/json"}
            )
            return self._parse_ai_json(response.text)
        except Exception as e:
            return {"error": str(e)}

# Singleton instance
gemini_service = GeminiService()
