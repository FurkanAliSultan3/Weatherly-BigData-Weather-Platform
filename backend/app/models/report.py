from sqlalchemy import Column, Integer, String, Text, ForeignKey, Float, Enum
from sqlalchemy.orm import relationship
from geoalchemy2 import Geometry
from .base import Base, TimestampMixin
import enum

class ReportCategory(enum.Enum):
    FLOOD = "flood"
    HEATWAVE = "heatwave"
    STORM = "storm"
    FOG = "fog"
    DUST = "dust"
    WIND = "wind"
    OTHER = "other"

class Report(Base, TimestampMixin):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True) # Nullable for anonymous reports
    category = Column(Enum(ReportCategory), nullable=False)
    description = Column(Text, nullable=False)
    
    # PostGIS Geometry field for the report location (Point, SRID 4326 for WGS84)
    location = Column(Geometry("POINT", srid=4326), nullable=False)
    
    media_url = Column(String, nullable=True) # Link to S3/MinIO bucket
    raw_text = Column(Text, nullable=True) # Original text from WhatsApp/Web
    
    # Perceptual hash for duplicate detection
    media_hash = Column(String, index=True, nullable=True)

    # Relationships
    user = relationship("User", backref="reports")
    verifications = relationship("Verification", back_populates="report")
