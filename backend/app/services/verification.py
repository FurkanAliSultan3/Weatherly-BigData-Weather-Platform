from typing import Tuple, List
from sqlalchemy.orm import Session
from sqlalchemy import func
from ..models.report import Report
from ..models.verification import Verification, TrustStatus
from ..core.config import settings

class VerificationService:
    def __init__(self, db: Session):
        self.db = db

    async def verify_report(self, report_id: int) -> Verification:
        report = self.db.query(Report).filter(Report.id == report_id).first()
        if not report:
            raise ValueError("Report not found")

        # 1. Fetch Authoritative Data (Simulation of IMD/Satellite API)
        imd_events = self._get_simulated_imd_data(report.location)

        # 2. Calculate Trust Score
        score, status, evidence = self._calculate_trust_metrics(report, imd_events)

        # 3. Update Verification record
        verification = self.db.query(Verification).filter(Verification.report_id == report_id).first()
        if not verification:
            verification = Verification(report_id=report_id)
            self.db.add(verification)

        verification.trust_score = score
        verification.status = status
        verification.cross_check_evidence = evidence

        self.db.commit()
        self.db.refresh(verification)

        from ..api.endpoints.websockets import broadcast_update
        from ..api.endpoints.reports import map_report_to_out

        row = self.db.query(Report, func.ST_Y(Report.location), func.ST_X(Report.location)).filter(Report.id == report_id).first()
        if row:
            report_obj, lat, lng = row
            report_out = map_report_to_out(report_obj, verification, lat, lng)
            await broadcast_update({
                "type": "REPORT_UPDATED",
                "data": report_out.model_dump(mode="json"),
            })

        return verification

    def update_review(
        self,
        report_id: int,
        status: TrustStatus,
        reviewer_id: int,
        notes: str | None = None,
    ) -> Verification:
        report = self.db.query(Report).filter(Report.id == report_id).first()
        if not report:
            raise ValueError("Report not found")

        verification = self.db.query(Verification).filter(
            Verification.report_id == report_id
        ).first()
        if not verification:
            verification = Verification(report_id=report_id)
            self.db.add(verification)

        verification.status = status
        verification.reviewer_id = reviewer_id
        verification.reviewer_notes = notes
        if status == TrustStatus.VERIFIED:
            verification.trust_score = max(verification.trust_score or 0.0, 0.85)
        elif status == TrustStatus.FLAGGED:
            verification.trust_score = min(verification.trust_score or 0.2, 0.35)

        self.db.commit()
        self.db.refresh(verification)
        return verification

    def _calculate_trust_metrics(self, report: Report, imd_events: List[dict]) -> Tuple[float, TrustStatus, str]:
        # PPT SPECIFICATION:
        # score >= 0.85 -> VERIFIED
        # score >= 0.65 -> LIKELY
        # score >= 0.35 -> UNVERIFIED
        # else -> FLAGGED

        if not imd_events:
            return 0.3, TrustStatus.UNVERIFIED, "No corroborating IMD data found."

        closest_event = imd_events[0]
        distance = closest_event["distance"] # in km

        # Weighting Logic to match thresholds
        base_score = 0.3
        evidence_parts = [f"Matched {closest_event['type']} event"]

        if distance < 5:
            score = 0.9 # -> VERIFIED
            evidence_parts.append(f"High proximity ({distance}km)")
        elif distance < 20:
            score = 0.7 # -> LIKELY
            evidence_parts.append(f"Moderate proximity ({distance}km)")
        else:
            score = 0.4 # -> UNVERIFIED
            evidence_parts.append(f"Low proximity ({distance}km)")

        final_score = max(0.0, min(1.0, score))

        # Map score to PPT status
        if final_score >= 0.85:
            status = TrustStatus.VERIFIED
        elif final_score >= 0.65:
            status = TrustStatus.LIKELY
        elif final_score >= 0.35:
            status = TrustStatus.UNVERIFIED
        else:
            status = TrustStatus.FLAGGED

        return final_score, status, "; ".join(evidence_parts)

    def _get_simulated_imd_data(self, location):
        return [{"type": "Flood", "distance": 3.2}]
