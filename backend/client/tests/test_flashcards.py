import uuid
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from client.serializers import FlashcardSerializer
from client.models import Notebook, Subject, Flashcard

User = get_user_model()

class FlashcardSerializerTest(APITestCase):
    
    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="password")
        self.notebook = Notebook.objects.create(user=self.user)
        self.subject1 = Subject.objects.create(notebook=self.notebook)
        self.subject2 = Subject.objects.create(notebook=self.notebook)
        
        data = {
            'user': self.user,
            'question': 'q',
            'answer': 'a',
        }
        self.flashcard = Flashcard.objects.create(**data)
        self.flashcard.subjects.add(self.subject1)
        
    def test_create_flashcard(self):
        data = {
            'user': self.user.id,
            'question': 'q',
            'answer': 'a', 
            'subjects': [self.subject1.id, self.subject2.id] 
        }
        flashcard_serializer = FlashcardSerializer(data=data)
        self.assertTrue(flashcard_serializer.is_valid(), flashcard_serializer.errors)
        flashcard = flashcard_serializer.save()
        self.assertEqual(flashcard.question, 'q')
        self.assertEqual(flashcard.answer, 'a')
        self.assertCountEqual(flashcard.subjects.all(), [self.subject1, self.subject2] )
    
    def test_create_flashcard_without_subject(self):
        data = {
            'user': self.user.id,
            'question': 'q',
            'answer': 'a',
        }
        flashcard_serializer = FlashcardSerializer(data=data)
        self.assertTrue(flashcard_serializer.is_valid(), flashcard_serializer.errors)
        flashcard = flashcard_serializer.save()
        self.assertEqual(flashcard.question, 'q')
        self.assertEqual(flashcard.answer, 'a')
        
    def test_update_flashcard_valid_data(self):
        updated_data = {
            'question': 'Updated question',
            'answer': 'Updated answer',
            'subjects': [self.subject2.id]
        }

        flashcard_serializer = FlashcardSerializer(instance=self.flashcard, data=updated_data, partial=True)
        self.assertTrue(flashcard_serializer.is_valid(), flashcard_serializer.errors)
        flashcard = flashcard_serializer.save()
        
        self.assertEqual(flashcard.question, 'Updated question')
        self.assertEqual(flashcard.answer, 'Updated answer')
        
        self.assertCountEqual(flashcard.subjects.all(), [self.subject2])
        
    def test_update_flashcard_invalid_data(self):
        invalid_data = {
            'question': '',
            'answer': '',
            'subjects': [self.subject1.id]
        }

        flashcard_serializer = FlashcardSerializer(self.flashcard, data=invalid_data, partial=True)
        self.assertFalse(flashcard_serializer.is_valid())
        
        self.assertIn('question', flashcard_serializer.errors)
        self.assertIn('answer', flashcard_serializer.errors)
        
class FlashcardViewTest(APITestCase):
    
    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="password")
        self.client.login(username="testuser", password="password")
        
        self.notebook = Notebook.objects.create(user=self.user)
        self.subject1 = Subject.objects.create(notebook=self.notebook, name='Subject 1')
        self.subject2 = Subject.objects.create(notebook=self.notebook, name='Subject 2')
        
        self.flashcard = Flashcard.objects.create(
            user=self.user,
            question="Initial question",
            answer="Initial answer"
        )
        self.flashcard.subjects.set([self.subject1, self.subject2])
        
        self.url = reverse('flashcard') 
    
    def test_get_flashcards(self):
        flashcard1 = Flashcard.objects.create(user=self.user, question="Q1", answer="A1")
        flashcard2 = Flashcard.objects.create(user=self.user, question="Q2", answer="A2")
        flashcard1.subjects.add(self.subject1)
        flashcard2.subjects.add(self.subject2)
        
        response = self.client.get(self.url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        expected_data = FlashcardSerializer([self.flashcard, flashcard1, flashcard2], many=True).data
        self.assertListEqual(list(response.data['flashcards']), list(expected_data))
    
    def test_create_flashcard_valid_data(self):
        data = {
            "question": "New Question",
            "answer": "New Answer",
            "subjects": [self.subject1.id, self.subject2.id]
        }
        
        response = self.client.post(self.url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        flashcard = Flashcard.objects.get(id=response.data['id'])
        self.assertEqual(flashcard.question, data['question'])
        self.assertEqual(flashcard.answer, data['answer'])
        self.assertCountEqual(flashcard.subjects.all(), [self.subject1, self.subject2])
    
    def test_create_flashcard_invalid_data(self):
        data = {
            "answer": "Answer without question",
            "subjects": [self.subject1.id]
        }
        
        response = self.client.post(self.url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
    def test_update_flashcard_valid_data(self):
        data = {
            "id": self.flashcard.id,
            "question": "Updated question",
            "answer": "Updated answer",
            "subjects": [self.subject1.id, self.subject2.id]
        }
        
        response = self.client.put(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        self.flashcard.refresh_from_db()
        self.assertEqual(self.flashcard.question, "Updated question")
        self.assertEqual(self.flashcard.answer, "Updated answer")
        self.assertCountEqual(list(self.flashcard.subjects.all()), [self.subject1, self.subject2])

    def test_update_flashcard_invalid_data(self):
        data = {
            "question": "a",
            "answer": "b",
            "subjects": []
        }
        
        response = self.client.put(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
    def test_delete_flashcard_valid_data(self):
        data = {"id": self.flashcard.id}
        response = self.client.delete(self.url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        
        self.assertFalse(Flashcard.objects.filter(id=self.flashcard.id).exists())

    def test_delete_flashcard_missing_id(self):
        response = self.client.delete(self.url, {}, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_delete_flashcard_nonexistent_id(self):
        data = {"id": uuid.uuid4()}  
        response = self.client.delete(self.url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
