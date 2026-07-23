from django.db.models import Count
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from tasks.models import Task, TaskAssignment
from django.db.models import Sum, Avg, Count
from allocation.algorithms import calculate_workload_score
from project.models import ProjectMember

class ProjectDashboardView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, project_id):

        tasks = Task.objects.filter(project_id=project_id)

        total = tasks.count()

        completed = tasks.filter(status="completed").count()

        in_progress = tasks.filter(status="progress").count()

        todo = tasks.filter(status="todo").count()

        review = tasks.filter(status="review").count()

        high = tasks.filter(predicted_risk="High").count()

        medium = tasks.filter(predicted_risk="Medium").count()

        low = tasks.filter(predicted_risk="Low").count()

        completion = 0

        if total:

            completion = round(
                (completed / total) * 100,
                2
            )

        return Response({

            "total_tasks": total,

            "completed_tasks": completed,

            "in_progress_tasks": in_progress,

            "review_tasks": review,

            "todo_tasks": todo,

            "completion_percentage": completion,

            "risk_distribution": {

                "High": high,

                "Medium": medium,

                "Low": low,

            }

        })

class MemberAnalyticsView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, member_id):

        assignments = (
            TaskAssignment.objects
            .filter(assigned_to_id=member_id)
            .select_related("task", "assigned_to")
        )

        if not assignments.exists():

            return Response({
                "message": "No tasks assigned."
            })

        member = assignments.first().assigned_to

        total_tasks = assignments.count()

        completed_tasks = assignments.filter(
            task__status="completed"
        ).count()

        active_tasks = assignments.filter(
            task__status__in=["todo", "progress", "review"]
        ).count()

        estimated_hours = assignments.aggregate(
            total=Sum("task__estimated_hours")
        )["total"] or 0

        actual_hours = assignments.aggregate(
            total=Sum("task__actual_hours")
        )["total"] or 0

        average_completion = assignments.aggregate(
            avg=Avg("task__completion_percentage")
        )["avg"] or 0

        workload_score = calculate_workload_score(
            float(estimated_hours)
        )

        return Response({

            "member": member.username,

            "assigned_tasks": total_tasks,

            "completed_tasks": completed_tasks,

            "active_tasks": active_tasks,

            "estimated_hours": estimated_hours,

            "actual_hours": actual_hours,

            "average_completion": round(
                average_completion,
                2
            ),

            "workload_score": workload_score

        })
        
class TeamAnalyticsView(APIView):
    permission_classes = [IsAuthenticated]

    def _get_member_statistics(self, member, project_id):
        assignments = (
            TaskAssignment.objects
            .filter(
                assigned_to=member,
                task__project_id=project_id
            )
            .select_related("task")
        )

        total_tasks = assignments.count()

        completed_tasks = assignments.filter(
            task__status="completed"
        ).count()

        active_tasks = assignments.filter(
            task__status__in=["todo", "progress", "review"]
        ).count()

        estimated_hours = assignments.aggregate(
            total=Sum("task__estimated_hours")
        )["total"] or 0

        actual_hours = assignments.aggregate(
            total=Sum("task__actual_hours")
        )["total"] or 0

        average_completion = assignments.aggregate(
            avg=Avg("task__completion_percentage")
        )["avg"] or 0

        workload_score = calculate_workload_score(
            float(estimated_hours)
        )

        return {
            "member_id": member.id,
            "member": member.username,
            "assigned_tasks": total_tasks,
            "completed_tasks": completed_tasks,
            "active_tasks": active_tasks,
            "estimated_hours": estimated_hours,
            "actual_hours": actual_hours,
            "average_completion": round(average_completion, 2),
            "workload_score": workload_score,
        }

    def get(self, request, project_id):

        project_members = (
            ProjectMember.objects
            .filter(project_id=project_id)
            .select_related("user")
        )

        team_statistics = [
            self._get_member_statistics(pm.user, project_id)
            for pm in project_members
        ]

        return Response({
            "project_id": project_id,
            "team_size": len(team_statistics),
            "team": team_statistics
        })
        
class RiskAnalyticsView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, project_id):

        tasks = Task.objects.filter(project_id=project_id)

        total_tasks = tasks.count()

        high_count = tasks.filter(predicted_risk="High").count()
        medium_count = tasks.filter(predicted_risk="Medium").count()
        low_count = tasks.filter(predicted_risk="Low").count()

        avg_confidence = (
            tasks.exclude(risk_confidence__isnull=True)
            .aggregate(avg=Avg("risk_confidence"))["avg"] or 0
        )

        high_risk_percentage = 0

        if total_tasks:
            high_risk_percentage = round(
                (high_count / total_tasks) * 100,
                2
            )

        high_risk_tasks = []

        high_tasks = (
            tasks.filter(predicted_risk="High")
            .order_by("-risk_confidence")
        )

        for task in high_tasks:

            assignment = (
                TaskAssignment.objects
                .filter(task=task)
                .select_related("assigned_to")
                .first()
            )

            high_risk_tasks.append({

                "task_id": task.id,

                "task_title": task.title,

                "assigned_to": (
                    assignment.assigned_to.username
                    if assignment
                    else None
                ),

                "status": task.status,

                "completion_percentage": task.completion_percentage,

                "deadline": task.deadline,

                "risk": task.predicted_risk,

                "confidence": task.risk_confidence

            })

        return Response({

            "project_id": project_id,

            "summary": {

                "total_tasks": total_tasks,

                "High": high_count,

                "Medium": medium_count,

                "Low": low_count

            },

            "average_confidence": round(avg_confidence, 2),

            "high_risk_percentage": high_risk_percentage,

            "high_risk_tasks": high_risk_tasks

        })