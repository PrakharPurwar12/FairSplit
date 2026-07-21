from rest_framework import serializers
from .models import Project, ProjectMember


class ProjectSerializer(serializers.ModelSerializer):

    manager_name = serializers.ReadOnlyField(source="manager.username")

    class Meta:
        model = Project
        fields = (
            "id",
            "title",
            "description",
            "manager",
            "manager_name",
            "start_date",
            "end_date",
            "status",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("manager",)


class ProjectMemberSerializer(serializers.ModelSerializer):

    username = serializers.ReadOnlyField(source="user.username")

    class Meta:
        model = ProjectMember
        fields = (
            "id",
            "project",
            "user",
            "username",
            "role",
            "joined_at",
        )