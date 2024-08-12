from django.urls import path
from . import views


urlpatterns = [
    path('sing-up/', views.singUpView, name='sing-up'),
    path('sing-in/', views.singInView, name='sing-in'),
    path('logout/', views.logOutView, name='logout'),
]