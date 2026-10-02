from sqlalchemy import Column, Integer, String, Enum, Boolean
from .base import Base, TimestampMixin
import enum

class UserRole(enum.Enum):
    CITIZEN = "citizen"
    ANALYST = "analyst"
    AUTHORITY = "authority"
    RESEARCHER = "researcher"

class User(Base, TimestampMixin):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String)
    role = Column(Enum(UserRole), default=UserRole.CITIZEN, nullable=False)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False) # For authority accounts
