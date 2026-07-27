from django.shortcuts import render

# Create your views here.
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import Project, ProjectMember
from .serializers import (
    ProjectSerializer,
    ProjectMemberSerializer,
)


class ProjectListCreateView(generics.ListCreateAPIView):

    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.is_superuser:
            return Project.objects.all()
        return (Project.objects.filter(manager=user) | Project.objects.filter(members__user=user)).distinct()

    def perform_create(self, serializer):
        serializer.save(manager=self.request.user)


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
        serializer.save(project_id=self.kwargs["project_id"])


class ProjectMemberDetailView(generics.DestroyAPIView):

    serializer_class = ProjectMemberSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ProjectMember.objects.all()