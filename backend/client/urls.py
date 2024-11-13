from django.urls import path
from .views import Main, LoginUserView, CreateUserView, LogoutUserView, NotebookView, SubjectView, PageView, FlashcardView, PomodoroView

urlpatterns = [
    path('', Main.as_view(), name='main'),
    path('register', CreateUserView.as_view(), name='register'),
    path('login', LoginUserView.as_view(), name='login'),
    path('logout', LogoutUserView.as_view(), name='logout'),
    path('notebook', NotebookView.as_view(), name='notebook'),
    path('subject', SubjectView.as_view(), name='subject'),
    path('page', PageView.as_view(), name='page'),
    path('flashcard', FlashcardView.as_view(), name='flashcard'),
    path('pomodoro', PomodoroView.as_view(), name='pomodoro'),
]