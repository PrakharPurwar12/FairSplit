from django.shortcuts import render

# Create your views here.
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import Project, ProjectMember
from .serializers import (
    ProjectSerializer,
    ProjectMemberSerializer,
)


from notifications.services import create_notification


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
            notification_type="project_created"
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

        return ProjectMember.objects.filter(
            project_id=project_id
        )

    def perform_create(self, serializer):
        member = serializer.save(project_id=self.kwargs["project_id"])
        project = member.project
        if member.user:
            create_notification(
                user=member.user,
                title="Added to Project Team",
                message=f"You were added to project '{project.title}' as {member.role}.",
                notification_type="member_added"
            )
        if project.manager and project.manager != self.request.user:
            create_notification(
                user=project.manager,
                title="New Member Added",
                message=f"@{member.user.username} was added to '{project.title}'.",
                notification_type="member_added"
            )


class ProjectMemberDetailView(generics.DestroyAPIView):

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
                notification_type="member_removed"
            )
        if project.manager and project.manager != user:
            create_notification(
                user=project.manager,
                title="Member Removed",
                message=f"@{user.username} was removed from project '{project.title}'.",
                notification_type="member_removed"
            )
        instance.delete()