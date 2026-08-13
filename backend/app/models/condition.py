from datetime import datetime

from sqlalchemy import DateTime, Float, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base
from sqlalchemy.orm import Mapped, mapped_column, relationship

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from app.models.beach import Beach

class BeachCondition(Base):
    __tablename__ = "beach_conditions"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True
    )

    beach_id: Mapped[int] = mapped_column(
        ForeignKey("beaches.id"),
        nullable=False,
        index=True
    )

    temperature: Mapped[float | None] = mapped_column(
        Float
    )

    wind_speed: Mapped[float | None] = mapped_column(
        Float
    )

    wave_height: Mapped[float | None] = mapped_column(
        Float
    )

    wave_period: Mapped[float | None] = mapped_column(
        Float
    )

    water_quality_status: Mapped[str | None] = mapped_column(
        String(50)
    )

    crowd_level: Mapped[str | None] = mapped_column(
        String(20)
    )

    source: Mapped[str | None] = mapped_column(
        String(100)
    )

    recorded_at: Mapped[datetime | None] = mapped_column(
        DateTime
    )

    fetched_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )

    beach: Mapped["Beach"] = relationship(
    back_populates="conditions"
    )