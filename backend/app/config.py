from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    app_name: str = "Portfolio API"
    database_url: str = "sqlite:///./portfolio.db"
    secret_key: str = "change-this-secret-key-later"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60

    class Config:
        env_file = ".env"

settings = Settings()