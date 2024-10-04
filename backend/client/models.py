from django.db import models
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
    focus_time = models.DurationField()
    break_time = models.DurationField()
    long_break_time = models.DurationField()
    focus_sessions_before_long_break = models.PositiveSmallIntegerField()

    user = models.OneToOneField('User', null=False, on_delete=models.CASCADE, related_name='pomodoro')

class Notebook(models.Model):
    last_subject = models.ForeignKey('Subject', null=True, on_delete=models.SET_NULL, related_name='last_subject')
    user = models.OneToOneField('User', null=False, on_delete=models.CASCADE, related_name='notebook')

class Subject(models.Model):
    name = models.CharField(max_length=32, default='New subject')
    color = models.CharField(max_length=32, default='white')

    last_page = models.ForeignKey(
        'Page',
        null=True,
        on_delete=models.SET_NULL,
        related_name='last_subject')
    notebook = models.ForeignKey('Notebook', null=False, on_delete=models.CASCADE, related_name='subject')

class Page(models.Model):
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
    user = models.ForeignKey('User', on_delete=models.CASCADE, related_name='flashcard')

class FlashCardSubject(models.Model):
    subject = models.ForeignKey('Subject', on_delete=models.CASCADE, related_name='flashcard_subject')
    flash_card = models.ForeignKey('FlashCard', on_delete=models.CASCADE, related_name='flashcard_subject')
