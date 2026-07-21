from rest_framework import serializers
from .models import (
    Task,
    TaskSkill,
    TaskAssignment,
    AssignmentHistory
)


class TaskSerializer(serializers.ModelSerializer):

    project_name = serializers.ReadOnlyField(source="project.title")
    created_by_name = serializers.ReadOnlyField(source="created_by.username")

    class Meta:
        model = Task
        fields = (
            "id",
            "project",
            "project_name",
            "title",
            "description",
            "estimated_hours",
            "actual_hours",
            "difficulty",
            "priority",
            "deadline",
            "status",
            "completion_percentage",
            "created_by",
            "created_by_name",
            "created_at",
            "updated_at",
        )
        read_only_fields = (
            "created_by",
            "created_at",
            "updated_at",
        )


class TaskSkillSerializer(serializers.ModelSerializer):

    skill_name = serializers.ReadOnlyField(source="skill.name")

    class Meta:
        model = TaskSkill
        fields = (
            "id",
            "task",
            "skill",
            "skill_name",
            "importance",
        )


class TaskAssignmentSerializer(serializers.ModelSerializer):

    assigned_to_name = serializers.ReadOnlyField(
        source="assigned_to.username"
    )

    class Meta:
        model = TaskAssignment
        fields = (
            "id",
            "task",
            "assigned_to",
            "assigned_to_name",
            "assigned_by",
            "assigned_at",
        )
        read_only_fields = (
            "assigned_by",
            "assigned_at",
        )


class AssignmentHistorySerializer(serializers.ModelSerializer):

    previous_member_name = serializers.ReadOnlyField(
        source="previous_member.username"
    )

    new_member_name = serializers.ReadOnlyField(
        source="new_member.username"
    )

    changed_by_name = serializers.ReadOnlyField(
        source="changed_by.username"
    )

    class Meta:
        model = AssignmentHistory
        fields = "__all__"