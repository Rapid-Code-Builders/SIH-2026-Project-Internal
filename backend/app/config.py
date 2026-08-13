from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "Kinaara API"
    debug: bool = True

    database_url: str

    jwt_secret: str
    access_token_expire_minutes: int = 60

    class Config:
        env_file = ".env"


settings = Settings()