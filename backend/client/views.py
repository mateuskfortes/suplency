from django.shortcuts import render
from django.contrib.auth.views import LoginView
from django.views.generic import CreateView
from .forms import CreateAccount
from django.urls import reverse

def main (request):
    return render(request, 'index.html')

class CustomLoginView(LoginView):
    template_name = 'sing-in.html'
    
    def get_success_url(self):
        return reverse('main')

class SignUpView(CreateView):
    form_class = CreateAccount
    template_name = 'sing-up.html'
    success_url = 'account/sing-in/'