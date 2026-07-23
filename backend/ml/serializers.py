from rest_framework import serializers


class RiskPredictionSerializer(serializers.Serializer):

    estimated_hours = serializers.FloatField()

    difficulty = serializers.IntegerField()

    priority = serializers.ChoiceField(
        choices=["low", "medium", "high"]
    )

    required_skills = serializers.IntegerField()

    skill_score = serializers.FloatField()

    workload_score = serializers.FloatField()

    active_tasks = serializers.IntegerField()

    days_left = serializers.IntegerField()

    completion_percentage = serializers.IntegerField()