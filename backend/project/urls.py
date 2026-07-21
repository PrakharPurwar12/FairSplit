from django.urls import path

from .views import (
    ProjectListCreateView,
    ProjectDetailView,
    ProjectMemberListCreateView,
    ProjectMemberDetailView,
)

urlpatterns = [

    path(
        "",
        ProjectListCreateView.as_view(),
        name="projects"
    ),

    path(
        "<int:pk>/",
        ProjectDetailView.as_view(),
        name="project-detail"
    ),

    path(
        "<int:project_id>/members/",
        ProjectMemberListCreateView.as_view(),
        name="project-members"
    ),

    path(
        "members/<int:pk>/",
        ProjectMemberDetailView.as_view(),
        name="project-member-delete"
    ),
]