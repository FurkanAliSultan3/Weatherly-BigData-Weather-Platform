import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

def test_supabase_connection():
    print("--- Weatherly Cloud Connection Test ---")

    # Load environment variables
    load_dotenv()

    database_url = os.getenv("DATABASE_URL")
    if not database_url:
        print("❌ Error: DATABASE_URL not found in .env file")
        return

    # Force psycopg2 driver for stability
    if database_url.startswith("postgresql://"):
        database_url = database_url.replace("postgresql://", "postgresql+psycopg2://", 1)

    print(f"Attempting to connect to: {database_url.split('@')[1]}...") # Hide password for security

    try:
        # Create engine and attempt a simple query
        engine = create_engine(database_url)
        with engine.connect() as connection:
            # Simple query to check if DB is alive
            result = connection.execute(text("SELECT version();"))
            version = result.fetchone()
            print(f"✅ SUCCESS: Connected to Supabase!")
            print(f"🚀 Database Version: {version[0]}")

    except Exception as e:
        print(f"❌ CONNECTION FAILED!")
        print(f"Error Details: {e}")

if __name__ == "__main__":
    test_supabase_connection()
