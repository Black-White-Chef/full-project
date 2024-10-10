from django.db import models

class Feedback(models.Model):
    feedback = models.TextField()  # 피드백 내용
    created_at = models.DateTimeField(auto_now_add=True)  # 생성 시간

    def __str__(self):
        return self.feedback
