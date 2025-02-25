import uuid
from django.urls import reverse
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from client.models import Subject, Page, Notebook
import json

User = get_user_model()

class NotebookViewTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="password")
        self.client.login(username="testuser", password="password")
        
        self.notebook = Notebook.objects.create(user=self.user)
        self.subject = Subject.objects.create(notebook=self.notebook, color='red', name='Subject test')
        self.page = Page.objects.create(subject=self.subject, color='green', number=0, content={'text': 'test'})
        
        self.notebook.last_subject = self.subject
        self.notebook.save()
        
        self.subject.last_page = self.page
        self.subject.save()
        
        self.url = reverse('notebook')
        
    def test_get_notebook_content(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        expected_data = {
            'last_subject': self.subject.id,
            'subject': [
                {
                    'id': str(self.subject.id),
                    'name': 'Subject test',
                    'color': 'red',
                    'last_page': self.page.id,
                    'page': [
                        {
                            'id': str(self.page.id),
                            'number': 0,
                            'color': 'green',
                            'content': {'text': 'test'},
                            'subject': self.subject.id,
                        }
                    ]
                }
            ]
        }
        self.assertEqual(response.data, expected_data)
    
    def test_update_notebook_last_subject(self):
        subject2 = Subject.objects.create(notebook=self.notebook, color='red', name='Subject test')
        
        response = self.client.put(self.url, data=json.dumps({'last_subject': str(subject2.id)}), content_type='application/json')
        
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.notebook.refresh_from_db()
        self.assertEqual(self.notebook.last_subject, subject2)
    

class SubjectViewTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="password")
        self.notebook = Notebook.objects.create(user=self.user)
        self.client.login(username="testuser", password="password")
        self.url = reverse('subject')
        
    def test_create_subject(self):
        response = self.client.post(self.url, data={'name': 'my subject'}, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Subject.objects.filter(id=response.data['subject_id']).exists())
        self.assertTrue(Page.objects.filter(id=response.data['page_id']).exists())
        
    def test_update_subject(self):
        subject = Subject.objects.create(notebook=self.notebook)
        
        response = self.client.put(self.url, data={'id': subject.id, 'name': 'update'}, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        subject.refresh_from_db()
        self.assertEqual(subject.name, 'update')
        
    def test_delete_subject(self):
        subject = Subject.objects.create(notebook=self.notebook)
        
        response = self.client.delete(self.url, data={'id': subject.id}, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Subject.objects.filter(id=subject.id).exists())
        
    def test_not_authenticated(self):
        self.client.logout()
        response = self.client.post(self.url, data={'name': 'my subject'}, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

class PageViewTest(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="password")
        self.notebook = Notebook.objects.create(user=self.user)
        self.subject = Subject.objects.create(notebook=self.notebook)
        self.client.login(username="testuser", password="password")
        self.url = reverse('page')

    def test_create_page_valid_data(self):
        data = {
            "number": 0,
            "color": "yellow",
            "content": {"text": "Content of the page"},
            "subject": self.subject.id
        }
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Page.objects.filter(id=response.data['id']).exists())

    def test_create_page_invalid_data(self):
        data = {
            "color": "yellow",
            "content": {"text": "Content without number"},
            "subject": self.subject.id
        }
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_update_page_valid_data(self):
        page = Page.objects.create(number=0, color="green", content={"text": "Original content"}, subject=self.subject)
        data = {
            'id': page.id,
            "content": {"text": "Updated content"}
        }
        response = self.client.put(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        
        page.refresh_from_db()
        self.assertEqual(page.number, 0)
        self.assertEqual(page.color, "green")
        self.assertEqual(page.content, {"text": "Updated content"})

    def test_update_page_invalid_data(self):
        data = {
            "number": -1,
            "color": "green"
        }
        response = self.client.put(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_delete_page_valid(self):
        page = Page.objects.create(number=0, color="white", content={"text": "To be deleted"}, subject=self.subject)
        response = self.client.delete(self.url, {'id': page.id})
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        
        self.assertFalse(Page.objects.filter(id=page.id).exists())

    def test_delete_page_invalid(self):
        data = {
            'id': uuid.uuid4()
        }
        response = self.client.delete(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
