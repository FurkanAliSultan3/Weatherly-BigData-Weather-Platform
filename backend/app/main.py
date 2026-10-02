from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from dotenv import load_dotenv
from app.models import Base, WeatherReport, User
from app.schemas import ReportCreate, ReportResponse
from app.core.trust_engine import calculate_trust_score, get_status_from_score
import os
from typing import List

# Load environment variables
load_dotenv()

# Database Configuration
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL environment variable is not set")

# Force the use of psycopg2 for better compatibility with Supabase
if DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+psycopg2://", 1)

# Create engine with a connection pool that handles cloud timeouts better
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    pool_recycle=3600
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Initialize Database (creates tables if they don't exist)
try:
    Base.metadata.create_all(bind=engine)
except Exception as e:
    print(f"⚠️ Database initialization warning: {e}")
    print("This is common if you don't have administrative permissions on the Supabase DB. I will handle table creation via the Cloud Dashboard.")

app = FastAPI(title="Weatherly API", description="National Weather Big Data Platform API")

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
async def root():
    return {"message": "Welcome to Weatherly Production API", "status": "Connected to Supabase Cloud"}

@app.post("/api/reports", response_model=ReportResponse)
async def create_report(report: ReportCreate, db: Session = Depends(get_db)):
    from geoalchemy2.elements import WKTElement

    # AI Trust Brain Logic
    score = calculate_trust_score(report.report_type, report.latitude, report.longitude)
    status = get_status_from_score(score)

    try:
        db_report = WeatherReport(
            user_id=1, # Placeholder for Auth
            report_type=report.report_type,
            description=report.description,
            location=WKTElement(f'POINT({report.longitude} {report.latitude})', srid=4326),
            status=status,
            trust_score=score
        )
        db.add(db_report)
        db.commit()
        db.refresh(db_report)

        return {
            **report.model_dump(),
            "id": db_report.id,
            "status": db_report.status,
            "trust_score": db_report.trust_score,
            "timestamp": db_report.timestamp
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database Error: {str(e)}")

@app.get("/api/reports/public", response_model=List[ReportResponse])
async def get_public_reports(db: Session = Depends(get_db)):
    try:
        reports = db.query(WeatherReport).all()
        results = []
        for r in reports:
            results.append({
                "id": r.id,
                "report_type": r.report_type,
                "description": r.description,
                "latitude": 20.59, # Simplified for prototype
                "longitude": 78.96, # Simplified for prototype
                "status": r.status,
                "trust_score": r.trust_score,
                "timestamp": r.timestamp
            })
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching reports: {str(e)}")
