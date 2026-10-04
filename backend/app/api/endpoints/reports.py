from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from app.db import get_db
from app.models.report import Report, ReportCategory
from app.models.verification import Verification, TrustStatus
from app.schemas.index import (
    WeatherReportOut,
    WeatherReportCreate,
    LocationSchema,
    VerificationUpdate,
)
from app.services.ingestion import IngestionService
from app.services.verification import VerificationService
from app.api.endpoints.websockets import broadcast_update

router = APIRouter()

# --- Helper to map DB models to Frontend-aligned Schema ---
def map_report_to_out(
    report: Report,
    verification: Verification,
    latitude: float,
    longitude: float,
) -> WeatherReportOut:
    return WeatherReportOut(
        id=str(report.id),
        phenomenon=report.category.value,
        description=report.description,
        location=LocationSchema(
            lat=latitude,
            lng=longitude,
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
    db: Session = Depends(get_db)
):
    """Accept anonymous citizen reports and broadcast a canonical map record."""
    service = IngestionService(db)
    report, verification = await service.process_report(
        user_id=None,
        category=report_in.phenomenon,
        description=report_in.description,
        lat=report_in.location.lat,
        lon=report_in.location.lng,
        media_url=None, # Logic to handle file upload would go here
        raw_text=None
    )

    report_out = map_report_to_out(
        report,
        verification,
        report_in.location.lat,
        report_in.location.lng,
    )
    await broadcast_update({
        "type": "NEW_REPORT",
        "data": report_out.model_dump(mode="json"),
    })

    return {"report_id": report.id, "initial_status": verification.status.value}

@router.get("/public", response_model=List[WeatherReportOut])
async def get_public_reports(db: Session = Depends(get_db)):
    """Get trust-scored reports for the public map. Excludes Flagged reports."""
    results = db.query(
        Report,
        Verification,
        func.ST_Y(Report.location),
        func.ST_X(Report.location),
    ).join(Verification, Verification.report_id == Report.id).filter(
        Verification.status != TrustStatus.FLAGGED
    ).all()
    return [map_report_to_out(report, verification, lat, lng) for report, verification, lat, lng in results]

@router.get("/admin", response_model=List[WeatherReportOut])
async def get_admin_reports(
    status: Optional[str] = Query(None),
    phenomenon: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    """Get reports with advanced filtering for the temporary development console."""
    query = db.query(
        Report,
        Verification,
        func.ST_Y(Report.location),
        func.ST_X(Report.location),
    ).join(Verification, Verification.report_id == Report.id)

    if status:
        normalized_status = status.strip().upper()
        try:
            query = query.filter(Verification.status == TrustStatus(normalized_status))
        except ValueError as exc:
            raise HTTPException(status_code=422, detail="Unknown report status") from exc
    if phenomenon:
        try:
            query = query.filter(Report.category == ReportCategory(phenomenon.strip().lower()))
        except ValueError as exc:
            raise HTTPException(status_code=422, detail="Unknown report phenomenon") from exc

    results = query.all()
    return [map_report_to_out(report, verification, lat, lng) for report, verification, lat, lng in results]

@router.patch("/{report_id}/verify")
async def verify_report(
    report_id: int,
    update: VerificationUpdate,
    db: Session = Depends(get_db),
):
    """Verify or flag a report. Updates trust score and logs action."""
    service = VerificationService(db)
    try:
        updated_verification = service.update_review(
            report_id=report_id,
            status=update.status,
            reviewer_id=None,
            notes=update.notes,
        )
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc

    row = db.query(
        Report,
        func.ST_Y(Report.location),
        func.ST_X(Report.location),
    ).filter(Report.id == report_id).first()
    if row is None:
        raise HTTPException(status_code=404, detail="Report not found")
    report, latitude, longitude = row
    return map_report_to_out(report, updated_verification, latitude, longitude)
