import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

class SupabaseService:
    def __init__(self):
        self.url = os.getenv("SUPABASE_URL")
        self.key = os.getenv("SUPABASE_KEY")
        if self.url and self.key:
            self.client: Client = create_client(self.url, self.key)
        else:
            self.client = None
            # We will handle the absence of keys during runtime
            print("Warning: SUPABASE_URL or SUPABASE_KEY not found.")

    async def get_user_profile(self, user_id: str):
        if not self.client: return None
        return self.client.table('profiles').select('*').eq('id', user_id).single().execute()

    async def save_analysis(self, user_id: str, jd_text: str, result_json: dict):
        if not self.client: return None
        data = {
            "user_id": user_id,
            "jd_text": jd_text,
            "analysis_json": result_json
        }
        return self.client.table('analyses').insert(data).execute()

    async def get_user_history(self, user_id: str):
        if not self.client: return []
        return self.client.table('analyses').select('*').eq('user_id', user_id).order('created_at', desc=True).execute()

    async def check_user_quota(self, user_id: str):
        """
        Check if the user has reached their daily quota (3 for free tier).
        """
        if not self.client: return True # Default to allowed if no client

        # Get profile tier
        profile = self.client.table('profiles').select('tier').eq('id', user_id).single().execute()
        tier = profile.data.get('tier', 'free') if profile.data else 'free'

        if tier == 'pro':
            return True # Unlimited for pro

        # Check today's analyses count for free tier
        from datetime import datetime, date
        today = date.today().isoformat()
        
        count = self.client.table('analyses').select('id', count='exact').eq('user_id', user_id).gte('created_at', today).execute()
        return (count.count or 0) < 3

    async def save_project(self, user_id: str, project_data: dict):
        if not self.client: return None
        project_data["user_id"] = user_id
        return self.client.table('saved_projects').insert(project_data).execute()

# Singleton instance
supabase_service = SupabaseService()
