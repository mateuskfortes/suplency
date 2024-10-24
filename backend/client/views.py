from django.contrib.auth import get_user_model, login, logout
from django.views.generic import TemplateView
from rest_framework import permissions, status
from rest_framework.views import APIView
from rest_framework.generics import CreateAPIView
from rest_framework.response import Response
from .serializers import LoginSerializer, RegistrationSerializer

class Main(TemplateView):
    template_name = 'index.html'

class LoginUserView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = LoginSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            user = serializer.validated_data.get('user')
            login(request, user)
            return Response({}, status=status.HTTP_200_OK)
        return Response({}, status=status.HTTP_401_UNAUTHORIZED)

class CreateUserView(CreateAPIView):
    model = get_user_model()
    permission_classes = [permissions.AllowAny]
    serializer_class = RegistrationSerializer
    
    def perform_create(self, serializer):
        user = serializer.save()
        login(self.request, user)
        

class LogoutUserView(APIView):
    def post(self, request, *args, **kwargs):
        logout(request)
        return Response({}, status=status.HTTP_200_OK)