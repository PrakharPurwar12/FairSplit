from django.urls import path

from .views import (
    TaskAssignmentCreateView,
    TaskDetailView,
    TaskListCreateView,
    TaskProgressUpdateView,
    TaskSkillListCreateView,
)

urlpatterns = [
    path("", TaskListCreateView.as_view(), name="tasks"),
    path(
        "<int:task_id>/progress/",
        TaskProgressUpdateView.as_view(),
        name="task-progress",
    ),
    path("<int:task_id>/assign/", TaskAssignmentCreateView.as_view(), name="task-assign"),
    path("<int:pk>/", TaskDetailView.as_view(), name="task-detail"),
    path("<int:task_id>/skills/", TaskSkillListCreateView.as_view(), name="task-skills"),
]
