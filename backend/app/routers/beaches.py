from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.beach import Beach
from app.schemas.beach import BeachResponse, BeachDetailsResponse
from app.models.condition import BeachCondition
from app.models.safety import SafetyIndex
from app.schemas.condition import ConditionResponse
from app.schemas.safety import SafetyIndexResponse

router = APIRouter(
    prefix="/beaches",
    tags=["Beaches"]
)


@router.get(
    "/",
    response_model=list[BeachResponse]
)
def get_beaches(
    db: Session = Depends(get_db)
):
    return (
        db.query(Beach)
        .filter(Beach.active == True)
        .order_by(Beach.name)
        .all()
    )

@router.get(
    "/{beach_id}/conditions",
    response_model=ConditionResponse
)
def get_beach_conditions(
    beach_id: int,
    db: Session = Depends(get_db)
):
    beach = (
        db.query(Beach)
        .filter(
            Beach.id == beach_id,
            Beach.active == True
        )
        .first()
    )

    if not beach:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Beach not found"
        )

    condition = (
        db.query(BeachCondition)
        .filter(BeachCondition.beach_id == beach_id)
        .order_by(BeachCondition.recorded_at.desc())
        .first()
    )

    if not condition:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No condition data available"
        )

    return condition

@router.get(
    "/{beach_id}/safety",
    response_model=list[SafetyIndexResponse]
)
def get_beach_safety(
    beach_id: int,
    db: Session = Depends(get_db)
):
    beach = (
        db.query(Beach)
        .filter(
            Beach.id == beach_id,
            Beach.active == True
        )
        .first()
    )

    if not beach:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Beach not found"
        )

    safety_indices = (
        db.query(SafetyIndex)
        .filter(SafetyIndex.beach_id == beach_id)
        .order_by(SafetyIndex.recorded_at.desc())
        .all()
    )

    return safety_indices

@router.get(
    "/{beach_id}/details",
    response_model=BeachDetailsResponse
)
def get_beach_details(
    beach_id: int,
    db: Session = Depends(get_db)
):
    beach = (
        db.query(Beach)
        .filter(
            Beach.id == beach_id,
            Beach.active == True
        )
        .first()
    )

    if not beach:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Beach not found"
        )

    latest_condition = (
        db.query(BeachCondition)
        .filter(BeachCondition.beach_id == beach_id)
        .order_by(BeachCondition.recorded_at.desc())
        .first()
    )

    safety_indices = (
        db.query(SafetyIndex)
        .filter(SafetyIndex.beach_id == beach_id)
        .order_by(SafetyIndex.recorded_at.desc())
        .all()
    )

    return {
        "beach": beach,
        "latest_condition": latest_condition,
        "safety_indices": safety_indices
    }

@router.get(
    "/{beach_id}",
    response_model=BeachResponse
)
def get_beach(
    beach_id: int,
    db: Session = Depends(get_db)
):
    beach = (
        db.query(Beach)
        .filter(
            Beach.id == beach_id,
            Beach.active == True
        )
        .first()
    )

    if not beach:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Beach not found"
        )

    return beach