from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from ...db import get_db
from ...api.deps import get_current_user, RoleChecker
from ...models.report import Report, ReportCategory
from ...models.verification import Verification, TrustStatus
from ...models.user import UserRole
from ...schemas.index import (
    WeatherReportOut,
    WeatherReportBase,
    WeatherReportCreate,
    LocationSchema
)
from ...services.ingestion import IngestionService
from ...services.verification import VerificationService

router = APIRouter()

# --- Helper to map DB models to Frontend-aligned Schema ---
def map_report_to_out(report: Report, verification: Verification) -> WeatherReportOut:
    # Convert PostGIS geometry to lat/lng
    # In geoalchemy2, report.location is a WKBElement. We use .coords or .astext
    # For this implementation, we assume access to the point coordinates
    point = report.location
    # Extracting lat/lng from WKT "POINT(lng lat)"
    coords = point.astext.replace("POINT(", "").replace(")", "").split(",")

    return WeatherReportOut(
        id=str(report.id),
        phenomenon=report.category.value,
        description=report.description,
        location=LocationSchema(
            lat=float(coords[1]),
            lng=float(coords[0]),
            city=None, # To be populated by reverse geocoding in a later step
            state=None,
        ),
        timestamp=report.created_at,
        status=verification.status.value,
        trustScore=verification.trust_score,
        aiConfidence=verification.trust_score * 100,
        source="citizen",
        media=[report.media_url] if report.media_url else [],
    )

@router.post("/", status_code=status.HTTP_201_CREATED)
async def submit_report(
    report_in: WeatherReportCreate,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Submit a weather report (Citizens)"""
    service = IngestionService(db)
    report, verification = await service.process_report(
        user_id=current_user.id,
        category=report_in.phenomenon,
        description=report_in.description,
        lat=report_in.location.lat,
        lon=report_in.location.lng,
        media_url=None, # Logic to handle file upload would go here
        raw_text=None
    )
    return {"report_id": report.id, "initial_status": verification.status.value}

@router.get("/public", response_model=List[WeatherReportOut])
async def get_public_reports(db: Session = Depends(get_db)):
    """Get trust-scored reports for the public map. Excludes Flagged reports."""
    # Join Report and Verification
    results = db.query(Report, Verification).join(
        Verification, Report.id == Verification.report_id
    ).filter(
        Verification.status != TrustStatus.FLAGGED
    ).all()

    return [map_report_to_out(r, v) for r, v in results]

@router.get("/admin", response_model=List[WeatherReportOut])
async def get_admin_reports(
    status: Optional[str] = Query(None),
    phenomenon: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user=Depends(RoleChecker([UserRole.ANALYST, UserRole.AUTHORITY]))
):
    """Get all reports with advanced filtering for the Intelligence Console."""
    query = db.query(Report).join(Verification)

    if status:
        query = query.filter(Verification.status == status)
    if phenomenon:
        query = query.filter(Report.category == phenomenon)

    results = query.all()

    # To avoid N+1, we'd ideally use joinedload, but for now we'll fetch verifications
    return [
        map_report_to_out(r, db.query(Verification).filter_by(report_id=r.id).first())
        for r in results
    ]

@router.patch("/{report_id}/verify")
async def verify_report(
    report_id: int,
    status: TrustStatus,
    notes: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user=Depends(RoleChecker([UserRole.ANALYST, UserRole.AUTHORITY]))
):
    """Verify or flag a report. Updates trust score and logs action."""
    service = VerificationService(db)
    updated_verification = service.verify_report(
        report_id=report_id,
        status=status,
        reviewer_id=current_user.id,
        notes=notes
    )

    report = db.query(Report).filter(Report.id == report_id).first()
    return map_report_to_out(report, updated_verification)
