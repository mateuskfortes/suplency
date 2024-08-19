from django.test import TestCase
from django.test import Client

from account.models import User
from main_pages.models import Notebook, Subject, Page
from main_pages.serializers import SubjectSerializer

class SerializerTest(TestCase):
    def setUp(self):
        username = 'SerializerTest'
        email = 'SerializerTest@gmail.com'
        password = 'SerializerTestPassword'
        
        self.user = User.objects.create(username=username, email=email, password=password)
        self.notebook = Notebook.objects.create(user=self.user)
        data = [
            {
                'id': '-1',
                'name': 'teste1',
                'notebook': self.notebook.id,
            },
            {
                'id': '-2',
                'name': 'teste2',
                'notebook': self.notebook.id,
            }
        ]
        serializer = SubjectSerializer(data=data, many=True)
        self.new_subjects, self.id_map = None, None
        if serializer.is_valid():
            self.new_subjects, self.id_map = serializer.save()
        
        
    def test_create_many_subject(self):
        data = [
            {
                'id': '-1',
                'name': 'teste3',
                'notebook': self.notebook.id,
            },
            {
                'id': '-2',
                'name': 'teste4',
                'notebook': self.notebook.id,
            }
        ]
        serializer = SubjectSerializer(data=data, many=True)
        new_subjects, id_map = None, None
        if serializer.is_valid():
            new_subjects, id_map = serializer.save()
        
        saved_subjects = list(Subject.objects.filter(id__in=[i for i in id_map.values()]))
        saved_subjects.sort(key=lambda obj: obj.id)
        new_subjects.sort(key=lambda obj: obj.id)
        self.assertEqual(new_subjects, saved_subjects)
        
    def test_update_many_subject(self):
        data = [
            {
                'id': str(self.new_subjects[0].id),
                'name': 'other1',
            },
            {
                'id': str(self.new_subjects[1].id),
                'name': 'other2',
            },
        ]
        serializer = SubjectSerializer(self.new_subjects, data=data, many=True)
        if serializer.is_valid():
            serializer.save()
        
        self.assertEqual(Subject.objects.get(id=self.new_subjects[0].id).name, 'other1')
        self.assertEqual(Subject.objects.get(id=self.new_subjects[1].id).name, 'other2')
        