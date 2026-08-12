from fastapi import FastAPI

app = FastAPI(
    title="Kinaara API",
    description="Backend API for the Kinaara coastal safety platform",
    version="1.0.0",
)


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