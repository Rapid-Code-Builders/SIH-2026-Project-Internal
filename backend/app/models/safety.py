from datetime import datetime

from sqlalchemy import Boolean, DateTime, Float, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from app.models.beach import Beach

class SafetyIndex(Base):
    __tablename__ = "safety_indices"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True
    )

    beach_id: Mapped[int] = mapped_column(
        ForeignKey("beaches.id"),
        nullable=False,
        index=True
    )

    activity: Mapped[str] = mapped_column(
        String(50),
        nullable=False
    )

    score: Mapped[float] = mapped_column(
        Float,
        nullable=False
    )

    status: Mapped[str] = mapped_column(
        String(30),
        nullable=False
    )

    weather_score: Mapped[float | None] = mapped_column(
        Float
    )

    ocean_score: Mapped[float | None] = mapped_column(
        Float
    )

    water_score: Mapped[float | None] = mapped_column(
        Float
    )

    crowd_score: Mapped[float | None] = mapped_column(
        Float
    )

    safety_override: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False
    )

    override_reason: Mapped[str | None] = mapped_column(
        String(255)
    )

    recorded_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )

    beach: Mapped["Beach"] = relationship(
    back_populates="safety_indices"
    )