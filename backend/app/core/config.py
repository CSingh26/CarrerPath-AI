from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    ENV: str = "dev"
    MODEL_PATH: str = "data/models/careerpath_lgb.pkl"

    class Config:
        env_file = ".env"

settings = Settings()
