from django.shortcuts import render

# Create your views here.
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import Task, TaskSkill
from .serializers import TaskSerializer, TaskSkillSerializer


class TaskListCreateView(generics.ListCreateAPIView):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Task.objects.filter(created_by=self.request.user)

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class TaskDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Task.objects.filter(created_by=self.request.user)


class TaskSkillListCreateView(generics.ListCreateAPIView):
    serializer_class = TaskSkillSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return TaskSkill.objects.filter(task_id=self.kwargs["task_id"])

    def perform_create(self, serializer):
        serializer.save(task_id=self.kwargs["task_id"])