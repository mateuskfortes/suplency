from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Notebook, Pomodoro, Subject, Page, FlashCard

admin.site.register(User, UserAdmin)
admin.site.register(Notebook)
admin.site.register(Subject)
admin.site.register(Page)
admin.site.register(Pomodoro)
admin.site.register(FlashCard)
