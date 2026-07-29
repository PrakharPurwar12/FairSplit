from django.db import models
from django.conf import settings


class Notification(models.Model):
    NOTIFICATION_TYPES = (
        ("project_created", "Project Created"),
        ("member_added", "Member Added"),
        ("member_removed", "Member Removed"),
        ("task_created", "Task Created"),
        ("task_assigned", "Task Assigned"),
        ("allocation_completed", "AI Allocation Completed"),
        ("risk_high", "High Risk Warning"),
        ("progress_updated", "Progress Updated"),
        ("task_completed", "Task Completed"),
        ("invitation_sent", "Invitation Sent"),
        ("invitation_opened", "Invitation Opened"),
        ("invitation_accepted", "Invitation Accepted"),
        ("invitation_cancelled", "Invitation Cancelled"),
        ("invitation_expired", "Invitation Expired"),
        ("system", "System Alert"),
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="notifications"
    )
    title = models.CharField(max_length=255)
    message = models.TextField()
    notification_type = models.CharField(
        max_length=50,
        choices=NOTIFICATION_TYPES,
        default="system"
    )
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user.username} - {self.title} ({'Read' if self.is_read else 'Unread'})"
