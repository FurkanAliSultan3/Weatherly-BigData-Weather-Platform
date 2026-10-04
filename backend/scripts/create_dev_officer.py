import argparse
import secrets
import sys

from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.core.security import get_password_hash
from app.db import database_url
from app.models.user import User, UserRole


def create_dev_officer() -> tuple[str, str]:
    email = "developer@weatherly.local"
    password = secrets.token_urlsafe(24)

    engine = create_engine(
        database_url,
        connect_args={"connect_timeout": 10},
        future=True,
    )
    Session = sessionmaker(bind=engine, autoflush=False, autocommit=False)
    with Session() as session:
        User.__table__.create(bind=engine, checkfirst=True)
        existing_user = session.query(User).filter(User.email == email).first()
        if existing_user is not None and (
            existing_user.full_name != "Temporary Developer"
            or existing_user.role != UserRole.ANALYST
        ):
            engine.dispose()
            raise RuntimeError(
                f"{email} already exists; refusing to overwrite an existing account."
            )

        if existing_user is None:
            user = User(
                email=email,
                hashed_password=get_password_hash(password),
                full_name="Temporary Developer",
                role=UserRole.ANALYST,
                is_active=True,
                is_verified=True,
            )
            session.add(user)
        else:
            existing_user.hashed_password = get_password_hash(password)
            existing_user.is_active = True
        try:
            session.commit()
        except SQLAlchemyError:
            session.rollback()
            engine.dispose()
            raise
    engine.dispose()

    return email, password


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Create a temporary analyst account in the configured database."
    )
    parser.add_argument(
        "--confirm-supabase",
        action="store_true",
        help="Confirm that the configured database is the Supabase project to modify.",
    )
    args = parser.parse_args()
    if not args.confirm_supabase:
        parser.error("Pass --confirm-supabase to confirm the account will be created in Supabase.")

    try:
        email, password = create_dev_officer()
    except RuntimeError as error:
        print(str(error), file=sys.stderr)
        return 1
    except SQLAlchemyError as error:
        print(
            f"Could not create the account ({type(error).__name__}). "
            "Check database connectivity and the existing users table.",
            file=sys.stderr,
        )
        return 1

    print("Temporary officer account created.")
    print(f"Login ID: {email}")
    print(f"Password: {password}")
    print("Role: analyst")
    print("Remove this account from the Supabase users table when development is complete.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
