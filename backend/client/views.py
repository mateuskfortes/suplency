from django.shortcuts import render
from django.http import HttpResponse

def teste(request):
    return render(request, 'index.html')