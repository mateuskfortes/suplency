from django.test import TestCase
from client.models import User, Notebook, Subject, Page
from client.serializers import NotebookSerializer, SubjectSerializer, PageSerializer

class NotebookSerializerTest(TestCase):
    
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='testuser@example.com',
            password='password1234'
        )
        self.notebook = Notebook.objects.create(user=self.user)
        self.subject = Subject.objects.create(notebook=self.notebook)
        self.new_subject = Subject.objects.create(notebook=self.notebook)
        
    def test_change_last_subject(self):
        # test changing the last subject field in notebook
        serializer = NotebookSerializer(instance=self.notebook, data={'last_subject':self.subject.id})
        self.assertTrue(serializer.is_valid(), serializer.errors)
        notebook = serializer.save()
        self.assertEqual(notebook.last_subject, self.subject)
        
        serializer = NotebookSerializer(instance=self.notebook, data={'last_subject':self.new_subject.id})
        self.assertTrue(serializer.is_valid(), serializer.errors)
        notebook = serializer.save()
        self.assertEqual(notebook.last_subject, self.new_subject)

class SubjectSerializerTest(TestCase):

    def setUp(self):
        # Creates a user and a notebook for the tests
        self.user = User.objects.create_user(
            username='testuser',
            email='testuser@example.com',
            password='password1234'
        )
        self.notebook = Notebook.objects.create(user=self.user)

    def test_create_subject_with_valid_data(self):
        # Dados válidos para criar um Subject
        subject_data = {
            'name': 'Math',
            'color': 'Blue',
            'notebook': self.notebook.id,
        }
        serializer = SubjectSerializer(data=subject_data)
        self.assertTrue(serializer.is_valid())
        subject, _ = serializer.save()
        self.assertEqual(subject.name, 'Math')
        self.assertEqual(subject.color, 'Blue')
        self.assertEqual(subject.notebook, self.notebook)
        
        # test the last subject 
        self.assertEqual(Notebook.objects.get(id=self.notebook.id).last_subject, subject)

    def test_create_subject_with_default_values(self):
        # Tests creating a Subject with default values when name and color are not provided
        subject_data = {
            'notebook': self.notebook.id
        }
        serializer = SubjectSerializer(data=subject_data)
        self.assertTrue(serializer.is_valid())
        subject, _ = serializer.save()
        self.assertEqual(subject.name, 'New subject')
        self.assertEqual(subject.color, 'white')
        self.assertEqual(subject.notebook, self.notebook)

    def test_update_subject(self):
        # Tests updating an existing Subject with partial data
        subject = Subject.objects.create(name="Math", color="Blue", notebook=self.notebook)
        page = Page.objects.create(number=1, subject=subject)
        updated_data = {
            'name': 'Physics',
            'color': 'Red',
            'last_page': page.id
        }
        serializer = SubjectSerializer(subject, data=updated_data, partial=True)
        self.assertTrue(serializer.is_valid())
        updated_subject = serializer.save()
        self.assertEqual(updated_subject.name, 'Physics')
        self.assertEqual(updated_subject.color, 'Red')
        self.assertEqual(updated_subject.last_page, page)

    def test_create_subject_with_invalid_data(self):
        # Tests creating a Subject with missing required field 'notebook'
        subject_data = {
            'name': 'Math',
            'color': 'Blue'
        }
        serializer = SubjectSerializer(data=subject_data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('notebook', serializer.errors)

class PageSerializerTest(TestCase):
    def setUp(self):
        # Creating an user, notebook and subject for the tests 
        self.user = User.objects.create_user(username="testuser", password="testpass")
        self.notebook = Notebook.objects.create(user=self.user)
        self.subject = Subject.objects.create(name="Test Subject", notebook=self.notebook)

        # Creating pages
        self.page0 = Page.objects.create(subject=self.subject, number=0, color="red", content={"text": "Page 1"})
        self.page1 = Page.objects.create(subject=self.subject, number=1, color="blue", content={"text": "Page 2"})
        self.page2 = Page.objects.create(subject=self.subject, number=2, color="green", content={"text": "Page 3"})
        self.page3 = Page.objects.create(subject=self.subject, number=3, color="purple", content={"text": "Page 4"})
        self.page4 = Page.objects.create(subject=self.subject, number=4, color="gray", content={"text": "Page 5"})

    def test_create_page_and_reorder(self):
        # Data to create a new page
        new_page_data = {
            "number": 1,
            "color": "yellow",
            "content": {"text": "New Page 2"},
            "subject": self.subject.id
        }
        
        # Serialize and save the new page
        serializer = PageSerializer(data=new_page_data)
        self.assertTrue(serializer.is_valid())
        new_page = serializer.save()

        # check the pages position
        self.assertEqual(Page.objects.get(id=self.page0.id).number, 0)
        self.assertEqual(Page.objects.get(id=new_page.id).number, 1)  
        self.assertEqual(Page.objects.get(id=self.page1.id).number, 2)  
        self.assertEqual(Page.objects.get(id=self.page2.id).number, 3)
        self.assertEqual(Page.objects.get(id=self.page3.id).number, 4)  
        self.assertEqual(Page.objects.get(id=self.page4.id).number, 5)  

    # Test updating the page content and color
    def test_update_page(self):
        update_data = {
            "color": "purple",
            "content": {"text": "Updated Page 1"}
        }
        
        serializer = PageSerializer(instance=self.page0, data=update_data, partial=True)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        updated_page = serializer.save()
        
        self.assertEqual(updated_page.color, "purple")
        self.assertEqual(updated_page.content, {"text": "Updated Page 1"})

    # Test create a new paga in the last position
    def test_create_page_at_end(self):
        new_page_data = {
            "number": 5,
            "color": "black",
            "content": {"text": "Page 4"},
            "subject": self.subject.id
        }
        
        serializer = PageSerializer(data=new_page_data)
        self.assertTrue(serializer.is_valid())
        new_page = serializer.save()

        self.assertEqual(Page.objects.get(id=self.page0.id).number, 0)  
        self.assertEqual(Page.objects.get(id=self.page1.id).number, 1)  
        self.assertEqual(Page.objects.get(id=self.page2.id).number, 2)  
        self.assertEqual(Page.objects.get(id=self.page3.id).number, 3)  
        self.assertEqual(Page.objects.get(id=self.page4.id).number, 4) 
        self.assertEqual(Page.objects.get(id=new_page.id).number, 5)
    
    # Test that updates the other pages position
    def test_update_page_position(self):
        
        # Update page position from 1 to 3
        serializer = PageSerializer(instance=self.page1, data={'number': 3}, partial=True)
        self.assertTrue(serializer.is_valid())
        serializer.save()
        
        self.assertEqual(Page.objects.get(id=self.page0.id).number, 0)  
        self.assertEqual(Page.objects.get(id=self.page1.id).number, 3)  
        self.assertEqual(Page.objects.get(id=self.page2.id).number, 1)  
        self.assertEqual(Page.objects.get(id=self.page3.id).number, 2)  
        self.assertEqual(Page.objects.get(id=self.page4.id).number, 4) 
        
        # Update page position from 3 to 1
        serializer = PageSerializer(instance=self.page1, data={'number': 1}, partial=True)
        self.assertTrue(serializer.is_valid())
        serializer.save()
        
        self.assertEqual(Page.objects.get(id=self.page0.id).number, 0)  
        self.assertEqual(Page.objects.get(id=self.page1.id).number, 1)  
        self.assertEqual(Page.objects.get(id=self.page2.id).number, 2)  
        self.assertEqual(Page.objects.get(id=self.page3.id).number, 3)  
        self.assertEqual(Page.objects.get(id=self.page4.id).number, 4) 
        