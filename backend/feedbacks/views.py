from drf_yasg.utils import swagger_auto_schema
from rest_framework import status, serializers
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Feedback  # Feedback 모델이 있는지 확인하세요.

import logging  # 로그 검사
logger = logging.getLogger(__name__)

class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = ['id', 'feedback', 'created_at']

@swagger_auto_schema(
    method='post',
    operation_id='피드백 생성',
    operation_description='피드백 내용을 이용해 피드백을 생성합니다.',
    tags=['Feedbacks'],
    request_body=FeedbackSerializer,
    responses={
        201: "피드백 생성 성공",
        400: "잘못된 요청. 피드백 내용을 제공해주세요.",
    }
)
@api_view(['POST'])
def create_feedback(request):
    """
    피드백 생성
    """
    serializer = FeedbackSerializer(data=request.data)
    try:
        serializer.is_valid(raise_exception=True)
    except serializers.ValidationError as e:
        logger.error("Error: ", e)
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    # 문제 없으면 저장
    feedback = serializer.save()
    return Response({
        "code": 201,
        "message": "피드백 생성 성공",
        "data": {
            "id": feedback.id,
            "feedback": feedback.feedback,
            "created_at": feedback.created_at.isoformat()
        }
    }, status=status.HTTP_201_CREATED)

@swagger_auto_schema(
    method='get',
    operation_id='피드백 조회',
    operation_description='피드백 내용을 조회합니다.',
    tags=['Feedbacks'],
)
@api_view(['GET'])
def get_feedback(request, feedback_id):
    try:
        feedback = Feedback.objects.get(id=feedback_id)
        return Response({
            "code": 200,
            "message": "피드백 조회 성공",
            "data": {
                "id": feedback.id,
                "feedback": feedback.feedback,
                "created_at": feedback.created_at.isoformat()
            }
        }, status=status.HTTP_200_OK)
    except Feedback.DoesNotExist:
        return Response({"error": "피드백을 찾을 수 없습니다."}, status=status.HTTP_404_NOT_FOUND)
