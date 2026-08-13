from fastapi import FastAPI, Depends
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

from app.routers.auth import router as auth_router
from app.auth.dependencies import get_current_user
from app.routers.reports import router as reports_router
from app.routers.beaches import router as beaches_router
from app.routers.dashboard import router as dashboard_router

app = FastAPI(
    title="Kinaara API",
    description="Backend API for the Kinaara coastal safety platform",
    version="1.0.0",
)

Base.metadata.create_all(bind=engine)

app.include_router(auth_router)
app.include_router(reports_router)
app.include_router(beaches_router)
app.include_router(dashboard_router)

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

@app.get("/auth/me")
def get_me(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "role": current_user.role
    }