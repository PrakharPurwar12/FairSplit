from django.urls import path

from .views import (
    TaskListCreateView,
    TaskDetailView,
    TaskSkillListCreateView,
    TaskProgressUpdateView,
)

urlpatterns = [

    path(
        "",
        TaskListCreateView.as_view(),
        name="tasks"
    ),

    path(
        "<int:task_id>/progress/",
        TaskProgressUpdateView.as_view(),
        name="task-progress"
    ),

    path(
        "<int:pk>/",
        TaskDetailView.as_view(),
        name="task-detail"
    ),

    path(
        "<int:task_id>/skills/",
        TaskSkillListCreateView.as_view(),
        name="task-skills"
    ),
]