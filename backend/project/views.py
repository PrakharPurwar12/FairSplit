from notifications.services import create_notification
from rest_framework import generics, status
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
from .services.email_service import EmailDeliveryError
from .services.invitation_service import InvitationService


class ProjectListCreateView(generics.ListCreateAPIView):

    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.is_superuser:
            return Project.objects.all()
        return (
            Project.objects.filter(manager=user)
            | Project.objects.filter(members__user=user)
        ).distinct()

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
        return (
            Project.objects.filter(manager=user)
            | Project.objects.filter(members__user=user)
        ).distinct()


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
        try:
            project = Project.objects.get(id=project_id)
        except Project.DoesNotExist:
            return Response(
                {"error": "Project not found."}, status=status.HTTP_404_NOT_FOUND
            )

        serializer = CreateInvitationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        data = serializer.validated_data
        invitation, email_sent = InvitationService.create_invitation(
            project=project,
            email=data["email"],
            full_name=data.get("full_name", ""),
            role=data.get("role", ""),
            skills=data.get("skills", []),
            personal_message=data.get("personal_message", ""),
            invited_by=request.user,
        )

        res_data = ProjectInvitationSerializer(invitation).data
        res_data["email_sent"] = email_sent
        if not email_sent:
            res_data["message"] = (
                "Invitation created successfully, but email delivery failed. You can attempt to resend it."
            )
        else:
            res_data["message"] = "Invitation created and email sent successfully."

        return Response(res_data, status=status.HTTP_201_CREATED)


class ProjectInvitationListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, project_id):
        try:
            project = Project.objects.get(id=project_id)
        except Project.DoesNotExist:
            return Response(
                {"error": "Project not found."}, status=status.HTTP_404_NOT_FOUND
            )

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
        return Response(
            ProjectInvitationSerializer(invitation).data, status=status.HTTP_200_OK
        )


class InvitationAcceptView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, token):
        invitation = InvitationService.accept_invitation(token, request.user)
        return Response(
            ProjectInvitationSerializer(invitation).data, status=status.HTTP_200_OK
        )


class InvitationCancelView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, invitation_id):
        invitation = InvitationService.cancel_invitation(invitation_id, request.user)
        return Response(
            ProjectInvitationSerializer(invitation).data, status=status.HTTP_200_OK
        )


class InvitationResendView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, invitation_id):
        invitation, email_sent = InvitationService.resend_invitation(
            invitation_id, request.user
        )

        res_data = ProjectInvitationSerializer(invitation).data
        res_data["email_sent"] = email_sent
        if not email_sent:
            res_data["message"] = (
                "Invitation updated, but email delivery failed. You can attempt to resend again."
            )
        else:
            res_data["message"] = "Invitation email resent successfully."

        return Response(res_data, status=status.HTTP_200_OK)
