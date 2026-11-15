import hashlib
import secrets
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError, VerificationError, InvalidHashError

_ph = PasswordHasher()

def hash_password(password: str) -> str:
    return _ph.hash(password)

def verify_password(password: str, hashed: str) -> bool:
    try:
        return _ph.verify(hashed, password)
    except (VerifyMismatchError, VerificationError, InvalidHashError):
        return False

# Hash of a random value, verified when the account doesn't exist so a failed
# login takes the same time whether or not the email is registered.
_DUMMY_HASH = _ph.hash(secrets.token_urlsafe(32))


def verify_login_password(password: str, hashed: str | None) -> bool:
    """Constant-work password check that doesn't reveal unknown accounts."""
    if not hashed:
        verify_password(password, _DUMMY_HASH)
        return False
    return verify_password(password, hashed)


def needs_rehash(hashed: str) -> bool:
    try:
        return _ph.check_needs_rehash(hashed)
    except InvalidHashError:
        return True

def new_session_token() -> str:
    return secrets.token_urlsafe(32)

def hash_session_token(token: str) -> str:
    return hashlib.sha256(token.encode()).hexdigest()
