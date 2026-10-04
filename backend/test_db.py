import asyncio
from sqlalchemy import text
from app.db import engine, SessionLocal
from app.core.config import settings

async def test_connection():
    print("--- Supabase Connection Test ---")
    print(f"Target Host: {settings.DATABASE_URL.split('@')[-1] if '@' in settings.DATABASE_URL else 'Unknown'}")

    try:
        # Use a synchronous session for a simple connectivity check
        with SessionLocal() as session:
            # Execute a simple query to verify connectivity
            result = session.execute(text("SELECT version();")).fetchone()
            print(f"✅ Connection Successful!")
            print(f"🚀 Database Version: {result[0]}")

            # Check if PostGIS is available
            postgis_check = session.execute(text("SELECT PostGIS_Full_Version();")).fetchone()
            if postgis_check:
                print(f"🌍 PostGIS is active: {postgis_check[0][:50]}...")
            else:
                print("⚠️ PostGIS extension not found.")

    except Exception as e:
        print(f"❌ Connection Failed!")
        print(f"Error: {str(e)}")

if __name__ == "__main__":
    # Run the check
    asyncio.run(test_connection())
