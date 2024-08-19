from django.db import models
from django.utils.translation import gettext_lazy as _
from datetime import timedelta
import uuid

from account.models import User

class Pomodoro(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    focus_time = models.DurationField(default=timedelta(minutes=40)) 
    break_time = models.DurationField(default=timedelta(minutes=10)) 
    rest_time = models.DurationField(default=timedelta(minutes=30))  
    focus_sessions_until_rest = models.PositiveSmallIntegerField(default=4)

    user = models.OneToOneField(User, null=False, on_delete=models.CASCADE, related_name='pomodoro')

class Notebook(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    last_subject = models.ForeignKey('Subject', null=True, on_delete=models.SET_NULL, related_name='last_subject')
    user = models.OneToOneField(User, null=False, on_delete=models.CASCADE, related_name='notebook')

class Subject(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=32, default='New subject')
    color = models.CharField(max_length=32, default='white')
    last_page = models.ForeignKey(
        'Page', 
        null=True,
        on_delete=models.SET_NULL, 
        related_name='last_subject')
    notebook = models.ForeignKey('Notebook', null=False, on_delete=models.CASCADE, related_name='subject')

class Page(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    number = models.PositiveIntegerField(null=False)
    color = models.CharField(max_length=32, default='white')
    content = models.TextField(default='<p></p>')
    subject = models.ForeignKey('Subject', null=False, on_delete=models.CASCADE, related_name='page')
    
    class Meta:
        ordering = ['number']

class FlashCard(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    question = models.CharField(max_length=200)
    answer = models.CharField(max_length=200)
    subjects = models.ManyToManyField('Subject', through='FlashCardSubject')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='flashcard')

class FlashCardSubject(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    subject = models.ForeignKey('Subject', on_delete=models.CASCADE, related_name='flashcard_subject')
    flash_card = models.ForeignKey('FlashCard', on_delete=models.CASCADE, related_name='flashcard_subject')
