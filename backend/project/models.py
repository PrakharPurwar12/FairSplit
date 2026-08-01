from django.conf import settings

# Create your models here.
from django.db import models


class Project(models.Model):

    STATUS = (
        ("planning", "Planning"),
        ("active", "Active"),
        ("completed", "Completed"),
    )

    title = models.CharField(max_length=200)

    description = models.TextField(blank=True)

    manager = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="managed_projects",
    )

    start_date = models.DateField()

    end_date = models.DateField()

    status = models.CharField(max_length=20, choices=STATUS, default="planning")

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=["status"], name="idx_proj_status"),
            models.Index(fields=["manager", "status"], name="idx_proj_mgr_status"),
        ]

    def __str__(self):
        return self.title


class ProjectMember(models.Model):

    ROLE = (
        ("frontend", "Frontend"),
        ("backend", "Backend"),
        ("fullstack", "Full Stack"),
        ("ml", "Machine Learning"),
        ("tester", "Tester"),
        ("designer", "Designer"),
    )

    project = models.ForeignKey(
        Project, on_delete=models.CASCADE, related_name="members"
    )

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    role = models.CharField(max_length=20, choices=ROLE, blank=True)

    skills = models.JSONField(default=list, blank=True)

    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("project", "user")

    def __str__(self):
        return f"{self.project.title} - {self.user.username}"


class ProjectInvitation(models.Model):
    STATUS_CHOICES = (
        ("PENDING", "Pending"),
        ("OPENED", "Opened"),
        ("ACCEPTED", "Accepted"),
        ("DECLINED", "Declined"),
        ("CANCELLED", "Cancelled"),
        ("EXPIRED", "Expired"),
    )

    project = models.ForeignKey(
        Project, on_delete=models.CASCADE, related_name="invitations"
    )

    email = models.EmailField()

    full_name = models.CharField(max_length=150, blank=True)

    role = models.CharField(max_length=50, blank=True)

    skills = models.JSONField(default=list, blank=True)

    personal_message = models.TextField(blank=True)

    invited_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="sent_invitations",
    )

    accepted_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="accepted_invitations",
    )

    invitation_token = models.CharField(max_length=64, unique=True, db_index=True)

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="PENDING")

    email_sent = models.BooleanField(default=False)

    email_delivery_error = models.TextField(blank=True, default="")

    resend_count = models.PositiveIntegerField(default=0)

    last_resent_at = models.DateTimeField(null=True, blank=True)

    expires_at = models.DateTimeField()

    opened_at = models.DateTimeField(null=True, blank=True)

    accepted_at = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        constraints = [
            models.UniqueConstraint(
                fields=["project", "email"],
                condition=models.Q(status="PENDING"),
                name="unique_pending_invitation_per_project",
            )
        ]

    def __str__(self):
        return f"Invite ({self.email}) for {self.project.title} - {self.status}"
