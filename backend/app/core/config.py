from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")
    database_url: str
    frontend_origin: str = "http://localhost:3000"
    session_cookie_name: str = "danamo_session"
    session_ttl_hours: int = 168
    cookie_secure: bool = False
    admin_cookie_name: str = "danamo_admin_session"
    admin_session_ttl_hours: int = 12 
    allowed_admin_origin: str = "http://admin.localhost:3000"
    admin_cookie_samesite: str = "lax"
    # allowed_admin_origin: str = "https://admin.danamotech.co.ke"
    resend_api_key: str = ""
    resend_from_email: str = "noreply@danamotech.co.ke"
    admin_notification_email: str = "hello@danamotech.co.ke"
    frontend_url: str = "https://danamotech.co.ke"
settings = Settings()
