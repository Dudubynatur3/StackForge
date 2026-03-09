import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

class SupabaseService:
    def __init__(self):
        self.url = os.getenv("SUPABASE_URL")
        self.key = os.getenv("SUPABASE_KEY")
        if self.url and self.key:
            try:
                self.client: Client = create_client(self.url, self.key)
            except Exception as e:
                print(f"Error creating Supabase client: {e}")
                self.client = None
        else:
            self.client = None
            print("Warning: SUPABASE_URL or SUPABASE_KEY not found.")

    async def get_user_profile(self, user_id: str):
        if not self.client: return None
        try:
            response = self.client.table('profiles').select('*').eq('id', user_id).maybe_single().execute()
            return response
        except Exception as e:
            print(f"Error fetching profile: {e}")
            return None

    async def save_analysis(self, user_id: str, jd_text: str, result_json: dict):
        if not self.client: return None
        data = {
            "user_id": user_id,
            "jd_text": jd_text,
            "analysis_json": result_json
        }
        try:
            return self.client.table('analyses').insert(data).execute()
        except Exception as e:
            print(f"Error saving analysis: {e}")
            return None

    async def get_user_history(self, user_id: str):
        if not self.client: return []
        try:
            return self.client.table('analyses').select('*').eq('user_id', user_id).order('created_at', desc=True).execute()
        except Exception as e:
            print(f"Error fetching history: {e}")
            return []

    async def check_user_quota(self, user_id: str):
        """
        Check if the user has reached their daily quota (3 for free tier).
        """
        if not self.client: return True # Default to allowed if no client

        try:
            # Get profile tier
            profile = self.client.table('profiles').select('tier').eq('id', user_id).maybe_single().execute()
            tier = 'free'
            if profile and profile.data:
                tier = profile.data.get('tier', 'free')

            if tier == 'pro':
                return True # Unlimited for pro

            # Check today's analyses count for free tier
            from datetime import datetime, date
            today = date.today().isoformat()
            
            count = self.client.table('analyses').select('id', count='exact').eq('user_id', user_id).gte('created_at', today).execute()
            return (count.count or 0) < 3
        except Exception as e:
            print(f"Error checking quota: {e}")
            return True # Allow if check fails

    async def save_project(self, user_id: str, project_data: dict):
        if not self.client: return None
        project_data["user_id"] = user_id
        try:
            return self.client.table('saved_projects').insert(project_data).execute()
        except Exception as e:
            print(f"Error saving project: {e}")
            return None

# Singleton instance
supabase_service = SupabaseService()
