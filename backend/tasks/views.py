from django.db import models
from django.shortcuts import get_object_or_404
from ml.services import update_task_prediction
from notifications.services import create_notification, notify_project_members
from rest_framework import generics, status
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Task, TaskAssignment, TaskSkill
from .serializers import TaskProgressUpdateSerializer, TaskSerializer, TaskSkillSerializer


class TaskListCreateView(generics.ListCreateAPIView):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.is_superuser:
            return Task.objects.select_related("project", "created_by", "assignment__assigned_to").all()
        return (
            Task.objects.select_related("project", "created_by", "assignment__assigned_to")
            .filter(
                models.Q(created_by=user)
                | models.Q(project__manager=user)
                | models.Q(project__members__user=user)
                | models.Q(assignment__assigned_to=user)
            )
            .distinct()
        )

    def perform_create(self, serializer):
        project = serializer.validated_data["project"]
        user = self.request.user
        if not (user.is_staff or user.is_superuser or project.manager == user):
            raise PermissionDenied("Only the project manager can create tasks.")
        task = serializer.save(created_by=self.request.user)
        notify_project_members(
            project=task.project,
            title="New Task Created",
            message=f"Task '{task.title}' was created in project '{task.project.title}'.",
            notification_type="task_created",
            exclude_user=self.request.user,
        )


class TaskDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.is_superuser:
            return Task.objects.select_related("project", "created_by", "assignment__assigned_to").all()
        return (
            Task.objects.select_related("project", "created_by", "assignment__assigned_to")
            .filter(
                models.Q(created_by=user)
                | models.Q(project__manager=user)
                | models.Q(project__members__user=user)
                | models.Q(assignment__assigned_to=user)
            )
            .distinct()
        )

    def perform_update(self, serializer):
        task = self.get_object()
        user = self.request.user
        if not (user.is_staff or user.is_superuser or task.project.manager == user or task.created_by == user):
            raise PermissionDenied("Only the project manager or task creator can update this task.")
        serializer.save()

    def perform_destroy(self, instance):
        user = self.request.user
        if not (user.is_staff or user.is_superuser or instance.project.manager == user or instance.created_by == user):
            raise PermissionDenied("Only the project manager or task creator can delete this task.")
        instance.delete()


class TaskSkillListCreateView(generics.ListCreateAPIView):
    serializer_class = TaskSkillSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        task_id = self.kwargs["task_id"]
        user = self.request.user
        if user.is_staff or user.is_superuser:
            return TaskSkill.objects.filter(task_id=task_id)
        return (
            TaskSkill.objects.filter(task_id=task_id)
            .filter(models.Q(task__project__manager=user) | models.Q(task__project__members__user=user))
            .distinct()
        )

    def perform_create(self, serializer):
        task = get_object_or_404(Task, id=self.kwargs["task_id"])
        user = self.request.user
        if not (user.is_staff or user.is_superuser or task.project.manager == user or task.created_by == user):
            raise PermissionDenied("Only the project manager or task creator can add task skills.")
        serializer.save(task_id=self.kwargs["task_id"])


class TaskProgressUpdateView(APIView):

    permission_classes = [IsAuthenticated]

    def patch(self, request, task_id):

        task = get_object_or_404(Task, id=task_id)

        # Check assignment
        try:
            assignment = task.assignment
        except TaskAssignment.DoesNotExist:
            return Response(
                {"error": "Task has not been assigned."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Permission check: Allow assigned member, project manager, task creator, or admin
        is_assigned = assignment.assigned_to == request.user
        is_manager = task.project.manager == request.user
        is_creator = task.created_by == request.user
        is_admin = request.user.is_staff or request.user.is_superuser

        if not (is_assigned or is_manager or is_creator or is_admin):
            return Response(
                {"error": "You do not have permission to update progress for this task."},
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = TaskProgressUpdateSerializer(task, data=request.data, partial=True)

        serializer.is_valid(raise_exception=True)

        serializer.save()

        # Auto-update task status
        if task.completion_percentage == 0:
            task.status = "todo"
        elif task.completion_percentage == 100:
            task.status = "completed"
        else:
            task.status = "progress"

        task.save()

        # Trigger AI Prediction update
        update_task_prediction(task)

        # Notification generation
        if task.completion_percentage == 100 or task.status == "completed":
            create_notification(
                user=task.project.manager,
                title="Task Completed",
                message=f"Task '{task.title}' was marked as 100% completed by @{request.user.username}.",
                notification_type="task_completed",
            )
            create_notification(
                user=request.user,
                title="Task Completed",
                message=f"Great job! Task '{task.title}' is completed.",
                notification_type="task_completed",
            )
        else:
            if task.project.manager and task.project.manager != request.user:
                create_notification(
                    user=task.project.manager,
                    title="Task Progress Updated",
                    message=f"@{request.user.username} updated task '{task.title}' to {task.completion_percentage}%.",
                    notification_type="progress_updated",
                )

        return Response(
            {
                "message": "Task updated successfully.",
                "task_id": task.id,
                "status": task.status,
                "completion_percentage": task.completion_percentage,
                "predicted_risk": task.predicted_risk,
                "risk_confidence": task.risk_confidence,
            }
        )
