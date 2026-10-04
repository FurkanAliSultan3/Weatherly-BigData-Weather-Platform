from fastapi import FastAPI
from fastapi import Depends, HTTPException
from dotenv import load_dotenv
import logging
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from app.db import get_db
from app.api.endpoints import reports, analytics, websockets
from app.core.config import settings


# Load environment variables
load_dotenv()

app = FastAPI(
    title="Weatherly API",
    description="National Weather Big Data Platform API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

logger = logging.getLogger(__name__)

# Include Routers
app.include_router(reports.router, prefix=f"{settings.API_V1_STR}/reports", tags=["Reports"])
app.include_router(analytics.router, prefix=f"{settings.API_V1_STR}/analytics", tags=["Analytics"])
app.include_router(websockets.router, tags=["WebSockets"])



@app.get("/")
async def root():
    return {"message": "Welcome to Weatherly Production API", "status": "Connected to Supabase Cloud"}

@app.get(f"{settings.API_V1_STR}/health")
def health_check(db: Session = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))
    except SQLAlchemyError as exc:
        logger.exception("Database health check failed")
        raise HTTPException(status_code=503, detail="Database connection is unavailable") from exc
    return {"status": "ok", "database": "connected"}
