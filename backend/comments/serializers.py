# comments/serializers.py
from rest_framework import serializers
from comments.models import Comment
from user.models import User
from datetime import timedelta
from django.utils import timezone
from comments.profanities import korean_profanities  # 비속어 목록 임포트


class CommentCreateSerializer(serializers.ModelSerializer):
    nickname = serializers.CharField(max_length=50)  # 닉네임을 문자열로 입력받음
    comment_text = serializers.CharField()  # 댓글 내용을 입력받음

    class Meta:
        model = Comment
        fields = ['nickname', 'comment_text']

    def validate_nickname(self, value):
        # 닉네임이 존재하는지 검증
        if not User.objects.filter(nickname=value).exists():
            raise serializers.ValidationError("해당 닉네임을 가진 사용자가 없습니다.")

        # 해당 유저가 이미 3개의 댓글을 작성했는지 확인
        user = User.objects.get(nickname=value)
        if Comment.objects.filter(nickname=user).count() >= 3:
            raise serializers.ValidationError("유저당 최대 3개의 댓글만 작성할 수 있습니다.")

        # 최근 1분 내에 댓글을 작성했는지 확인
        recent_comment = Comment.objects.filter(nickname=user).order_by('-created_at').first()
        if recent_comment and (timezone.now() - recent_comment.created_at) < timedelta(seconds=30):
            raise serializers.ValidationError("30초내에 댓글을 연속으로 작성할 수 없습니다.")

        return value

    def validate_comment_text(self, value):
        # 현재 요청한 유저의 닉네임을 가져옴
        user_nickname = self.initial_data.get('nickname')

        if not user_nickname:
            raise serializers.ValidationError({"nickname": "닉네임이 필요합니다."})

        # 유저 객체를 가져옴
        user = User.objects.get(nickname=user_nickname)

        # 해당 유저가 동일한 내용의 댓글을 작성했는지 확인
        if Comment.objects.filter(nickname=user, comment_text=value).exists():
            raise serializers.ValidationError({"comment_text": "같은 내용의 댓글을 다시 작성할 수 없습니다."})

        # 비속어 필터링 적용 (한국어 비속어 목록 사용)
        if any(bad_word in value for bad_word in korean_profanities):
            raise serializers.ValidationError({"comment_text": "비속어가 포함된 댓글은 작성할 수 없습니다."})

        return value

    def create(self, validated_data):
        # 닉네임을 이용해 유저 객체를 가져옴
        user = User.objects.get(nickname=validated_data['nickname'])
        return Comment.objects.create(nickname=user, comment_text=validated_data['comment_text'])
