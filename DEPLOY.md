# StackForge Deployment Guide (Phase 3)

Follow these steps to deploy the Backend to Render and the Frontend to Vercel.

## 1. Prerequisites
- [Render Account](https://render.com) connected to your GitHub.
- [Vercel Account](https://vercel.com) connected to your GitHub.

## 2. Backend Deployment (Render)
Render uses the `render.yaml` blueprint in the root directory.

1. Go to **Dashboard > New > Blueprint**.
2. Connect your StackForge GitHub repository.
3. Review the `render.yaml` configuration.
4. **Environment Variables**: You will be prompted to enter:
   - `GOOGLE_API_KEY`
   - `SUPABASE_URL`
   - `SUPABASE_KEY`
5. Click **Deploy**.

**Note:** Once deployed, copy your Render service URL (e.g., `https://stackforge-backend.onrender.com`).

## 3. Frontend Deployment (Vercel)
1. Go to **Dashboard > New Project**.
2. Connect your StackForge GitHub repository.
3. Set the **Framework Preset** to Next.js.
4. **Root Directory**: Select `frontend`.
5. **Environment Variables**:
   - `NEXT_PUBLIC_API_URL`: Your Render backend URL.
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase URL.
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase Anon Key.
6. Click **Deploy**.

## 4. Verification
Once both are live, visit your Vercel URL and test the `/analyse` page. It should now be communicating with your Render backend.
