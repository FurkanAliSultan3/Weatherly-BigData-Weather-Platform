from sqlalchemy import Column, Integer, String, Float, ForeignKey, Enum
from sqlalchemy.orm import relationship
from .base import Base, TimestampMixin
import enum

class TrustStatus(enum.Enum):
    VERIFIED = "verified"
    LIKELY_GENUINE = "likely_genuine"
    UNVERIFIED = "unverified"
    FLAGGED = "flagged"

class Verification(Base, TimestampMixin):
    __tablename__ = "verifications"

    id = Column(Integer, primary_key=True, index=True)
    report_id = Column(Integer, ForeignKey("reports.id"), nullable=False)
    
    status = Column(Enum(TrustStatus), default=TrustStatus.UNVERIFIED, nullable=False)
    trust_score = Column(Float, default=0.0) # 0.0 to 1.0
    
    # Evidence of cross-check (e.g., "Matched IMD Radar Event #123")
    cross_check_evidence = Column(String, nullable=True)
    
    # Reviewer info
    reviewer_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    reviewer_notes = Column(String, nullable=True)

    # Relationships
    report = relationship("Report", back_populates="verifications")
    reviewer = relationship("User")
