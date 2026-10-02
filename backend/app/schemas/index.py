from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from .models.user import UserRole

# --- User Schemas ---

class UserBase(BaseModel):
    email: str
    full_name: Optional[str] = None
    role: UserRole = UserRole.CITIZEN

class UserCreate(UserBase):
    password: str

class UserOut(UserBase):
    id: int
    is_active: bool
    is_verified: bool

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    user_id: Optional[str] = None

# --- Weather Report Schemas ---
# Aligned with frontend/src/types/index.ts

class LocationSchema(BaseModel):
    lat: float
    lng: float
    city: Optional[str] = None
    state: Optional[str] = None

class WeatherReportBase(BaseModel):
    phenomenon: str
    description: str
    location: LocationSchema

class WeatherReportCreate(WeatherReportBase):
    pass

class WeatherReportOut(BaseModel):
    id: str # Cast from int to string for frontend compatibility
    phenomenon: str
    description: str
    location: LocationSchema
    timestamp: datetime
    status: str
    trustScore: float
    aiConfidence: float
    source: str
    media: Optional[List[str]] = []

    class Config:
        from_attributes = True

# --- Analytics Schemas ---

class IntelligenceKPIs(BaseModel):
    totalReports: int
    verifiedReports: int
    underReview: int
    suspiciousReports: int
    activeAlerts: int
    systemTrustIndex: float
    aiCrossRefRate: float

class AuditLogEntryOut(BaseModel):
    id: str
    timestamp: datetime
    actor: str
    action: str
    referenceId: str
    details: str

    class Config:
        from_attributes = True
