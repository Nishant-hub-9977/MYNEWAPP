from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging
from datetime import datetime
from .routes.sensex import router as sensex_router

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="AlgoTrader API",
    description="Algorithmic Trading Platform for Indian Markets",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(sensex_router, prefix="/api/dhanhq")

# Startup event
@app.on_event("startup")
async def startup_event():
    logger.info("🚀 AlgoTrader FastAPI server starting up...")
    logger.info(f"📊 Server running on http://0.0.0.0:8000")
    logger.info("✅ CORS enabled for all origins")
    logger.info("🔄 DhanHQ API integration ready")

# Root endpoint
@app.get("/")
async def root():
    logger.info("📍 Root endpoint accessed")
    return {
        "status": "AlgoTrader FastAPI is running ✅",
        "timestamp": datetime.now().isoformat(),
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/api/health",
        "sensex": "/api/dhanhq/sensex-price"
    }

# Health check endpoint
@app.get("/api/health")
async def health_check():
    logger.info("🏥 Health check requested")
    return {
        "status": "OK",
        "timestamp": datetime.now().isoformat(),
        "service": "AlgoTrader API",
        "version": "1.0.0"
    }

# Error handlers
@app.exception_handler(404)
async def not_found_handler(request, exc):
    logger.warning(f"🔍 Route not found: {request.url}")
    return {"error": "Route not found", "path": str(request.url)}

@app.exception_handler(500)
async def internal_error_handler(request, exc):
    logger.error(f"💥 Internal server error: {exc}")
    return {"error": "Internal server error", "detail": str(exc)}