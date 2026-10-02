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
        # In real app: imd_events = imd_api.get_events_near(report.location)
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
        return verification

    def _calculate_trust_metrics(self, report: Report, imd_events: List[dict]) -> Tuple[float, TrustStatus, str]:
        if not imd_events:
            # No authoritative data found for this location/time
            # We don't flag it as fake, but keep it as UNVERIFIED
            return 0.2, TrustStatus.UNVERIFIED, "No corroborating IMD data found."

        # Find the closest authoritative event
        closest_event = imd_events[0]
        distance = closest_event["distance"] # in km
        
        # Weighting Logic:
        # - Distance < 5km: High confidence (+0.5)
        # - Distance 5-20km: Medium confidence (+0.2)
        # - Distance > 20km: Low confidence / Penalty (-0.1)
        
        base_score = 0.3
        evidence_parts = [f"Matched {closest_event['type']} event"]
        
        if distance < 5:
            score = base_score + 0.5
            status = TrustStatus.VERIFIED
            evidence_parts.append(f"High proximity ({distance}km)")
        elif distance < 20:
            score = base_score + 0.2
            status = TrustStatus.LIKELY_GENUINE
            evidence_parts.append(f"Moderate proximity ({distance}km)")
        else:
            score = base_score - 0.1
            status = TrustStatus.UNVERIFIED
            evidence_parts.append(f"Low proximity ({distance}km)")

        # Cap score at 1.0
        final_score = max(0.0, min(1.0, score))
        return final_score, status, "; ".join(evidence_parts)

    def _get_simulated_imd_data(self, location):
        # In reality, this would be a PostGIS query: 
        # ST_DWithin(report_location, imd_sensor_location, distance)
        # Returning dummy data for the logic flow
        return [{"type": "Flood", "distance": 3.2}] # Simulating a close match
