from rest_framework.exceptions import ValidationError
from rest_framework import serializers
from django.test import TestCase
from client.models import User, Notebook, Subject
from client.serializers import SubjectSerializer

class SubjectSerializerTest(TestCase):

    def setUp(self):
        # Creates a user and a notebook for the tests
        self.user = User.objects.create_user(
            username='testuser',
            email='testuser@example.com',
            password='password1234'
        )
        self.notebook = Notebook.objects.create(user=self.user)

    def test_create_subject_valid(self):
        # Tests creating a Subject with valid data
        subject_data = {
            'name': 'Math',
            'color': 'Blue',
            'notebook': self.notebook.id
        }
        serializer = SubjectSerializer(data=subject_data)
        self.assertTrue(serializer.is_valid())
        

    def test_create_subject_with_default_values(self):
        # Tests creating a Subject with default values when name and color are not provided
        subject_data = {
            'notebook': self.notebook.id
        }
        serializer = SubjectSerializer(data=subject_data)
        self.assertTrue(serializer.is_valid())
        subject = serializer.save()
        self.assertEqual(subject.name, 'New subject')
        self.assertEqual(subject.color, 'white')
        self.assertEqual(subject.notebook, self.notebook)

    def test_update_subject(self):
        # Tests updating an existing Subject with partial data
        subject = Subject.objects.create(name="Math", color="Blue", notebook=self.notebook)
        updated_data = {
            'name': 'Physics',
            'color': 'Red'
        }
        serializer = SubjectSerializer(subject, data=updated_data, partial=True)
        self.assertTrue(serializer.is_valid())
        updated_subject = serializer.save()
        self.assertEqual(updated_subject.name, 'Physics')
        self.assertEqual(updated_subject.color, 'Red')

    def test_create_subject_invalid_data(self):
        # Tests creating a Subject with missing required field 'notebook'
        subject_data = {
            'name': 'Math',
            'color': 'Blue'
        }
        serializer = SubjectSerializer(data=subject_data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('notebook', serializer.errors)

    def test_create_subject_without_name(self):
        # Tests creating a Subject without the 'name' field, using the default value
        subject_data = {
            'color': 'Green',
            'notebook': self.notebook.id
        }
        serializer = SubjectSerializer(data=subject_data)
        self.assertTrue(serializer.is_valid())
        subject = serializer.save()
        self.assertEqual(subject.name, 'New subject')
        self.assertEqual(subject.color, 'Green')
        self.assertEqual(subject.notebook, self.notebook)
