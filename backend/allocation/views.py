from django.shortcuts import get_object_or_404
from project.models import Project
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from tasks.models import Task

from .algorithms import allocate_tasks, recommend_reassignment


class GenerateAllocationView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request, project_id):

        project = get_object_or_404(Project, id=project_id)
        if not (request.user.is_staff or request.user.is_superuser or project.manager == request.user):
            return Response(
                {"error": "Only the project manager can generate allocations."}, status=status.HTTP_403_FORBIDDEN
            )

        result = allocate_tasks(project_id)

        return Response(result)


class RecommendReassignmentView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request, task_id):

        task = get_object_or_404(Task, id=task_id)

        project = task.project
        if not (
            request.user.is_staff
            or request.user.is_superuser
            or project.manager == request.user
            or project.members.filter(user=request.user).exists()
        ):
            return Response({"error": "You do not have access to this task."}, status=status.HTTP_403_FORBIDDEN)

        if not hasattr(task, "assignment") or task.assignment is None:
            return Response({"error": "Task is not assigned."}, status=status.HTTP_400_BAD_REQUEST)

        if task.predicted_risk != "High":

            return Response(
                {
                    "message": "Reassignment not required.",
                    "current_risk": task.predicted_risk,
                }
            )

        recommendation = recommend_reassignment(task)

        return Response(
            {
                "task": task.title,
                "current_assignee": task.assignment.assigned_to.username,
                "predicted_risk": task.predicted_risk,
                "recommendation": recommendation,
            }
        )
