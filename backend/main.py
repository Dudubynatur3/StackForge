from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from backend.routers import analyse, recommend, implement, upgrade
import time

app = FastAPI(
    title="StackForge API",
    description="The backend for the StackForge application.",
    version="0.1.0",
)

# --- IP RATE LIMITING ---
# Simple in-memory store for demo. In production, use Redis.
ip_request_counts = {}

@app.middleware("http")
async def rate_limit_middleware(request: Request, call_next):
    client_ip = request.client.host
    current_time = time.time()
    
    # Clean up old entries every hour (simplified)
    if client_ip not in ip_request_counts:
        ip_request_counts[client_ip] = []
    
    # Only keep requests from the last minute
    ip_request_counts[client_ip] = [t for t in ip_request_counts[client_ip] if current_time - t < 60]
    
    # Limit to 30 requests per minute per IP to block bots/scrapers
    if len(ip_request_counts[client_ip]) > 30:
        raise HTTPException(status_code=429, detail="Too many requests from this IP. Slow down, engineer.")
    
    ip_request_counts[client_ip].append(current_time)
    return await call_next(request)

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