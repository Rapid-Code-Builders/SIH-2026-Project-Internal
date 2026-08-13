from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.models.report import Report
from app.models.beach import Beach
from app.models.user import User
from app.auth.dependencies import get_current_user
from app.schemas.dashboard import DashboardStatsResponse


router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


@router.get(
    "/stats",
    response_model=DashboardStatsResponse
)
def get_dashboard_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role not in ["AUTHORITY", "ADMIN"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only authorities and admins can access the dashboard"
        )

    total_reports = db.query(Report).count()

    pending_reports = (
        db.query(Report)
        .filter(Report.status == "PENDING")
        .count()
    )

    in_review_reports = (
        db.query(Report)
        .filter(Report.status == "IN_REVIEW")
        .count()
    )

    resolved_reports = (
        db.query(Report)
        .filter(Report.status == "RESOLVED")
        .count()
    )

    rejected_reports = (
        db.query(Report)
        .filter(Report.status == "REJECTED")
        .count()
    )

    total_beaches = db.query(Beach).count()

    active_beaches = (
        db.query(Beach)
        .filter(Beach.active == True)
        .count()
    )

    reports_by_type = (
        db.query(
            Report.report_type,
            func.count(Report.id).label("count")
        )
        .group_by(Report.report_type)
        .all()
    )

    return {
    "total_reports": total_reports,
    "pending_reports": pending_reports,
    "in_review_reports": in_review_reports,
    "resolved_reports": resolved_reports,
    "rejected_reports": rejected_reports,
    "total_beaches": total_beaches,
    "active_beaches": active_beaches,
    "reports_by_type": [
        {
            "report_type": report_type,
            "count": count
        }
        for report_type, count in reports_by_type
    ]
}

@router.get(
    "/reports",
)
def get_authority_reports(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role not in ["AUTHORITY", "ADMIN"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only authorities and admins can access reports"
        )

    reports = (
        db.query(Report)
        .filter(
            Report.status.in_(["PENDING", "IN_REVIEW"])
        )
        .order_by(Report.created_at.desc())
        .all()
    )

    return reports