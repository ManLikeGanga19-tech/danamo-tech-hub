"""Create an admin user, or reset an existing user's password and promote them.

Usage (inside the backend container on the server):
    docker compose run --rm backend python -m app.cli.create_admin --email you@example.com

The password is read interactively (never passed on the command line, so it
doesn't end up in shell history or `ps`). For automation, pipe it on stdin with
--password-stdin.
"""

import argparse
import asyncio
import getpass
import sys

from email_validator import EmailNotValidError, validate_email
from sqlalchemy import select

from app.core.security import hash_password
from app.db.session import SessionLocal, engine
from app.models import User

MIN_PASSWORD_LENGTH = 12


def read_password(from_stdin: bool) -> str:
    if from_stdin:
        password = sys.stdin.readline().rstrip("\n")
    else:
        if not sys.stdin.isatty():
            sys.exit(
                "No interactive terminal for the password prompt. Run this from a real "
                "terminal (ssh -t ...), or pipe the password in with --password-stdin."
            )
        password = getpass.getpass("Password: ")
        if password != getpass.getpass("Repeat password: "):
            sys.exit("Passwords do not match.")
    if len(password) < MIN_PASSWORD_LENGTH:
        sys.exit(f"Password must be at least {MIN_PASSWORD_LENGTH} characters.")
    return password


async def upsert_admin(email: str, password: str, role: str, full_name: str | None) -> str:
    async with SessionLocal() as db:
        user = await db.scalar(select(User).where(User.email == email))
        if user:
            user.hashed_password = hash_password(password)
            user.role = role
            user.is_active = True
            if full_name:
                user.full_name = full_name
            action = "updated"
        else:
            db.add(User(email=email, hashed_password=hash_password(password), role=role, full_name=full_name))
            action = "created"
        await db.commit()
    await engine.dispose()
    return action


def main() -> None:
    parser = argparse.ArgumentParser(description="Create or update a Danamo admin user.")
    parser.add_argument("--email", required=True)
    parser.add_argument("--name", default=None, help="Full name (optional)")
    parser.add_argument("--role", choices=["admin", "superadmin"], default="admin")
    parser.add_argument("--password-stdin", action="store_true", help="Read the password from stdin")
    args = parser.parse_args()

    try:
        email = validate_email(args.email, check_deliverability=False).normalized.lower()
    except EmailNotValidError as exc:
        sys.exit(f"Invalid email: {exc}")

    password = read_password(args.password_stdin)
    action = asyncio.run(upsert_admin(email, password, args.role, args.name))
    print(f"Admin {action}: {email} ({args.role})")


if __name__ == "__main__":
    main()
