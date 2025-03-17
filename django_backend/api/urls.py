from django.urls import path
from api import views

urlpatterns = [
    path('todo/',views.TodoList.as_view()),
]