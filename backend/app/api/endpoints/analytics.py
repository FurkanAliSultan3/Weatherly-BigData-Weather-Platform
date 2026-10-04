from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import case, func
from typing import List
from ...db import get_db
from ...models.report import Report, ReportCategory
from ...models.verification import Verification, TrustStatus
from ...schemas.index import IntelligenceKPIs, AuditLogEntryOut

router = APIRouter()

@router.get("/kpis", response_model=IntelligenceKPIs)
async def get_intelligence_kpis(db: Session = Depends(get_db)):
    """Return public-safe aggregate metrics for the citizen and officer dashboards."""
    total = db.query(Report).count()
    verified = db.query(Verification).filter(Verification.status == TrustStatus.VERIFIED).count()
    under_review = db.query(Verification).filter(
        Verification.status.in_([TrustStatus.UNVERIFIED, TrustStatus.LIKELY_GENUINE])
    ).count()
    suspicious = db.query(Verification).filter(Verification.status == TrustStatus.FLAGGED).count()

    avg_trust = db.query(func.avg(Verification.trust_score)).scalar() or 0.0
    total_with_evidence = db.query(Verification).filter(
        Verification.cross_check_evidence.isnot(None)
    ).count()
    ai_rate = (total_with_evidence / total * 100) if total > 0 else 0.0

    return IntelligenceKPIs(
        totalReports=total,
        verifiedReports=verified,
        underReview=under_review,
        suspiciousReports=suspicious,
        activeAlerts=0,
        systemTrustIndex=round(avg_trust * 100, 1),
        aiCrossRefRate=round(ai_rate, 1)
    )

@router.get("/charts")
async def get_chart_data(db: Session = Depends(get_db)):
    category_rows = db.query(Report.category, func.count(Report.id)).group_by(Report.category).all()
    status_rows = db.query(Verification.status, func.count(Verification.id)).group_by(Verification.status).all()

    daily_rows = db.query(
        func.date(Report.created_at).label("day"),
        func.count(Report.id).label("reports"),
        func.sum(case((Verification.status == TrustStatus.VERIFIED, 1), else_=0)).label("verified"),
    ).join(Verification, Verification.report_id == Report.id).group_by(
        func.date(Report.created_at)
    ).order_by(func.date(Report.created_at).desc()).limit(7).all()

    return {
        "byPhenomenon": [{"name": category.value, "value": count} for category, count in category_rows],
        "byStatus": [{"name": status.value, "value": count} for status, count in status_rows],
        "timeline": [
            {"day": day.isoformat() if hasattr(day, "isoformat") else str(day),
             "reports": reports, "verified": verified}
            for day, reports, verified in reversed(daily_rows)
        ],
    }

@router.get("/audit", response_model=List[AuditLogEntryOut])
async def get_audit_logs(
    db: Session = Depends(get_db),
):
    """Fetch the immutable record of all verification actions."""
    # In a real app, this would query a dedicated AuditLog table.
    # For now, we'll return the history from the Verification table.
    logs = db.query(Verification).order_by(Verification.created_at.desc()).limit(100).all()

    return [
        AuditLogEntryOut(
            id=f"LOG-{v.id}",
            timestamp=v.created_at,
            actor=v.reviewer.full_name if v.reviewer else "Weatherly AI",
            action="Verified Report" if v.status == TrustStatus.VERIFIED else "Classified Report",
            referenceId=str(v.report_id),
            details=v.reviewer_notes or "Automated AI classification."
        ) for v in logs
    ]
