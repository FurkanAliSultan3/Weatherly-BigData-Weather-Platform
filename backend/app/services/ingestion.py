import uuid
from typing import Optional, Tuple
from sqlalchemy.orm import Session
from geoalchemy2.elements import WKTElement
from ..models.report import Report, ReportCategory
from ..models.verification import Verification, TrustStatus
from ..core.config import settings

class IngestionService:
    def __init__(self, db: Session):
        self.db = db

    async def process_report(self, user_id: Optional[int], category: ReportCategory, 
                             description: str, lat: float, lon: float, 
                             media_url: Optional[str] = None, raw_text: Optional[str] = None) -> Tuple[Report, Verification]:
        
        # 1. Perceptual Hashing for Duplicate Detection (Simulation)
        # In a real app, we would download the image and use the 'imagehash' library
        media_hash = self._calculate_media_hash(media_url) if media_url else None
        
        # Check for duplicates in the last 24 hours
        if media_hash:
            duplicate = self.db.query(Report).filter(
                Report.media_hash == media_hash
            ).first()
            if duplicate:
                # Mark as duplicate in a real system, here we'll just log it
                print(f"Duplicate report detected: {duplicate.id}")

        # 2. Create the Report (PostGIS Point)
        # Note: In SQLAlchemy with GeoAlchemy2, we use 'WKTElement' or f"POINT({lon} {lat})"
        new_report = Report(
            user_id=user_id,
            category=category,
            description=description,
            location=WKTElement(f"POINT({lon} {lat})", srid=4326),
            media_url=media_url,
            raw_text=raw_text,
            media_hash=media_hash
        )
        self.db.add(new_report)
        self.db.flush() # Get the report ID

        # 3. Initial Trust Scoring (Baseline)
        # Every report starts as UNVERIFIED with a baseline score
        verification = Verification(
            report_id=new_report.id,
            status=TrustStatus.UNVERIFIED,
            trust_score=0.2 # Baseline score for new citizen reports
        )
        self.db.add(verification)
        
        self.db.commit()
        self.db.refresh(new_report)
        self.db.refresh(verification)
        
        return new_report, verification

    def _calculate_media_hash(self, url: str) -> str:
        # Simulation of Perceptual Hashing (e.g., pHash or dHash)
        # In real implementation: 
        # img = Image.open(requests.get(url, stream=True).raw)
        # return str(imagehash.phash(img))
        return f"phash_{uuid.uuid4().hex[:16]}"
