from sqlalchemy import Boolean, Float, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base

from typing import TYPE_CHECKING
from sqlalchemy.orm import relationship

if TYPE_CHECKING:
    from app.models.condition import BeachCondition
    from app.models.safety import SafetyIndex
    from app.models.report import Report
    from app.models.alert import Alert

class Beach(Base):
    __tablename__ = "beaches"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True
    )

    name: Mapped[str] = mapped_column(
        String(150),
        nullable=False
    )

    state: Mapped[str] = mapped_column(
        String(100),
        nullable=False
    )

    district: Mapped[str] = mapped_column(
        String(100),
        nullable=False
    )

    latitude: Mapped[float] = mapped_column(
        Float,
        nullable=False
    )

    longitude: Mapped[float] = mapped_column(
        Float,
        nullable=False
    )

    description: Mapped[str | None] = mapped_column(
        Text
    )

    image_url: Mapped[str | None] = mapped_column(
        String(500)
    )

    active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False
    )

    conditions: Mapped[list["BeachCondition"]] = relationship(
    back_populates="beach",
    cascade="all, delete-orphan"
    )

    safety_indices: Mapped[list["SafetyIndex"]] = relationship(
        back_populates="beach",
        cascade="all, delete-orphan"
    )

    reports: Mapped[list["Report"]] = relationship(
        back_populates="beach"
    )

    alerts: Mapped[list["Alert"]] = relationship(
        back_populates="beach",
        cascade="all, delete-orphan"
    )