from pydantic import BaseModel, ConfigDict
from app.schemas.condition import ConditionResponse
from app.schemas.safety import SafetyIndexResponse

class BeachResponse(BaseModel):
    id: int
    name: str
    state: str
    district: str
    latitude: float
    longitude: float
    description: str | None
    image_url: str | None
    active: bool

    model_config = ConfigDict(from_attributes=True)

class BeachDetailsResponse(BaseModel):
    beach: BeachResponse
    latest_condition: ConditionResponse | None
    safety_indices: list[SafetyIndexResponse]

    model_config = ConfigDict(from_attributes=True)