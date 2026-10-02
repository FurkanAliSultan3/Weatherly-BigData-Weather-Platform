import asyncio
from unittest.mock import MagicMock
from backend.app.models.report import Report, ReportCategory
from backend.app.models.verification import Verification, TrustStatus
from backend.app.services.ingestion import IngestionService
from backend.app.services.verification import VerificationService

async def test_trust_engine():
    print("--- WEATHERLY BUSINESS LOGIC TEST ---")
    
    # 1. Mock DB Session
    mock_db = MagicMock()
    
    # 2. Simulate Report Ingestion
    ingest_service = IngestionService(mock_db)
    print("\n[1] Simulating Report Submission...")
    report, verification = await ingest_service.process_report(
        user_id=1,
        category=ReportCategory.FLOOD,
        description="Severe flooding reported on MG Road",
        lat=20.59,
        lon=78.96
    )
    print(f"✅ Report created. Initial Status: {verification.status.value}")

    # 3. Simulate Verification Brain
    verify_service = VerificationService(mock_db)
    
    # Mock the DB query for the report to return our object
    mock_db.query.return_value.filter.return_value.first.return_value = report
    
    print("\n[2] Running Trust Engine Analysis...")
    updated_verification = await verify_service.verify_report(report.id)
    
    print(f"✅ Final Status: {updated_verification.status.value}")
    print(f"✅ Trust Score: {updated_verification.trust_score}")
    print(f"✅ Evidence: {updated_verification.cross_check_evidence}")

    # 4. Validation
    if updated_verification.status == TrustStatus.VERIFIED:
        print("\n🎯 RESULT: SUCCESS. The system correctly identified a verified event.")
    else:
        print("\n❌ RESULT: FAILED. The trust score was not upgraded.")

if __name__ == "__main__":
    asyncio.run(test_trust_engine())
