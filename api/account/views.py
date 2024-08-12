from django.contrib.auth import login, logout
from django.shortcuts import render, redirect
from django.urls import reverse

from account.forms import CreateAccount, LoginAccount

def singUpView(request):
    if request.user.is_authenticated:
        return redirect(reverse('study'))
    elif request.method == 'POST':
        form = CreateAccount(request.POST)
        if form.is_valid():
            form.save_and_login(request)
            return redirect(reverse('study'))
    else:
        form = CreateAccount()
    return render(request, 'sing-up.html', {'form': form})

def singInView(request):
    if request.user.is_authenticated:
        return redirect(reverse('study'))
    elif request.method == 'POST':
        form = LoginAccount(request, data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            return redirect(reverse('study'))
    form = LoginAccount()
    return render(request, 'sing-in.html', {'form': form})

def logOutView(request):
    logout(request)
    return render(request, 'logout.html')