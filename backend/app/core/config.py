from typing import Literal

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    environment: Literal["development", "production"] = "development"

    database_url: str
    frontend_origin: str = "http://localhost:3000"
    frontend_url: str = "https://danamotech.co.ke"

    session_cookie_name: str = "danamo_session"
    session_ttl_hours: int = 168
    cookie_secure: bool = False

    admin_cookie_name: str = "danamo_admin_session"
    admin_session_ttl_hours: int = 12
    # Admin UI calls the API through the same-origin Next.js proxy, so "lax" works.
    admin_cookie_samesite: Literal["lax", "strict", "none"] = "lax"

    # memory:// for local dev; redis://danamo-redis:6379/0 in production
    rate_limit_storage_uri: str = "memory://"

    resend_api_key: str = ""
    resend_from_email: str = "noreply@danamotech.co.ke"
    admin_notification_email: str = "hello@danamotech.co.ke"

    @property
    def is_production(self) -> bool:
        return self.environment == "production"


settings = Settings()
