from django.urls import path, include
from . import views


urlpatterns = [
    path('', views.homeView, name='home'),
    path('study/', views.studyView, name='study'),
    path('notebook/', views.Notebook.as_view(), name='notebook'),
    path('account/', include('account.urls')),
]
