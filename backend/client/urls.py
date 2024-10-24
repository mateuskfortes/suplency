from django.urls import path
from .views import Main, LoginUserView, CreateUserView, LogoutUserView

urlpatterns = [
    path('', Main.as_view(), name='main'),
    path('register', CreateUserView.as_view(), name='register'),
    path('login', LoginUserView.as_view(), name='login'),
    path('logout', LogoutUserView.as_view(), name='logout'),
]