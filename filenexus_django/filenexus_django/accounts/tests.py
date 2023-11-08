<<<<<<< HEAD
from django.test import TestCase

# Create your tests here.
<<<<<<< HEAD
=======

class FileUploadTest(APITestCase):

    def setUp(self):
        
        self.user = get_user_model().objects.create_user(
            username='testuser10',
            password='testpassword10',
            email='testuser10@email.com'
        )
        self.user.is_active = True
        self.user.save()
        
      
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token.key}')
        
    def test_file_upload(self):
        file = SimpleUploadedFile("testfile.txt", b"file_content", content_type="text/plain")
        
        response = self.client.post(reverse('upload_file'), {'file': file}, format='multipart')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        self.assertTrue(File.objects.filter(name="testfile.txt").exists())
        

    def tearDown(self):
        File.objects.filter(name="testfile.txt").delete()
>>>>>>> 8025531 (final updates)
=======
from django.test import TestCase
from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from rest_framework.authtoken.models import Token
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework.authtoken.models import Token
from .models import File

# Create your tests here.

class FileUploadTest(APITestCase):

    def setUp(self):
        
        self.user = get_user_model().objects.create_user(
            username='testuser10',
            password='testpassword10',
            email='testuser10@email.com'
        )
        self.user.is_active = True
        self.user.save()
      
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token.key}')
        
    def test_file_upload(self):
        file = SimpleUploadedFile("testfile.txt", b"file_content", content_type="text/plain")
        
        response = self.client.post(reverse('upload_file'), {'file': file}, format='multipart')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        self.assertTrue(File.objects.filter(name="testfile.txt").exists())
        

    def tearDown(self):
        File.objects.filter(name="testfile.txt").delete()
>>>>>>> e13af47 (cleanup)
