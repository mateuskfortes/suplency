from django.contrib.auth import get_user_model, login, logout
from django.views.generic import TemplateView
from rest_framework import permissions, status
from rest_framework.views import APIView
from rest_framework.generics import CreateAPIView
from rest_framework.response import Response
from .models import Notebook, Subject, Page
from .serializers import LoginSerializer, RegistrationSerializer, NotebookSerializer, SubjectSerializer, PageSerializer

class Main(TemplateView):
    template_name = 'index.html'

class LoginUserView(APIView):
    '''
    template = {
        nameOrEmail: string, 
        password: string,
    }
    '''
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
    '''
    template = {
        username: string, 
        email: string, 
        password: string,
    }
    '''
    
    def perform_create(self, serializer):
        user = serializer.save()
        login(self.request, user)   

class LogoutUserView(APIView):
    def post(self, request, *args, **kwargs):
        logout(request)
        return Response({}, status=status.HTTP_200_OK)
  
class NotebookView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request, *args, **kwargs):
        notebook = Notebook.objects.get(user=request.user)
        return Response(NotebookSerializer(notebook).data, status=status.HTTP_200_OK)
  
class SubjectView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, *args, **kwargs):
        '''
        template: {
            name: string,
            color: string,
        }
        '''
        request.data['notebook'] = Notebook.objects.get(user=request.user).id
        subject_serializer = SubjectSerializer(data=request.data)
        
        if subject_serializer.is_valid():
            subject, page = subject_serializer.save()
            return Response({'subject_id': subject.id, 'page_id': page.id}, status=status.HTTP_201_CREATED)
        
        return Response({}, status=status.HTTP_400_BAD_REQUEST)
    
    def put(self, request, *args, **kwargs):
        '''
        template: {
            id: uuid,  ->   required
            name: string,
            color: string,
            last_page: uuid,
        }
        '''
        subject = Subject.objects.filter(id=request.data['id']).first()
        if not subject:
            return Response({}, status=status.HTTP_404_NOT_FOUND)
        
        subject_serializer = SubjectSerializer(instance=subject, data=request.data, partial=True)
        
        if subject_serializer.is_valid():
            subject_serializer.save()
            return Response({}, status=status.HTTP_204_NO_CONTENT)
        
        return Response({}, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, *args, **kwargs):
        '''
        template: {
            id: uuid  ->  required
        }
        '''
        subject_id = request.data.get('id')
        if not subject_id:
            return Response({}, status=status.HTTP_400_BAD_REQUEST)
        
        deleted_count, _ = Subject.objects.filter(id=subject_id).delete()
        if deleted_count == 0:
            return Response({}, status=status.HTTP_404_NOT_FOUND)
            
        return Response({}, status=status.HTTP_204_NO_CONTENT)
    
class PageView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, *args, **kwargs):
        '''
        template: {
            number: string,  ->  required
            color: string,
            content: json,
            subject: uuid,   ->  required
        }
        '''
        page_serializer = PageSerializer(data=request.data)
        
        if page_serializer.is_valid():
            page = page_serializer.save()
            return Response({'id': page.id}, status=status.HTTP_201_CREATED)
        
        return Response({}, status=status.HTTP_400_BAD_REQUEST)
    
    def put(self, request, *args, **kwargs):
        '''
        template: {
            id: uuid,      ->   required
            number: string,
            color: string,
            content: json,
        }
        '''
        page_id = request.data.get('id')
        if not page_id:
            return Response({}, status=status.HTTP_400_BAD_REQUEST)
        
        page = Page.objects.filter(id=page_id).first()
        if not page:
            return Response({}, status=status.HTTP_404_NOT_FOUND)
        
        page_serializer = PageSerializer(instance=page, data=request.data, partial=True)
        
        if page_serializer.is_valid():
            page_serializer.save()
            return Response({}, status=status.HTTP_204_NO_CONTENT)
        
        return Response({}, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, *args, **kwargs):
        '''
        template: {
            id: uuid,  ->  required
        }
        '''
        page_id = request.data.get('id')
        if not page_id:
            return Response({}, status=status.HTTP_400_BAD_REQUEST)
        
        deleted_count, _ = Page.objects.filter(id=page_id).delete()
        if deleted_count == 0:
            return Response({}, status=status.HTTP_404_NOT_FOUND)
            
        return Response({}, status=status.HTTP_204_NO_CONTENT)
    