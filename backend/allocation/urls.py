from django.urls import path

from .views import GenerateAllocationView, RecommendReassignmentView

urlpatterns = [

    path(
        "generate/<int:project_id>/",
        GenerateAllocationView.as_view(),
        name="generate-allocation"
    ),
    
    path(
    "recommend/<int:task_id>/",
    RecommendReassignmentView.as_view(),
    name="recommend-reassignment",
),
]