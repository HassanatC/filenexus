from django.db import models
from django.contrib.auth.models import User
# Create your models here.

class Folder(models.Model):
    name = models.CharField(max_length=255)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    shared_with = models.ManyToManyField(User, related_name='shared_folders', blank=True)
    shared_from = models.ForeignKey('self', null=True, blank=True, on_delete=models.SET_NULL)
    
class File(models.Model):
    user = models.ForeignKey(User, related_name='owned_files', on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    file_size = models.BigIntegerField(null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    folder = models.ForeignKey(Folder, on_delete=models.SET_NULL, null=True, blank=True)
    s3_key = models.CharField(max_length=255)
    content_type = models.CharField(max_length=255, null=True, blank=True)
    shared_with = models.ForeignKey(User, related_name='shared_files', null=True, blank=True, on_delete=models.SET_NULL)
    shared_from = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True)
    last_opened_file = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.name
    
class Notification(models.Model):
    receiver = models.ForeignKey(User, related_name='received_notifications', on_delete=models.CASCADE)
    sender = models.ForeignKey(User, related_name='sent_notifications', null=True, blank=True, on_delete=models.SET_NULL)
    message = models.CharField(max_length=255)
    timestamp = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)
    note = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.message