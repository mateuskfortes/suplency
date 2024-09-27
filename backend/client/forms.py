
from django.contrib.auth.forms import UserCreationForm
from .models import User
from django import forms
class CreateAccount(UserCreationForm):
    class Meta:
        model = User
        fields = ['username', 'email', 'password1', 'password2']
        widgets = {
            'username': forms.TextInput(attrs={
                    'class': 'input',
                    'placeholder': 'Nome de usuário',
                }),
            'email': forms.EmailInput(attrs={
                    'class': 'input',
                    'placeholder': 'Email',
                }),
        }
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        password1 = self.fields['password1']
        password2 = self.fields['password2']
        
        password1.widget.attrs.update({
                'class': 'input',
                'placeholder': 'senha'
            })
        password1.label = 'Digite a Senha'
        password2.widget.attrs.update({
                'class': 'input',
                'placeholder': 'Repita a senha'
            })
        password2.label = 'Confirme a senha'