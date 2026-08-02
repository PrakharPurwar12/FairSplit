import logging

from notifications.services import create_notification
from rest_framework import generics, status
from rest_framework.exceptions import PermissionDenied, ValidationError
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Project, ProjectInvitation, ProjectMember
from .serializers import (
    CreateInvitationSerializer,
    ProjectInvitationSerializer,
    ProjectMemberSerializer,
    ProjectSerializer,
)
from .services.invitation_service import InvitationService

logger = logging.getLogger(__name__)


class ProjectListCreateView(generics.ListCreateAPIView):

    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.is_superuser:
            return Project.objects.all()
        return (Project.objects.filter(manager=user) | Project.objects.filter(members__user=user)).distinct()

    def perform_create(self, serializer):
        project = serializer.save(manager=self.request.user)
        create_notification(
            user=self.request.user,
            title="Project Created",
            message=f"Project '{project.title}' was created successfully.",
            notification_type="project_created",
        )


class ProjectDetailView(generics.RetrieveUpdateDestroyAPIView):

    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.is_superuser:
            return Project.objects.all()
        return (Project.objects.filter(manager=user) | Project.objects.filter(members__user=user)).distinct()


class ProjectMemberListCreateView(generics.ListCreateAPIView):

    serializer_class = ProjectMemberSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        project_id = self.kwargs["project_id"]

        return ProjectMember.objects.filter(project_id=project_id)

    def perform_create(self, serializer):
        member = serializer.save(project_id=self.kwargs["project_id"])
        project = member.project
        if member.user:
            create_notification(
                user=member.user,
                title="Added to Project Team",
                message=f"You were added to project '{project.title}' as {member.role}.",
                notification_type="member_added",
            )
        if project.manager and project.manager != self.request.user:
            create_notification(
                user=project.manager,
                title="New Member Added",
                message=f"@{member.user.username} was added to '{project.title}'.",
                notification_type="member_added",
            )


class ProjectMemberDetailView(generics.RetrieveUpdateDestroyAPIView):

    serializer_class = ProjectMemberSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ProjectMember.objects.all()

    def perform_destroy(self, instance):
        project = instance.project
        user = instance.user
        if user:
            create_notification(
                user=user,
                title="Removed from Project Team",
                message=f"You were removed from project '{project.title}'.",
                notification_type="member_removed",
            )
        instance.delete()


