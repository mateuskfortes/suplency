from django.contrib.auth import get_user_model, login, logout
from django.views.generic import TemplateView
from django.middleware.csrf import get_token
from rest_framework import permissions, status
from rest_framework.views import APIView
from rest_framework.generics import CreateAPIView
from rest_framework.response import Response
from .models import Notebook, Subject, Page, Flashcard, Pomodoro
from .serializers import LoginSerializer, RegistrationSerializer, NotebookSerializer, SubjectSerializer, PageSerializer, FlashcardSerializer, PomodoroSerializer

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
            return Response({'csrftoken': get_token(request)}, status=status.HTTP_200_OK)
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
        
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        data = serializer.data
        data['csrftoken'] = get_token(request)
        return Response(data, status=status.HTTP_201_CREATED, headers=headers)  

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

class FlashcardView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        flashcards = Flashcard.objects.filter(user=request.user)
        return Response({'token': get_token(request), 'flashcards': FlashcardSerializer(flashcards, many=True).data}, status=status.HTTP_200_OK)
    
    def post(self, request):
        '''
        template: {
            question: string,    ->    required
            answer: string,      ->    required
            subjects: [uuid, uuid...]
        }
        '''
        flashcard_serializer = FlashcardSerializer(data={'user': request.user.id, **request.data})
        
        if flashcard_serializer.is_valid():
            flashcard = flashcard_serializer.save()
            return Response({'id': flashcard.id}, status=status.HTTP_201_CREATED)
        return Response({}, status=status.HTTP_400_BAD_REQUEST)
    
    def put(self, request):
        '''
        template: {
            id: uuid         ->      required
            question: string,
            answer: string,
            subjects: [uuid, uuid...]
        }
        '''
        flashcard_id = request.data.get('id')
        if not flashcard_id:
            return Response({}, status=status.HTTP_400_BAD_REQUEST)
        
        flashcard = Flashcard.objects.filter(id=flashcard_id).first()
        if not flashcard:
            return Response({}, status=status.HTTP_404_NOT_FOUND)
        
        flashcard_serializer = FlashcardSerializer(instance=flashcard, data=request.data, partial=True)
        
        if flashcard_serializer.is_valid():
            flashcard = flashcard_serializer.save()
            return Response({}, status=status.HTTP_204_NO_CONTENT)
        return Response({}, status=status.HTTP_400_BAD_REQUEST)   
    
    def delete(self, request, *args, **kwargs):
        '''
        template: {
            id: uuid | "all",  ->  required
        }
        '''
        flashcard_id = request.data.get('id')
        
        if not flashcard_id:
            return Response({}, status=status.HTTP_400_BAD_REQUEST)
        
        if flashcard_id == 'all':
            Flashcard.objects.filter(user=request.user).delete()
            return Response({}, status=status.HTTP_204_NO_CONTENT)   
        
        deleted_count, _ = Flashcard.objects.filter(id=flashcard_id).delete()
        if deleted_count == 0:
            return Response({}, status=status.HTTP_404_NOT_FOUND)
            
        return Response({}, status=status.HTTP_204_NO_CONTENT)

class PomodoroView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        pomodoro = Pomodoro.objects.get(user=request.user)
        return Response(PomodoroSerializer(pomodoro).data, status=status.HTTP_200_OK)
    
    def put(self, request):
        '''
        template: {   
            focus_time: mm:ss
            break_time: mm:ss
            long_break_time: mm:ss
            focus_sessions: int'
        }
        '''
        pomodoro = Pomodoro.objects.get(user=request.user)
        pomodoro_serializer = PomodoroSerializer(instance=pomodoro, data=request.data)
        
        if pomodoro_serializer.is_valid():
            pomodoro_serializer.save()
            return Response({}, status=status.HTTP_204_NO_CONTENT)
        return Response({}, status=status.HTTP_400_BAD_REQUEST)
