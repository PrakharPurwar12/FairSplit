from django.core.exceptions import ValidationError
from django.db import transaction
from notifications.services import create_notification
from tasks.models import AssignmentHistory, TaskAssignment


class AssignmentService:
    @staticmethod
    @transaction.atomic
    def assign_task(task, member, assigned_by, source="manual"):
        """
        Assigns a task to a project member.
        - Validates that the member belongs to the project.
        - Creates or updates TaskAssignment.
        - Creates AssignmentHistory.
        - Updates ML prediction (via update_task_prediction).
        - Generates notifications.
        """
        if member.project != task.project:
            raise ValidationError("Member must belong to the same project as the task.")

        previous_assignment = TaskAssignment.objects.filter(task=task).first()
        previous_user = previous_assignment.assigned_to if previous_assignment else None

        if previous_user == member.user:
            return previous_assignment

        reason = "Manual Assignment" if source == "manual" else "Automatic Fair Allocation"

        assignment, _created = TaskAssignment.objects.update_or_create(
            task=task,
            defaults={
                "assigned_to": member.user,
                "assigned_by": assigned_by,
            },
        )

        AssignmentHistory.objects.create(
            task=task,
            previous_member=previous_user,
            new_member=member.user,
            changed_by=assigned_by,
            reason=reason,
        )

        try:
            from ml.services import update_task_prediction

            update_task_prediction(task)
        except ImportError:
            pass

        create_notification(
            user=member.user,
            title="Task Assigned",
            message=f"Task '{task.title}' was assigned to you" + (" via AI Allocation." if source == "ai" else "."),
            notification_type="task_assigned",
        )

        if previous_user and previous_user != member.user:
            create_notification(
                user=previous_user,
                title="Task Reassigned",
                message=f"Task '{task.title}' was reassigned to someone else.",
                notification_type="task_reassigned",
            )

        return assignment
