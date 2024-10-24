from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth import get_user_model
from django.utils.translation import gettext_lazy as _

UserModel = get_user_model()

class RegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = UserModel
        fields = ('username', 'email', 'password')

    def create(self, validated_data):
        user = UserModel.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
        )
        return user

class LoginSerializer(serializers.Serializer):
    nameOrEmail = serializers.CharField(max_length=255)
    password = serializers.CharField(
        label=_("Password"),
        trim_whitespace=False,
        max_length=128,
        write_only=True
    )

    def validate(self, data):
        nameOrEmail = data.get('nameOrEmail')
        password = data.get('password')
        print(nameOrEmail, password)
        if nameOrEmail and password:
            user = authenticate(request=self.context.get('request'),
                                username=nameOrEmail, 
                                password=password)
            if not user:
                msg = _('Unable to log in with provided credentials.')
                raise serializers.ValidationError(msg, code='authorization')
        else:
            msg = _('Must include "username" and "password".')
            raise serializers.ValidationError(msg, code='authorization')
        data['user'] = user
        return data