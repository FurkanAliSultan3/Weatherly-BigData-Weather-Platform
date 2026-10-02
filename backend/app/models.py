from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float
from sqlalchemy.orm import relationship, declarative_base
from geoalchemy2 import Geometry
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="citizen")  # roles: citizen, analyst, authority
    created_at = Column(DateTime, default=datetime.utcnow)

class WeatherReport(Base):
    __tablename__ = "weather_reports"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    report_type = Column(String, index=True)  # Flood, Storm, Rain, etc.
    description = Column(String)

    # PostGIS Geometry point (Longitude, Latitude)
    location = Column(Geometry(geometry_type='POINT', srid=4326))

    timestamp = Column(DateTime, default=datetime.utcnow)
    status = Column(String, default="unverified")  # unverified, verified, likely_genuine, flagged
    trust_score = Column(Float, default=0.0)

    user = relationship("User", back_populates="reports")
    verifications = relationship("Verification", back_populates="report")

class Verification(Base):
    __tablename__ = "verifications"

    id = Column(Integer, primary_key=True, index=True)
    report_id = Column(Integer, ForeignKey("weather_reports.id"))
    verifier_id = Column(Integer, ForeignKey("users.id"))
    verification_date = Column(DateTime, default=datetime.utcnow)
    score_change = Column(Float)
    notes = Column(String)

    report = relationship("WeatherReport", back_populates="verifications")
    verifier = relationship("User")

User.reports = relationship("WeatherReport", order_by=WeatherReport.id, back_populates="user")
