from django.urls import path
from .views import (
    InvitationPreviewView,
    InvitationAcceptView,
    InvitationCancelView,
    InvitationResendView,
)

urlpatterns = [
    path("<str:token>/", InvitationPreviewView.as_view(), name="invitation-preview"),
    path("<str:token>/accept/", InvitationAcceptView.as_view(), name="invitation-accept"),
    path("<int:invitation_id>/cancel/", InvitationCancelView.as_view(), name="invitation-cancel"),
    path("<int:invitation_id>/resend/", InvitationResendView.as_view(), name="invitation-resend"),
]
