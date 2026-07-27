from django.shortcuts import render
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Task, TaskSkill
from .serializers import TaskSerializer, TaskSkillSerializer
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Task, TaskAssignment
from .serializers import TaskProgressUpdateSerializer
from ml.services import update_task_prediction

from django.db import models

class TaskListCreateView(generics.ListCreateAPIView):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.is_superuser:
            return Task.objects.select_related("project", "created_by").all()
        return Task.objects.select_related("project", "created_by").filter(
            models.Q(created_by=user) |
            models.Q(project__manager=user) |
            models.Q(project__members__user=user) |
            models.Q(assignment__assigned_to=user)
        ).distinct()

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class TaskDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.is_superuser:
            return Task.objects.all()
        return Task.objects.filter(
            models.Q(created_by=user) |
            models.Q(project__manager=user) |
            models.Q(project__members__user=user) |
            models.Q(assignment__assigned_to=user)
        ).distinct()


class TaskSkillListCreateView(generics.ListCreateAPIView):
    serializer_class = TaskSkillSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return TaskSkill.objects.filter(task_id=self.kwargs["task_id"])

    def perform_create(self, serializer):
        serializer.save(task_id=self.kwargs["task_id"])
    
class TaskProgressUpdateView(APIView):

    def patch(self, request, task_id):

        task = get_object_or_404(Task, id=task_id)

        # Check assignment
        try:
            assignment = task.assignment
        except TaskAssignment.DoesNotExist:
            return Response(
                {"error": "Task has not been assigned."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Only assigned member can update
        if assignment.assigned_to != request.user:
            return Response(
                {"error": "You are not assigned to this task."},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = TaskProgressUpdateSerializer(
            task,
            data=request.data,
            partial=True
        )

        serializer.is_valid(raise_exception=True)

        serializer.save()

        # Auto-update task status
        if task.completion_percentage == 0:
            task.status = "todo"

        elif task.completion_percentage < 100:
            task.status = "progress"

        else:
            task.status = "completed"

        task.save()
        
        # ---------------------------------------
        # AI Risk Prediction
        # ---------------------------------------
        prediction = update_task_prediction(task)

        response_data = {
            "message": "Task updated successfully.",
            "task": TaskSerializer(task).data
        }
        
        if prediction:
            response_data["prediction"] = prediction

        return Response(response_data)