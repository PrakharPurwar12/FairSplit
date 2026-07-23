from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator

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

    estimated_hours = models.DecimalField(
        max_digits=5,
        decimal_places=2
    )

    actual_hours = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=0
    )

    difficulty = models.PositiveSmallIntegerField(
        default=3,
        validators=[
            MinValueValidator(1),
            MaxValueValidator(5)
        ]
    )

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

    completion_percentage = models.PositiveSmallIntegerField(
        default=0,
        validators=[
            MinValueValidator(0),
            MaxValueValidator(100)
        ]
    )
    
    predicted_risk = models.CharField(
    max_length=20,
    choices=[
        ("Low", "Low"),
        ("Medium", "Medium"),
        ("High", "High"),
        ("Unknown", "Unknown"),
    ],
    default="Unknown"
    )

    risk_confidence = models.FloatField(
        default=0
    )

    last_risk_update = models.DateTimeField(
        null=True,
        blank=True
    )

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="created_tasks",
        null=True,
        blank=True
    )

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

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
        on_delete=models.CASCADE,
        related_name="task_skills"
    )

    importance = models.PositiveSmallIntegerField(
        default=3,
        validators=[
            MinValueValidator(1),
            MaxValueValidator(5)
        ]
    )

    class Meta:
        unique_together = ("task", "skill")

    def __str__(self):
        return f"{self.task.title} - {self.skill.name}"


class TaskAssignment(models.Model):

    task = models.OneToOneField(
        Task,
        on_delete=models.CASCADE,
        related_name="assignment"
    )

    assigned_to = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="assigned_tasks"
    )

    assigned_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="assigned_by"
    )

    assigned_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.task.title} → {self.assigned_to.username}"


class AssignmentHistory(models.Model):

    task = models.ForeignKey(
        Task,
        on_delete=models.CASCADE,
        related_name="history"
    )

    previous_member = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="previous_assignments"
    )

    new_member = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="new_assignments"
    )

    changed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="assignment_changes"
    )

    reason = models.CharField(
        max_length=255,
        blank=True
    )

    changed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.task.title} reassigned to {self.new_member.username}"