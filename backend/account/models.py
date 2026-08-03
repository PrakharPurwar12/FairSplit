from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.


class User(AbstractUser):

    ROLE_CHOICES = (
        ("manager", "Manager"),
        ("member", "Member"),
    )

    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="member")

    experience = models.PositiveIntegerField(default=0)

    availability_hours = models.PositiveIntegerField(default=40)

    profile_picture = models.URLField(blank=True, null=True)

    is_onboarded = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.username
