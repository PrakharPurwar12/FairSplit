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
from allocation.algorithms import build_prediction_features
from ml.predictor import predict_risk

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

        features = build_prediction_features(task)

        prediction = predict_risk(features)

        task.predicted_risk = prediction["predicted_risk"]
        task.risk_confidence = prediction["confidence"]
        task.last_risk_update = timezone.now()

        task.save()

        return Response(
            {
                "message": "Task updated successfully.",
                "prediction": prediction,
                "task": TaskSerializer(task).data
            }
        )