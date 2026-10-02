import asyncio
import sys
import os

# Ensure the root directory is in the path
sys.path.append(os.getcwd())

from backend.app.models.base import Base
from backend.app.models.user import User
from backend.app.models.report import Report, ReportCategory
from backend.app.models.verification import Verification, TrustStatus
from backend.app.services.ingestion import IngestionService
from backend.app.services.verification import VerificationService
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

async def run_full_test():
    print("--- WEATHERLY MVP INTEGRATION TEST ---")
    
    # 1. Setup In-Memory SQLite for testing
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine)
    db = Session()

    try:
        # 2. Ingestion Phase
        ingest_service = IngestionService(db)
        print("\n[1/3] Testing Ingestion...")
        report, verification = await ingest_service.process_report(
            user_id=1,
            category=ReportCategory.FLOOD,
            description="Water level rising on MG Road!",
            lat=20.59,
            lon=78.96,
            media_url="http://example.com/flood.jpg"
        )
        print(f"✅ Report Created. ID: {report.id}, Status: {verification.status.value}")

        # 3. Verification Phase
        verify_service = VerificationService(db)
        print("\n[2/3] Testing Trust Engine...")
        # The simulated IMD data in our service matches this location
        updated_verification = await verify_service.verify_report(report.id)
        
        print(f"✅ Verification Result: {updated_verification.status.value}")
        print(f"✅ Trust Score: {updated_verification.trust_score}")
        print(f"✅ Evidence: {updated_verification.cross_check_evidence}")

        # 4. Security/Logic Check
        print("\n[3/3] Validating Trust Logic...")
        if updated_verification.status == TrustStatus.VERIFIED:
            print("🎯 SUCCESS: Report correctly verified against authoritative data.")
        else:
            print("⚠️ WARN: Report was not verified. Check scoring weights.")

    finally:
        db.close()

if __name__ == "__main__":
    asyncio.run(run_full_test())
