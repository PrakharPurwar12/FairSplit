from django.urls import path

from .views import PredictRiskView

urlpatterns = [

    path(
        "predict-risk/",
        PredictRiskView.as_view(),
        name="predict-risk"
    ),

]