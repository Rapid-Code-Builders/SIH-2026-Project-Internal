from datetime import datetime

from pydantic import BaseModel, ConfigDict


class ReportCreate(BaseModel):
    beach_id: int
    report_type: str
    description: str
    image_url: str | None = None

class ReportStatusUpdate(BaseModel):
    status: str
    
class ReportResponse(BaseModel):
    id: int
    user_id: int
    beach_id: int
    report_type: str
    description: str
    image_url: str | None
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)