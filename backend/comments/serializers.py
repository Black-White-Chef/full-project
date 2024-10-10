# comments/serializers.py
from rest_framework import serializers
from comments.models import Comment
from user.models import User

class CommentCreateSerializer(serializers.ModelSerializer):
    nickname = serializers.CharField(max_length=50)  # 닉네임을 문자열로 입력받음

    class Meta:
        model = Comment
        fields = ['nickname', 'comment_text']

    def validate_nickname(self, value):
        # 닉네임이 존재하는지 검증
        if not User.objects.filter(nickname=value).exists():
            raise serializers.ValidationError("해당 닉네임을 가진 사용자가 없습니다.")
        return value

    def create(self, validated_data):
        # 닉네임을 이용해 유저 객체를 가져옴
        user = User.objects.get(nickname=validated_data['nickname'])
        return Comment.objects.create(nickname=user, comment_text=validated_data['comment_text'])
