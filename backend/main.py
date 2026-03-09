from fastapi import FastAPI
from backend.routers import analyse, recommend, implement, upgrade

app = FastAPI(
    title="StackForge API",
    description="The backend for the StackForge application.",
    version="0.1.0",
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
