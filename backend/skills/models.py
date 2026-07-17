from django.db import models

# Create your models here.
from django.db import models
from django.conf import settings


class Skill(models.Model):

    name = models.CharField(
        max_length=100,
        unique=True
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class UserSkill(models.Model):

    LEVELS = (
        (1, "Beginner"),
        (2, "Basic"),
        (3, "Intermediate"),
        (4, "Advanced"),
        (5, "Expert"),
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="user_skills"
    )

    skill = models.ForeignKey(
        Skill,
        on_delete=models.CASCADE
    )

    proficiency = models.IntegerField(
        choices=LEVELS
    )

    class Meta:
        unique_together = ("user", "skill")

    def __str__(self):
        return f"{self.user.username} - {self.skill.name}"