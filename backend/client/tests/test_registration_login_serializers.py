from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework.exceptions import ValidationError
from client.serializers import RegistrationSerializer, LoginSerializer
from client.models import Notebook

UserModel = get_user_model()

class RegistrationSerializerTest(TestCase):
    def setUp(self):
        self.data = {'username': 'testuser', 'email': 'testuser@example.com', 'password': 'password123'}

    def test_registration_serializer_creates_user_and_notebook(self):
        # Test that RegistrationSerializer creates a user with the provided data
        serializer = RegistrationSerializer(data=self.data)
        self.assertTrue(serializer.is_valid())
        user = serializer.save()
        self.assertEqual(user.username, self.data['username'])
        self.assertEqual(user.email, self.data['email'])
        self.assertTrue(user.check_password(self.data['password']))
        notebook = user.notebook
        self.assertIsNotNone(notebook)
        self.assertEqual(notebook.user, user)

    def test_registration_serializer_duplicate_user(self):
        # Test that creating a user with duplicate information raises an error
        serializer = RegistrationSerializer(data=self.data)
        self.assertTrue(serializer.is_valid())
        serializer.save()
        duplicate_user = RegistrationSerializer(data=self.data)
        self.assertFalse(duplicate_user.is_valid())
    
    def test_registration_serializer_create_notebook(self):
        # Test that creates a Notebook for the user
        user_serializer = RegistrationSerializer(data=self.data)
        self.assertTrue(user_serializer.is_valid())
        user = user_serializer.save()
        notebook = Notebook.objects.filter(user=user).first()
        self.assertIsNotNone(notebook)

class LoginSerializerTest(TestCase):
    def setUp(self):
        self.user = UserModel.objects.create_user(username='testuser', email='testuser@example.com', password='password123')

    def test_login_serializer_valid_credentials_username(self):
        # Test that LoginSerializer authenticates user with username and password
        data = {'nameOrEmail': 'testuser', 'password': 'password123'}
        serializer = LoginSerializer(data=data)
        serializer.context['request'] = None
        self.assertTrue(serializer.is_valid())
        user = serializer.validated_data['user']
        self.assertEqual(user, self.user)

    def test_login_serializer_valid_credentials_email(self):
        # Test that LoginSerializer authenticates user with email and password
        data = {'nameOrEmail': 'testuser@example.com', 'password': 'password123'}
        serializer = LoginSerializer(data=data)
        serializer.context['request'] = None
        self.assertTrue(serializer.is_valid())
        user = serializer.validated_data['user']
        self.assertEqual(user, self.user)

    def test_login_serializer_invalid_credentials(self):
        # Test that LoginSerializer raises an error with invalid credentials
        data = {'nameOrEmail': 'testuser', 'password': 'wrongpassword'}
        serializer = LoginSerializer(data=data)
        serializer.context['request'] = None
        with self.assertRaises(ValidationError) as context:
            serializer.is_valid(raise_exception=True)
            self.assertIn('Unable to log in with provided credentials.', str(context.exception.detail))
