from datetime import datetime

from pydantic import BaseModel, ConfigDict


class ConditionResponse(BaseModel):
    id: int
    beach_id: int
    temperature: float | None
    wind_speed: float | None
    wave_height: float | None
    wave_period: float | None
    water_quality_status: str | None
    crowd_level: str | None
    source: str | None
    recorded_at: datetime | None
    fetched_at: datetime

    model_config = ConfigDict(from_attributes=True)