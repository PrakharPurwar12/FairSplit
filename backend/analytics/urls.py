from django.urls import path
from .views import ProjectDashboardView,MemberAnalyticsView, TeamAnalyticsView, RiskAnalyticsView

urlpatterns = [

    path(
        "project/<int:project_id>/",
        ProjectDashboardView.as_view(),
        name="project-dashboard"
    ),
    
    path(
    "member/<int:member_id>/",
    MemberAnalyticsView.as_view(),
    name="member-dashboard",
    ),
    
    path(
    "team/<int:project_id>/",
    TeamAnalyticsView.as_view(),
    name="team-analytics",
    ),
    
    path(
    "risk/<int:project_id>/",
    RiskAnalyticsView.as_view(),
    name="risk-analytics",
    ),

]