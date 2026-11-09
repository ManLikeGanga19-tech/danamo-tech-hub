from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")
    database_url: str
    frontend_origin: str = "http://localhost:3000"
    session_cookie_name: str = "danamo_session"
    session_ttl_hours: int = 168
    cookie_secure: bool = False

settings = Settings()
