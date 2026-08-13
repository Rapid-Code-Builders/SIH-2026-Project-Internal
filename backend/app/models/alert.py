from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import Boolean, DateTime, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

if TYPE_CHECKING:
    from app.models.beach import Beach


class Alert(Base):
    __tablename__ = "alerts"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True
    )

    beach_id: Mapped[int] = mapped_column(
        ForeignKey("beaches.id"),
        nullable=False,
        index=True
    )

    alert_type: Mapped[str] = mapped_column(
        String(50),
        nullable=False
    )

    severity: Mapped[str] = mapped_column(
        String(30),
        nullable=False
    )

    title: Mapped[str] = mapped_column(
        String(200),
        nullable=False
    )

    message: Mapped[str] = mapped_column(
        Text,
        nullable=False
    )

    source_url: Mapped[str | None] = mapped_column(
        String(500)
    )

    active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )

    expires_at: Mapped[datetime | None] = mapped_column(
        DateTime
    )

    beach: Mapped["Beach"] = relationship(
        back_populates="alerts"
    )