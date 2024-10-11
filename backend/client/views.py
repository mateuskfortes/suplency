from django.shortcuts import render
from django.contrib.auth import get_user_model
from django.views.generic import TemplateView
from rest_framework import permissions, status
from rest_framework.views import APIView
from rest_framework.generics import CreateAPIView
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from .serializers import LoginSerializer, RegistrationSerializer


class Main(TemplateView):
    template_name = 'index.html'

class LoginUserView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = LoginSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, _ = Token.objects.get_or_create(user=user)
        return Response({"": status.HTTP_200_OK, "Token": token.key})


class CreateUserView(CreateAPIView):
    model = get_user_model()
    permission_classes = [permissions.AllowAny]
    serializer_class = RegistrationSerializer