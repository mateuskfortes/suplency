# Generated by Django 5.1.2 on 2024-11-08 20:11

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('client', '0002_alter_page_content_alter_page_id_alter_subject_id_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='subject',
            name='notebook',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='subject', to='client.notebook'),
        ),
    ]