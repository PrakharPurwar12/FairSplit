from django.urls import path
from .views import (
    SkillListCreateView,
    UserSkillListCreateView,
    UserSkillDetailView,
)

urlpatterns = [

    path(
        "",
        SkillListCreateView.as_view(),
        name="skills"
    ),

    path(
        "user/",
        UserSkillListCreateView.as_view(),
        name="user-skills"
    ),

    path(
        "user/<int:pk>/",
        UserSkillDetailView.as_view(),
        name="user-skill-detail"
    ),
]