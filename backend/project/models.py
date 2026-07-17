from django.db import models

# Create your models here.
from django.db import models
from django.conf import settings


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
        related_name="managed_projects"
    )

    start_date = models.DateField()

    end_date = models.DateField()

    status = models.CharField(
        max_length=20,
        choices=STATUS,
        default="planning"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

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
        Project,
        on_delete=models.CASCADE,
        related_name="members"
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )

    role = models.CharField(
        max_length=20,
        choices=ROLE,
        blank=True
    )

    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("project", "user")

    def __str__(self):
        return f"{self.project.title} - {self.user.username}"