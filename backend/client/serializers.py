import uuid
from django.db.models import F
from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth import get_user_model
from django.utils.translation import gettext_lazy as _
from .models import Notebook, Subject, Page, Flashcard, Pomodoro

UserModel = get_user_model()

class RegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = UserModel
        fields = ('username', 'email', 'password')

    def create(self, validated_data):
        user = UserModel.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
        )
        Notebook.objects.create(user=user)
        Pomodoro.objects.create(user=user)
        return user

class LoginSerializer(serializers.Serializer):
    nameOrEmail = serializers.CharField(max_length=255)
    password = serializers.CharField(
        label=_("Password"),
        trim_whitespace=False,
        max_length=128,
        write_only=True
    )

    def validate(self, data):
        nameOrEmail = data.get('nameOrEmail')
        password = data.get('password')
        if nameOrEmail and password:
            user = authenticate(request=self.context.get('request'),
                                username=nameOrEmail, 
                                password=password)
            if not user:
                msg = _('Unable to log in with provided credentials.')
                raise serializers.ValidationError(msg, code='authorization')
        else:
            msg = _('Must include "username" and "password".')
            raise serializers.ValidationError(msg, code='authorization')
        data['user'] = user
        return data
    
class PageSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Page
        fields = ('id', 'number', 'color', 'content', 'subject')
        
    def create(self, validated_data):
        validated_data['id'] = uuid.uuid4()
        
        # update the page number of pages in front of the new page
        Page.objects.filter(subject=validated_data['subject'], number__gte=validated_data['number']).update(number=F('number') + 1)
        
        page = Page.objects.create(**validated_data)
        return page
    
    def update(self, instance, validated_data):
        # Update the page number
        new_number = validated_data.get('number', instance.number)
        if new_number > instance.number:
            Page.objects.filter(subject=instance.subject, number__gt=instance.number, number__lte=new_number).update(number=F('number') - 1)
        elif new_number < instance.number:
            Page.objects.filter(subject=instance.subject, number__lt=instance.number, number__gte=new_number).update(number=F('number') + 1)
        instance.number = new_number
        
        instance.color = validated_data.get('color', instance.color)
        instance.content = validated_data.get('content', instance.content)
        instance.save()
        return instance

class SubjectSerializer(serializers.ModelSerializer):
    page = PageSerializer(many=True, read_only=True)
    notebook = serializers.PrimaryKeyRelatedField(queryset=Notebook.objects.all(), write_only=True)
    
    class Meta:
        model = Subject
        fields = ('id', 'name', 'color', 'last_page', 'notebook', 'page')

    # return the subject and its first page
    
    def create(self, validated_data):
        validated_data['id'] = uuid.uuid4()
        subject = Subject.objects.create(**validated_data)
        
        page = Page.objects.create(number=0, subject=subject)
        subject.last_page = page
        subject.save()
        
        notebook = subject.notebook
        notebook.last_subject = subject
        notebook.save()
        
        return subject, page
    
    def update(self, instance, validated_data):
        validated_data.pop('notebook', None)
        return super().update(instance, validated_data)

class NotebookSerializer(serializers.ModelSerializer):
    subject = SubjectSerializer(many=True, read_only=True)
    
    class Meta:
        model = Notebook
        fields = ('last_subject', 'subject')
    
class FlashcardSerializer(serializers.ModelSerializer):
    subjects = serializers.PrimaryKeyRelatedField(queryset=Subject.objects.all(), many=True, required=False)
    
    class Meta:
        model = Flashcard
        fields = ('id', 'question', 'answer', 'user', 'subjects')
        
    def create(self, validated_data):
        subjects_list = validated_data.pop('subjects', [])
        
        validated_data['id'] = uuid.uuid4()
        flashcard = Flashcard.objects.create(**validated_data)
        
        flashcard.subjects.set(subjects_list)
        return flashcard

class PomodoroSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pomodoro
        fields = ('focus_time', 'break_time', 'rest_time', 'focus_sessions')       
