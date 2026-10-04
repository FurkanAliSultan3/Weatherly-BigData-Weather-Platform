import asyncio
from app.services.ingestion import IngestionService
from app.services.verification import VerificationService
from app.models.report import ReportCategory
from app.models.verification import TrustStatus
from unittest.mock import MagicMock

async def test_weatherly_flow():
    # 1. Mock DB Session
    mock_db = MagicMock()
    
    # 2. Setup Ingestion
    ingest_service = IngestionService(mock_db)
    
    print("🚀 Simulating Citizen Report Submission...")
    report, verification = await ingest_service.process_report(
        user_id=1,
        category=ReportCategory.FLOOD,
        description="Major flooding on the main road, water levels rising!",
        lat=20.59,
        lon=78.96,
        media_url="http://example.com/flood.jpg"
    )
    report.id = 1
    print(f" Report created. Initial Status: {verification.status.value}, Score: {verification.trust_score}")

    # 3. Trigger Verification Brain
    verify_service = VerificationService(mock_db)
    
    # We mock the DB query for the report to return our object
    mock_db.query.return_value.filter.return_value.first.return_value = report
    
    print("\n🧠 Triggering Trust Engine Verification...")
    updated_verification = await verify_service.verify_report(report.id)
    
    print(f" Verification Complete!")
    print(f"Final Status: {updated_verification.status.value}")
    print(f"Final Trust Score: {updated_verification.trust_score}")
    print(f"Evidence: {updated_verification.cross_check_evidence}")

    # 4. Assertion
    assert updated_verification.status == TrustStatus.VERIFIED
    assert updated_verification.trust_score >= 0.8
    print("\n🎯 TEST PASSED: Report correctly verified against authoritative data.")

if __name__ == "__main__":
    asyncio.run(test_weatherly_flow())
