from django.db import models

# Create your models here.
from django.db import models
from django.conf import settings

from project.models import Project
from skills.models import Skill


class Task(models.Model):

    PRIORITY = (
        ("low", "Low"),
        ("medium", "Medium"),
        ("high", "High"),
    )

    STATUS = (
        ("todo", "To Do"),
        ("progress", "In Progress"),
        ("review", "Review"),
        ("completed", "Completed"),
    )

    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name="tasks"
    )

    title = models.CharField(max_length=200)

    description = models.TextField(blank=True)

    estimated_hours = models.FloatField()

    difficulty = models.PositiveSmallIntegerField(default=3)

    priority = models.CharField(
        max_length=20,
        choices=PRIORITY
    )

    deadline = models.DateField()

    status = models.CharField(
        max_length=20,
        choices=STATUS,
        default="todo"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class TaskSkill(models.Model):

    task = models.ForeignKey(
        Task,
        on_delete=models.CASCADE,
        related_name="required_skills"
    )

    skill = models.ForeignKey(
        Skill,
        on_delete=models.CASCADE
    )

    importance = models.IntegerField(default=3)

    class Meta:
        unique_together = ("task", "skill")


class TaskAssignment(models.Model):

    task = models.OneToOneField(
        Task,
        on_delete=models.CASCADE,
        related_name="assignment"
    )

    assigned_to = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )

    assigned_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="assigned_by"
    )

    assigned_at = models.DateTimeField(auto_now_add=True)