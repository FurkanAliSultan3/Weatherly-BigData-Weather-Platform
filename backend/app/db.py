from sqlalchemy import create_engine
from sqlalchemy.engine import make_url
from sqlalchemy.orm import sessionmaker, declarative_base
from .core.config import settings

Base = declarative_base()

database_url = make_url(settings.DATABASE_URL)
if database_url.drivername == "postgresql+asyncpg":
    database_url = database_url.set(drivername="postgresql+psycopg2")

engine = create_engine(database_url, echo=False, future=True)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

def get_db():
    with SessionLocal() as session:
        yield session
