from typing import Any
from django.http.response import HttpResponse as HttpResponse
from django.shortcuts import render
from django.views.generic import View
from django.db import models
from django.http import HttpRequest, JsonResponse, HttpResponse
from main_pages.models import FlashCard, Notebook, Page, Subject
import json
import uuid

def homeView(request):
    return render(request, 'home.html')

def studyView(request):
    return render(request, 'study.html')

def create_with_uuid(cls, **kwargs):
        while True:
            new_uuid = uuid.uuid4()
            if not cls.objects.filter(id=new_uuid).exists():
                break
        instance = cls(id=new_uuid, **kwargs)
        return instance

def get_object(model_class, **params):
    if not isinstance(model_class, type) or not issubclass(model_class, models.Model):
        raise ValueError("The model_class parameter must be a Django model class.")
    
    try:
        obj = model_class.objects.get(**params)
    except model_class.DoesNotExist:
        return None
    return obj

class Notebook(View):
    def dispatch(self, request: HttpRequest, *args: Any, **kwargs: Any):
        if request.method.lower() != 'get' and not request.user.is_authenticated:
            return JsonResponse({'Unauthorized': 'login required'}, status=401)
        return super().dispatch(request, *args, **kwargs)
    
    def get(self, request):
        if request.user.is_authenticated:
            notebook = Notebook.objects.select_related('subject__page').get(user=request.user)
            
            for subject in notebook.subject:
                print(subject.name)

        else:
            response = {
                'last_subject': '-1',
                'subjects': {
                    '-1': {
                        'name': 'New subject',
                        'last_page': '0',
                        'pages': [
                            {
                                'id': '-1',
                                'content': '<p><br></p>'
                            }
                        ]
                    }
                }
            }
        return JsonResponse(response, status=200)
    
    def post(self, request):
        
        new_content = json.loads(request.body)
        
        new_content = {
            'subjects': {
                'new': [
                    {
                        'type': 'subject',
                        'fields': {
                            'id': '-1',
                            'name': 'nova matéria'
                        }
                    },
                ]
            },
            'pages': {
                'new': [
                    {
                        'type': 'subject',
                        'fields': {
                            'id': '-1',
                            'number': '0',
                            'content': '<p>oiiiiiii</p>',
                            'subject': '-1'
                        }
                    },
                ],
            }
        }
        
        