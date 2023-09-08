from rest_framework import serializers
from .models import User, File, Folder, Notification
from accounts.utils import generate_presigned_url
from django.conf import settings


class FileSerializer(serializers.ModelSerializer):
    url = serializers.SerializerMethodField()
    shared_with = serializers.StringRelatedField(read_only=True)
    shared_from = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = File
        fields = ['id', 'name', 'folder', 'url', 'file_size', 'uploaded_at', 'shared_with', 'shared_from']

    def get_url(self, obj):
        return generate_presigned_url(settings.AWS_STORAGE_BUCKET_NAME, obj.s3_key)
    
class FileShareSerializer(serializers.Serializer):
    email = serializers.EmailField()
    file_ids = serializers.ListField(child=serializers.IntegerField())

    def validate_email(self, value):
        try:
            User.objects.get(email=value)
        except User.DoesNotExist:
            raise serializers.ValidationError('User with provided email does not exist.')
        return value
    
class FolderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Folder 
        fields = ['id', 'name']

class FolderShareSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        try:
            User.objects.get(email=value)
        except User.DoesNotExist:
            raise serializers.ValidationError("User wtih provided email does not exist.")
        return value

class NotificationSerializer(serializers.ModelSerializer):
    sender_username = serializers.ReadOnlyField(source='sender.username')
    receiver_username = serializers.ReadOnlyField(source='receiver.username')

    class Meta:
        model = Notification
        fields = ['id', 'sender_username', 'receiver_username', 'message', 'timestamp', 'is_read']