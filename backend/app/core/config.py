from typing import Literal

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    environment: Literal["development", "production"] = "development"

    database_url: str
    frontend_origin: str = "http://localhost:3000"
    frontend_url: str = "https://danamotech.co.ke"
    admin_url: str = "https://admin.danamotech.co.ke"

    session_cookie_name: str = "danamo_session"
    session_ttl_hours: int = 168
    cookie_secure: bool = False

    admin_cookie_name: str = "danamo_admin_session"
    admin_session_ttl_hours: int = 12
    # The admin UI only talks to its own origin (Next.js proxy), so the admin
    # cookie can be Strict: never sent on any cross-site request.
    admin_cookie_samesite: Literal["lax", "strict", "none"] = "strict"

    # memory:// for local dev; redis://danamo-redis:6379/0 in production
    rate_limit_storage_uri: str = "memory://"

    resend_api_key: str = ""
    resend_from_email: str = "noreply@danamotech.co.ke"
    admin_notification_email: str = "hello@danamotech.co.ke"

    @property
    def is_production(self) -> bool:
        return self.environment == "production"


settings = Settings()
