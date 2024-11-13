from rest_framework.test import APITestCase
from client.models import Pomodoro, User
from client.serializers import PomodoroSerializer
from datetime import timedelta
from django.urls import reverse
from rest_framework import status

class PomodoroSerializerTest(APITestCase):
    
    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="password")
        
    def test_update_pomodoro(self):
        data = {
            'focus_time': timedelta(minutes=25),
            'break_time': timedelta(minutes=5),
            'rest_time': timedelta(minutes=15),
            'focus_sessions': 4,
            'user': self.user
        }
        pomodoro = Pomodoro.objects.create(**data)
        
        updated_data = {
            'focus_time': '30:00',
            'break_time': '10:00',
            'rest_time': '20:00',
            'focus_sessions': 5
        }
        
        serializer = PomodoroSerializer(instance=pomodoro, data=updated_data, partial=True)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        updated_pomodoro = serializer.save()

        self.assertEqual(updated_pomodoro.focus_time, timedelta(minutes=30))
        self.assertEqual(updated_pomodoro.break_time, timedelta(minutes=10))
        self.assertEqual(updated_pomodoro.rest_time, timedelta(minutes=20))
        self.assertEqual(updated_pomodoro.focus_sessions, 5)

class PomodoroViewTest(APITestCase):
    
    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="password")
        self.pomodoro = Pomodoro.objects.create(
            user=self.user,
            focus_time=timedelta(minutes=25),
            break_time=timedelta(minutes=5),
            rest_time=timedelta(minutes=15),
            focus_sessions=4
        )
        self.client.force_authenticate(user=self.user)
        self.url = reverse('pomodoro')  

    def test_get_pomodoro(self):
        response = self.client.get(self.url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        expected_data = {
            'focus_time': '00:25:00',
            'break_time': '00:05:00',
            'rest_time': '00:15:00',
            'focus_sessions': 4
        }
        self.assertEqual(response.data, expected_data)

    def test_put_pomodoro(self):
        valid_data = {
            'focus_time': '0:30:00',
            'break_time': '0:10:00',
            'rest_time': '0:20:00',
            'focus_sessions': 5
        }
        
        response = self.client.put(self.url, data=valid_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        
        self.pomodoro.refresh_from_db()
        self.assertEqual(self.pomodoro.focus_time, timedelta(minutes=30))
        self.assertEqual(self.pomodoro.break_time, timedelta(minutes=10))
        self.assertEqual(self.pomodoro.rest_time, timedelta(minutes=20))
        self.assertEqual(self.pomodoro.focus_sessions, 5)

