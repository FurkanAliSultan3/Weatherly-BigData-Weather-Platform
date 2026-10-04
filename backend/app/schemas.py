from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime
from enum import Enum

class ReportStatus(str, Enum):
    VERIFIED = "VERIFIED"
    LIKELY = "LIKELY"
    UNVERIFIED = "UNVERIFIED"
    FLAGGED = "FLAGGED"

class SourceType(str, Enum):
    CITIZEN = "CITIZEN"
    SOCIAL_MEDIA = "SOCIAL_MEDIA"
    IMD_TELEMETRY = "IMD_TELEMETRY"
    NEWS_RSS = "NEWS_RSS"

class WeatherCategory(str, Enum):
    RAINFALL = "RAINFALL"
    FLOODING = "FLOODING"
    THUNDERSTORM = "THUNDERSTORM"
    HEATWAVE = "HEATWAVE"
    FOG = "FOG"
    DUST_STORM = "DUST_STORM"
    HIGH_WINDS = "HIGH_WINDS"

class LocationSchema(BaseModel):
    lat: float
    lng: float
    city: Optional[str] = None
    state: Optional[str] = None

class ReportCreate(BaseModel):
    category: WeatherCategory
    description: str
    latitude: float
    longitude: float
    intensity_score: Optional[int] = Field(None, ge=1, le=5)

class ReportResponse(BaseModel):
    id: str
    created_at: datetime
    category: WeatherCategory
    description: str
    location: LocationSchema
    status: ReportStatus
    ai_confidence_score: Optional[float]
    source: SourceType
    media_urls: List[str] = []

    class Config:
        from_attributes = True
