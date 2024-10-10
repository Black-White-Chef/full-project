# comments/models.py
from django.db import models
from user.models import User  # User 모델을 가져옴

class Comment(models.Model):
    nickname = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments')  # User 모델과 연관
    comment_text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)  # 수정이 될 때마다 현재 날짜
    is_deleted = models.BooleanField(default=False)
    def __str__(self):
        return f"{self.nickname.nickname} - {self.comment_text}"
