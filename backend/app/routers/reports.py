from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.database import get_db
from app.models.beach import Beach
from app.models.report import Report
from app.models.user import User
from app.schemas.report import (
    ReportCreate,
    ReportResponse,
    ReportStatusUpdate
)

router = APIRouter(
    prefix="/reports",
    tags=["Reports"]
)


@router.post(
    "/",
    response_model=ReportResponse,
    status_code=status.HTTP_201_CREATED
)
def create_report(
    report_data: ReportCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    beach = (
        db.query(Beach)
        .filter(
            Beach.id == report_data.beach_id,
            Beach.active == True
        )
        .first()
    )

    if not beach:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Beach not found or inactive"
        )

    report = Report(
        user_id=current_user.id,
        beach_id=report_data.beach_id,
        report_type=report_data.report_type,
        description=report_data.description,
        image_url=report_data.image_url,
        status="PENDING"
    )

    db.add(report)
    db.commit()
    db.refresh(report)

    return report
    
@router.get(
    "/",
    response_model=list[ReportResponse]
)
def get_reports(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(Report)

    if current_user.role == "USER":
        query = query.filter(
            Report.user_id == current_user.id
        )

    return query.order_by(
        Report.created_at.desc()
    ).all()

@router.get(
    "/my",
    response_model=list[ReportResponse]
)
def get_my_reports(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return (
        db.query(Report)
        .filter(Report.user_id == current_user.id)
        .order_by(Report.created_at.desc())
        .all()
    )

@router.get(
    "/{report_id}",
    response_model=ReportResponse
)
def get_report(
    report_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    report = (
        db.query(Report)
        .filter(Report.id == report_id)
        .first()
    )

    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found"
        )

    if (
        current_user.role == "USER"
        and report.user_id != current_user.id
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to view this report"
        )

    return report

@router.patch(
    "/{report_id}/status",
    response_model=ReportResponse
)
def update_report_status(
    report_id: int,
    status_data: ReportStatusUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role not in ["AUTHORITY", "ADMIN"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only authorities and admins can update report status"
        )

    allowed_transitions = {
        "PENDING": {"IN_REVIEW"},
        "IN_REVIEW": {"RESOLVED", "REJECTED"},
        "RESOLVED": set(),
        "REJECTED": set()
    }

    report = (
        db.query(Report)
        .filter(Report.id == report_id)
        .first()
    )

    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found"
        )

    new_status = status_data.status

    if new_status not in allowed_transitions:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid report status"
        )

    if new_status not in allowed_transitions[report.status]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot change status from {report.status} to {new_status}"
        )

    report.status = new_status

    db.commit()
    db.refresh(report)

    return report

@router.delete(
    "/{report_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
def delete_report(
    report_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role != "ADMIN":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can delete reports"
        )

    report = (
        db.query(Report)
        .filter(Report.id == report_id)
        .first()
    )

    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found"
        )

    db.delete(report)
    db.commit()

    return None