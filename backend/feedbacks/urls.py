from django.urls import path
from .views import create_feedback, get_feedback

app_name = 'feedbacks'

urlpatterns = [
    path('', create_feedback, name='create-feedback'),
    path('<int:feedback_id>/', get_feedback, name='get-feedback'),
]
