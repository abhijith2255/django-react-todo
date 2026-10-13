from django.urls import path
from .views import TodoListCreate, TodoRetrieveUpdateDestroy
from rest_framework.authtoken.views import obtain_auth_token 

urlpatterns = [
    path('todos/', TodoListCreate.as_view(), name='todo-list'),
    path('todos/<int:pk>/', TodoRetrieveUpdateDestroy.as_view(), name='todo-detail'),
    path('login/', obtain_auth_token, name='api_token_auth'), 
]