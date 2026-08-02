from django.urls import path

from .views import (
    ProjectDetailView,
    ProjectInvitationListView,
    ProjectInviteView,
    ProjectListCreateView,
    ProjectMemberDetailView,
    ProjectMemberListCreateView,
)

urlpatterns = [
    path("", ProjectListCreateView.as_view(), name="projects"),
    path("<int:pk>/", ProjectDetailView.as_view(), name="project-detail"),
    path(
        "<int:project_id>/members/",
        ProjectMemberListCreateView.as_view(),
        name="project-members",
    ),
    path(
        "members/<int:pk>/",
        ProjectMemberDetailView.as_view(),
        name="project-member-delete",
    ),
    path("<int:project_id>/invite/", ProjectInviteView.as_view(), name="project-invite"),
    path(
        "<int:project_id>/invitations/",
        ProjectInvitationListView.as_view(),
        name="project-invitations",
    ),
]
