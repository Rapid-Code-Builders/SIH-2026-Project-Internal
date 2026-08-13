from pydantic import BaseModel


class ReportTypeCount(BaseModel):
    report_type: str
    count: int


class DashboardStatsResponse(BaseModel):
    total_reports: int
    pending_reports: int
    in_review_reports: int
    resolved_reports: int
    rejected_reports: int
    total_beaches: int
    active_beaches: int
    reports_by_type: list[ReportTypeCount]