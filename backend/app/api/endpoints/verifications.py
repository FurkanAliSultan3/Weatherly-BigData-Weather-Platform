from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..api.deps import get_current_user, get_db, RoleChecker
from ..models.user import UserRole
from ..services.verification import VerificationService

router = APIRouter()

@router.post("/{report_id}/verify")
async def trigger_verification(
    report_id: int,
    current_user: dict = Depends(get_current_user),
    # Only Analysts and Authorities can trigger manual verification
    _role: dict = Depends(RoleChecker([UserRole.ANALYST, UserRole.AUTHORITY])),
    db: Session = Depends(get_db)
):
    """Trigger the Trust Engine for a specific report"""
    service = VerificationService(db)
    try:
        verification = await service.verify_report(report_id)
        return {
            "report_id": report_id, 
            "status": verification.status, 
            "trust_score": verification.trust_score,
            "evidence": verification.cross_check_evidence
        }
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.patch("/{report_id}/override")
async def override_trust_status(
    report_id: int,
    new_status: str,
    current_user: dict = Depends(get_current_user),
    # Only Authorities can override the AI trust score
    _role: dict = Depends(RoleChecker([UserRole.AUTHORITY])),
    db: Session = Depends(get_db)
):
    """Authority override of trust status (Final Word)"""
    # Implementation to manually force a status (e.g., FLAG as fake)
    return {"message": f"Report {report_id} manually set to {new_status}"}
