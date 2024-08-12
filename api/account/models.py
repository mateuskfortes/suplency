from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _
import uuid

class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(_("email address"), unique=True)

    grupos = models.ManyToManyField(
        'auth.Group',
        related_name='users',
        blank=True,
        related_query_name='user',
    )

    permissoes = models.ManyToManyField(
        'auth.Permission',
        related_name='users',
        blank=True,
        related_query_name='user',
    )
