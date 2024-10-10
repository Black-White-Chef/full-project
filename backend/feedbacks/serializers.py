from rest_framework import serializers

class FeedbackSerializer(serializers.Serializer):
    feedback = serializers.CharField(max_length=255)  # 피드백 내용은 문자열
