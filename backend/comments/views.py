# comments/views.py
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from drf_yasg.utils import swagger_auto_schema
from comments.models import Comment
from comments.serializers import CommentCreateSerializer


@swagger_auto_schema(
    method='post',
    operation_id='댓글 생성',
    operation_description='닉네임과 댓글 내용을 입력하여 댓글을 생성합니다.',
    tags=['Comments'],
    request_body=CommentCreateSerializer,
    responses={
        201: "댓글이 성공적으로 생성되었습니다.",
        400: "요청이 잘못되었습니다. 닉네임이 없거나 잘못된 데이터 형식입니다.",
    }
)
@api_view(['POST'])
def create_comment(request):
    """
    댓글 생성
    """
    serializer = CommentCreateSerializer(data=request.data)

    if serializer.is_valid():
        comment = serializer.save()
        return Response({
            "code": 201,
            "message": "댓글 생성 성공",
            "data": {
                "id": comment.id,
                "nickname": comment.nickname.nickname,  # 닉네임 출력
                "comment": comment.comment_text,
                "created_at": comment.created_at
            }
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@swagger_auto_schema(
    method='get',
    operation_id='댓글 조회',
    operation_description='특정 유저의 댓글을 조회합니다.',
    tags=['Comments'],
    responses={
        200: "댓글 조회 성공",
        404: "해당 유저의 댓글이 존재하지 않습니다.",
    }
)
@api_view(['GET'])
def get_comments(request, userId):
    """
    특정 유저의 댓글 조회
    """
    comments = Comment.objects.filter(nickname__id=userId)

    if comments.exists():
        comment_list = []
        for comment in comments:
            comment_list.append({
                "id": comment.id,
                "nickname": comment.nickname.nickname,  # 닉네임 출력
                "comment": comment.comment_text,
                "created_at": comment.created_at
            })

        return Response({
            "code": 200,
            "message": "댓글 조회 성공",
            "data": comment_list
        }, status=status.HTTP_200_OK)

    return Response({
        "code": 404,
        "message": "해당 유저의 댓글이 존재하지 않습니다."
    }, status=status.HTTP_404_NOT_FOUND)


@swagger_auto_schema(
    method='get',
    operation_id='전체 댓글 조회',
    operation_description='모든 댓글을 조회합니다.',
    tags=['Comments'],
    responses={
        200: "전체 댓글 조회 성공",
    }
)
@api_view(['GET'])
def get_all_comments(request):
    """
    모든 댓글 조회
    """
    comments = Comment.objects.all()

    if comments.exists():
        comment_list = []
        for comment in comments:
            comment_list.append({
                "id": comment.id,
                "nickname": comment.nickname.nickname,  # 닉네임 출력
                "comment": comment.comment_text,
                "created_at": comment.created_at
            })

        return Response({
            "code": 200,
            "message": "전체 댓글 조회 성공",
            "data": comment_list
        }, status=status.HTTP_200_OK)

    return Response({
        "code": 200,
        "message": "댓글이 존재하지 않습니다.",
        "data": []
    }, status=status.HTTP_200_OK)