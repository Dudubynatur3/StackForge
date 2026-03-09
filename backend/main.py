from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routers import analyse, recommend, implement, upgrade

app = FastAPI(
    title="StackForge API",
    description="The backend for the StackForge application.",
    version="0.1.0",
)

# --- CORS MIDDLEWARE ---
# This allows your Vercel frontend to communicate with this Render backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For now, '*' allows all. We can restrict this to your Vercel URL later for better security.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health", tags=["Health"])
def health_check():
    """
    Health check endpoint to ensure the API is running.
    """
    return {"status": "ok"}

# Include routers
app.include_router(analyse.router)
app.include_router(recommend.router)
app.include_router(implement.router)
app.include_router(upgrade.router)