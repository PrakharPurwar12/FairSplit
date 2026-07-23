from django.db.models import Count, Sum

from project.models import Project, ProjectMember
from tasks.models import (
    Task,
    TaskSkill,
    TaskAssignment,
    AssignmentHistory,
)


# ======================================================
# Project Dashboard
# ======================================================

def project_dashboard(project_id):

    project = Project.objects.get(id=project_id)

    total_members = ProjectMember.objects.filter(
        project=project
    ).count()

    total_tasks = Task.objects.filter(
        project=project
    ).count()

    assigned_tasks = TaskAssignment.objects.filter(
        task__project=project
    ).count()

    completed_tasks = Task.objects.filter(
        project=project,
        status="completed"
    ).count()

    pending_tasks = Task.objects.filter(
        project=project
    ).exclude(
        status="completed"
    ).count()

    completion_percentage = 0

    if total_tasks > 0:
        completion_percentage = round(
            (completed_tasks / total_tasks) * 100,
            2
        )

    return {
        "project_name": project.title,
        "total_members": total_members,
        "total_tasks": total_tasks,
        "assigned_tasks": assigned_tasks,
        "completed_tasks": completed_tasks,
        "pending_tasks": pending_tasks,
        "completion_percentage": completion_percentage,
    }


# ======================================================
# Workload Analytics
# ======================================================

def workload_analytics(project_id):

    members = ProjectMember.objects.filter(
        project_id=project_id
    ).select_related("user")

    data = []

    for member in members:

        assignments = TaskAssignment.objects.filter(
            assigned_to=member.user,
            task__project_id=project_id
        )

        total_hours = assignments.aggregate(
            total=Sum("task__estimated_hours")
        )["total"] or 0

        data.append({
            "member": member.user.username,
            "assigned_tasks": assignments.count(),
            "estimated_hours": float(total_hours),
        })

    return data


# ======================================================
# Skill Analytics
# ======================================================

def skill_analytics(project_id):

    skills = (
        TaskSkill.objects
        .filter(task__project_id=project_id)
        .values("skill__name")
        .annotate(
            usage=Count("skill")
        )
        .order_by("-usage")
    )

    return list(skills)


# ======================================================
# Assignment History
# ======================================================

def assignment_history(project_id):

    history = (
        AssignmentHistory.objects
        .filter(task__project_id=project_id)
        .select_related(
            "task",
            "previous_member",
            "new_member"
        )
        .order_by("-changed_at")
    )

    result = []

    for record in history:

        result.append({

            "task": record.task.title,

            "previous_member":
                record.previous_member.username
                if record.previous_member
                else None,

            "new_member":
                record.new_member.username,

            "reason":
                record.reason,

            "changed_at":
                record.changed_at,

        })

    return result


# ======================================================
# Top Contributors
# ======================================================

def top_contributors(project_id):

    contributors = (
        TaskAssignment.objects
        .filter(task__project_id=project_id)
        .values("assigned_to__username")
        .annotate(
            assigned_tasks=Count("id")
        )
        .order_by("-assigned_tasks")
    )

    return list(contributors)