class ProjectInviteView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, project_id):
        logger.info(
            f"[INVITE REQUEST RECEIVED] Project ID: {project_id} | "
            f"User: {request.user} ({request.user.id}) | Payload: {request.data}"
        )

        try:
            project = Project.objects.get(id=project_id)
        except Project.DoesNotExist:
            logger.warning(f"[INVITE 404 ERROR] Project ID {project_id} does not exist.")
            return Response(
                {"error": f"Project with ID {project_id} not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = CreateInvitationSerializer(data=request.data)
        if not serializer.is_valid():
            logger.error(
                f"[INVITE 400 SERIALIZER ERROR] Project ID: {project_id} | "
                f"User: {request.user} | Serializer Errors: {serializer.errors} | "
                f"Payload: {request.data}"
            )
            return Response(
                {
                    "error": "Invalid invitation payload.",
                    "details": serializer.errors,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        data = serializer.validated_data

        try:
            invitation, email_sent = InvitationService.create_invitation(
                project=project,
                email=data["email"],
                full_name=data.get("full_name", ""),
                role=data.get("role", ""),
                skills=data.get("skills", []),
                personal_message=data.get("personal_message", ""),
                invited_by=request.user,
            )
        except PermissionDenied as pe:
            logger.error(
                f"[INVITE 403 PERMISSION DENIED] Project ID: {project_id} | " f"User: {request.user} | Detail: {pe}"
            )
            return Response({"error": str(pe)}, status=status.HTTP_403_FORBIDDEN)
        except ValidationError as ve:
            err_detail = ve.detail if hasattr(ve, "detail") else str(ve)
            logger.error(
                f"[INVITE 400 VALIDATION ERROR] Project ID: {project_id} | "
                f"User: {request.user} | Detail: {err_detail}"
            )
            return Response({"error": err_detail}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as exc:
            logger.error(
                f"[INVITE 500 UNEXPECTED EXCEPTION] Project ID: {project_id} | "
                f"User: {request.user} | Exception: {exc}",
                exc_info=True,
            )
            return Response(
                {"error": f"Failed to process invitation: {str(exc)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        res_data = ProjectInvitationSerializer(invitation).data
        res_data["email_sent"] = email_sent
        if not email_sent:
            err_msg = invitation.email_delivery_error or "Unknown SMTP error"
            res_data["email_delivery_error"] = err_msg
            res_data["message"] = f"Invitation created successfully, but email delivery failed: {err_msg}"
        else:
            res_data["message"] = "Invitation created and email sent successfully."

        logger.info(
            f"[INVITE 201 RESPONSE] Invite ID: {invitation.id} | "
            f"Recipient: {invitation.email} | EmailSent: {email_sent} | Error: {invitation.email_delivery_error}"
        )

        return Response(res_data, status=status.HTTP_201_CREATED)


class ProjectInvitationListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, project_id):
        try:
            project = Project.objects.get(id=project_id)
        except Project.DoesNotExist:
            return Response({"error": "Project not found."}, status=status.HTTP_404_NOT_FOUND)

        status_filter = request.query_params.get("status")
        invitations = ProjectInvitation.objects.filter(project=project)

        if status_filter:
            invitations = invitations.filter(status=status_filter.upper())

        return Response(
            ProjectInvitationSerializer(invitations, many=True).data,
            status=status.HTTP_200_OK,
        )


class InvitationPreviewView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, token):
        invitation = InvitationService.preview_invitation(token)
        return Response(ProjectInvitationSerializer(invitation).data, status=status.HTTP_200_OK)


class InvitationAcceptView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, token):
        invitation = InvitationService.accept_invitation(token, request.user)
        return Response(ProjectInvitationSerializer(invitation).data, status=status.HTTP_200_OK)


class InvitationCancelView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, invitation_id):
        invitation = InvitationService.cancel_invitation(invitation_id, request.user)
        return Response(ProjectInvitationSerializer(invitation).data, status=status.HTTP_200_OK)


class InvitationResendView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, invitation_id):
        logger.info(
            f"[RESEND REQUEST RECEIVED] Invitation ID: {invitation_id} | " f"User: {request.user} ({request.user.id})"
        )

        try:
            invitation, email_sent = InvitationService.resend_invitation(invitation_id, request.user)
        except PermissionDenied as pe:
            logger.error(
                f"[RESEND 403 PERMISSION DENIED] Invitation ID: {invitation_id} | "
                f"User: {request.user} | Detail: {pe}"
            )
            return Response({"error": str(pe)}, status=status.HTTP_403_FORBIDDEN)
        except ValidationError as ve:
            err_detail = ve.detail if hasattr(ve, "detail") else str(ve)
            logger.error(
                f"[RESEND 400 VALIDATION ERROR] Invitation ID: {invitation_id} | "
                f"User: {request.user} | Detail: {err_detail}"
            )
            return Response({"error": err_detail}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as exc:
            logger.error(
                f"[RESEND 500 UNEXPECTED EXCEPTION] Invitation ID: {invitation_id} | "
                f"User: {request.user} | Exception: {exc}",
                exc_info=True,
            )
            return Response(
                {"error": f"Failed to resend invitation: {str(exc)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        res_data = ProjectInvitationSerializer(invitation).data
        res_data["email_sent"] = email_sent
        if not email_sent:
            err_msg = invitation.email_delivery_error or "Unknown SMTP error"
            res_data["email_delivery_error"] = err_msg
            res_data["message"] = f"Invitation updated, but email delivery failed: {err_msg}"
        else:
            res_data["message"] = "Invitation email resent successfully."

        logger.info(
            f"[RESEND 200 RESPONSE] Invitation ID: {invitation.id} | "
            f"Recipient: {invitation.email} | EmailSent: {email_sent} | Error: {invitation.email_delivery_error}"
        )

        return Response(res_data, status=status.HTTP_200_OK)
