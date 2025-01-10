from django.db import models
from datetime import timedelta
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _
import uuid

class User(AbstractUser):
    email = models.EmailField(_("email address"), unique=True)

    groups = models.ManyToManyField(
        'auth.Group',
        related_name='users',
        blank=True,
        related_query_name='user',
    )

    permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='users',
        blank=True,
        related_query_name='user',
    )

class Pomodoro(models.Model):
    focus_time = models.DurationField(default=timedelta(minutes=1))
    break_time = models.DurationField(default=timedelta(minutes=1))
    rest_time = models.DurationField(default=timedelta(minutes=1))
    focus_sessions = models.PositiveSmallIntegerField(default=1)

    user = models.OneToOneField('User', on_delete=models.CASCADE, related_name='pomodoro')

class Notebook(models.Model):
    last_subject = models.ForeignKey('Subject', null=True, on_delete=models.SET_NULL, related_name='last_subject')
    user = models.OneToOneField('User', on_delete=models.CASCADE, related_name='notebook')

class Subject(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=32, default='New subject')
    color = models.CharField(max_length=32, default='white')
    last_page = models.ForeignKey(
        'Page',
        null=True,
        on_delete=models.SET_NULL,
        related_name='last_subject')
    notebook = models.ForeignKey('Notebook', on_delete=models.CASCADE, related_name='subject')
    
class Page(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    number = models.PositiveIntegerField(null=False)
    color = models.CharField(max_length=32, default='white', null=True)
    content = models.JSONField(null=True)
    subject = models.ForeignKey('Subject', on_delete=models.CASCADE, related_name='page')

    class Meta:
        ordering = ['number']

class Flashcard(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    question = models.CharField(max_length=200)
    answer = models.CharField(max_length=200)

    subjects = models.ManyToManyField('Subject', through='FlashcardSubject', blank=True)
    user = models.ForeignKey('User', on_delete=models.CASCADE, related_name='flashcard')

class FlashcardSubject(models.Model):
    subject = models.ForeignKey('Subject', on_delete=models.CASCADE, related_name='flashcard_subject')
    flashcard = models.ForeignKey('FlashCard', on_delete=models.CASCADE, related_name='flashcard_subject')
