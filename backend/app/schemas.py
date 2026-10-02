from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

class ReportBase(BaseModel):
    report_type: str
    description: str
    latitude: float
    longitude: float

class ReportCreate(ReportBase):
    pass

class ReportResponse(ReportBase):
    id: int
    status: str
    trust_score: float
    timestamp: datetime

    class Config:
        from_attributes = True

class UserBase(BaseModel):
    username: str
    role: str

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int

    class Config:
        from_attributes = True
