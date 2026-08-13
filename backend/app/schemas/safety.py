from datetime import datetime

from pydantic import BaseModel, ConfigDict


class SafetyIndexResponse(BaseModel):
    id: int
    beach_id: int
    activity: str
    score: float
    status: str
    weather_score: float | None
    ocean_score: float | None
    water_score: float | None
    crowd_score: float | None
    safety_override: bool
    override_reason: str | None
    recorded_at: datetime

    model_config = ConfigDict(from_attributes=True)