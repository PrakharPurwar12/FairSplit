from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from tasks.models import Task
from .algorithms import recommend_reassignment
from .algorithms import allocate_tasks


class GenerateAllocationView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request, project_id):

        result = allocate_tasks(project_id)

        return Response(result)

class RecommendReassignmentView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request, task_id):

        task = Task.objects.get(id=task_id)

        if task.predicted_risk != "High":

            return Response({

                "message": "Reassignment not required.",

                "current_risk": task.predicted_risk

            })

        recommendation = recommend_reassignment(task)

        return Response({

            "task": task.title,

            "current_assignee": task.assignment.assigned_to.username,

            "predicted_risk": task.predicted_risk,

            "recommendation": recommendation

        })