# Generated by Django 5.1.2 on 2024-11-13 21:42

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('client', '0006_rename_focus_sessions_before_long_break_pomodoro_focus_sessions'),
    ]

    operations = [
        migrations.RenameField(
            model_name='pomodoro',
            old_name='long_break_time',
            new_name='rest_time',
        ),
    ]
