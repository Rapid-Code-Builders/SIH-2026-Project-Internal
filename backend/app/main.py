from fastapi import FastAPI
from sqlalchemy import text

from app.database import Base, engine
from app.models import (
    User,
    UserProfile,
    Beach,
    BeachCondition,
    SafetyIndex,
    Report,
    Alert,
)

app = FastAPI(
    title="Kinaara API",
    description="Backend API for the Kinaara coastal safety platform",
    version="1.0.0",
)

Base.metadata.create_all(bind=engine)

@app.get("/")
def root():
    return {
        "message": "Kinaara API is running",
        "status": "ok"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }


@app.get("/db-test")
def database_test():
    with engine.connect() as connection:
        result = connection.execute(text("SELECT 1"))

        return {
            "database": "connected",
            "result": result.scalar()
        }