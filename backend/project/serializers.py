from rest_framework import serializers

from .models import Project, ProjectInvitation, ProjectMember


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
    first_name = serializers.ReadOnlyField(source="user.first_name")
    last_name = serializers.ReadOnlyField(source="user.last_name")
    user_email = serializers.ReadOnlyField(source="user.email")
    experience = serializers.ReadOnlyField(source="user.experience")
    availability_hours = serializers.ReadOnlyField(source="user.availability_hours")
    profile_picture = serializers.ReadOnlyField(source="user.profile_picture")

    class Meta:
        model = ProjectMember
        fields = (
            "id",
            "project",
            "user",
            "username",
            "first_name",
            "last_name",
            "user_email",
            "experience",
            "availability_hours",
            "profile_picture",
            "role",
            "skills",
            "joined_at",
        )
        read_only_fields = ("project",)


class ProjectInvitationSerializer(serializers.ModelSerializer):
    invited_by_name = serializers.ReadOnlyField(source="invited_by.get_full_name")
    invited_by_username = serializers.ReadOnlyField(source="invited_by.username")
    project_title = serializers.ReadOnlyField(source="project.title")
    accepted_by_name = serializers.ReadOnlyField(source="accepted_by.get_full_name")

    class Meta:
        model = ProjectInvitation
        fields = (
            "id",
            "project",
            "project_title",
            "email",
            "full_name",
            "role",
            "skills",
            "personal_message",
            "invited_by",
            "invited_by_name",
            "invited_by_username",
            "accepted_by",
            "accepted_by_name",
            "invitation_token",
            "status",
            "email_sent",
            "email_delivery_error",
            "resend_count",
            "last_resent_at",
            "expires_at",
            "opened_at",
            "accepted_at",
            "created_at",
            "updated_at",
        )
        read_only_fields = (
            "id",
            "project",
            "invited_by",
            "accepted_by",
            "invitation_token",
            "status",
            "email_sent",
            "email_delivery_error",
            "resend_count",
            "last_resent_at",
            "expires_at",
            "opened_at",
            "accepted_at",
            "created_at",
            "updated_at",
        )


class CreateInvitationSerializer(serializers.Serializer):
    email = serializers.EmailField()
    full_name = serializers.CharField(
        max_length=150, required=False, allow_blank=True, default=""
    )
    role = serializers.CharField(
        max_length=50, required=False, allow_blank=True, default=""
    )
    skills = serializers.ListField(
        child=serializers.CharField(), required=False, default=list
    )
    personal_message = serializers.CharField(
        required=False, allow_blank=True, default=""
    )
