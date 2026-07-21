from rest_framework import serializers
from .models import Skill, UserSkill


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = "__all__"


class UserSkillSerializer(serializers.ModelSerializer):

    skill_name = serializers.ReadOnlyField(source="skill.name")

    class Meta:
        model = UserSkill
        fields = (
            "id",
            "skill",
            "skill_name",
            "proficiency",
        )