from django.shortcuts import render
from botocore.exceptions import NoCredentialsError
from botocore.config import Config
from django.contrib.auth.models import User
from django.http import HttpResponse, JsonResponse, HttpResponseBadRequest, HttpResponseRedirect, StreamingHttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.password_validation import validate_password
from django.db.models import Sum, Q
from django.db import transaction
from django.contrib.auth import authenticate, login, get_user_model
from django.contrib.auth.hashers import check_password
from django.contrib.auth.models import User
from django.conf import settings
from django.core.exceptions import ValidationError
from django.core.mail import send_mail
from django.core.paginator import Paginator, EmptyPage
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.contrib.sites.shortcuts import get_current_site
from django.template.loader import render_to_string
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_bytes, force_str
from django.shortcuts import get_object_or_404
from django.core.mail import send_mail
from django.utils import timezone
from rest_framework import generics, status, views
from rest_framework.decorators import api_view, permission_classes
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from .models import File, Folder, Notification
from .serializers import FileSerializer, FolderSerializer, FileShareSerializer, NotificationSerializer, FolderShareSerializer
from .utils import generate_presigned_url
from math import ceil
import datetime
import time
import boto3
import json

# Create your views here.

class RegisterView(APIView):
    permission_classes = (AllowAny, )

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        email = request.data.get('email')

        errors = {}

        if not username:
            errors['username'] = 'This field is required.'

        if User.objects.filter(username=username).exists():
            errors['username'] = 'This username is already taken.'

        if User.objects.count() >= 100:
            return Response({
                'message': 'User limit reached. No new registrations are available now, unfortunately.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            validate_password(password)
        except ValidationError as e:
            errors['password'] = list(e.messages)

        if not email:
            errors['email'] = 'This field is required.'
        elif User.objects.filter(email=email).exists():
            errors['email'] = 'This email is already taken.'
        
        if errors:
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)
        

        user = User.objects.create_user(username, email, password, is_active=False)
        user.save()

        token = default_token_generator.make_token(user)
        uidb64 = urlsafe_base64_encode(force_bytes(user.pk))

        current_site = 'localhost:3000'
        mail_subject = 'Activate your FileNexus account.'

        message = render_to_string('activate_account.html', {
            'user': user,
            'domain': current_site,
            'uidb64': uidb64,
            'token': token,
        })

        send_mail(mail_subject, message, 'filenexus18@gmail.com', [email])

        return Response({
            'message': 'Registration successful. Please confirm your email address to complete the registration'
        }, status=status.HTTP_201_CREATED)

class ActivateAccountView(APIView):
    permission_classes = (AllowAny, )

    def get(self, request, uidb64, token):
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
            if default_token_generator.check_token(user, token):
                user.is_active = True
                user.save()
                return Response({'message': 'Thank you for your email confirmation'})
            else:
                 return Response({
                    'message': 'Activation link is invalid!'
                }, status=status.HTTP_400_BAD_REQUEST)
        except(TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response({
                'message': 'Activation link is invalid!'
            }, status=status.HTTP_400_BAD_REQUEST)     

class LoginView(APIView):
    permission_classes = (AllowAny, )

    def post(self, request):
        print(request.data)
        email = request.data.get('email')
        password = request.data.get('password')

        User = get_user_model()

        try:
            user = User.objects.get(email=email)
            user.refresh_from_db()
            print("User is_active status directly from DB:", user.is_active)
            print("User id:", user.id)
            print("User is active status:", user.is_active)
        except User.DoesNotExist:
            return Response({'error': 'Wrong Credentials'}, status=400)
        
        if user.check_password(password):
            print("Password check passed.")
            if user.is_active:
                token, _ = Token.objects.get_or_create(user=user)
                print("Token generated:", token.key) 
                return Response({'token': token.key, 'username': user.username})
            else:
                return Response({'error': 'Account is not activated'}, status=400)
        else:
            print("Password check failed.") 
            return Response({'error': 'Wrong Credentials'}, status=400)

class DeleteAccount(APIView):
    permission_classes = (IsAuthenticated, )

    def delete(self, request, email):
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return JsonResponse({'error': 'User does not exist'}, status=status.HTTP_404_NOT_FOUND)
        
        user.delete()
        return JsonResponse({'message': 'User deleted'}, status=status.HTTP_200_OK)

class PasswordResetView(APIView):
    permission_classes = (AllowAny, )

    def post(self, request):
    
        email = request.data.get('email')
        user = User.objects.filter(email=email).first()
        if user:
            token = default_token_generator.make_token(user)
            uidb64 = urlsafe_base64_encode(force_bytes(user.pk))

            current_site = 'localhost:3000'
            mail_subject = 'Reset your FileNexus password.'

            message = render_to_string('reset_password_email.html', {
                'user': user,
                'domain': current_site,
                'uidb64': uidb64,
                'token': token,
            })

            send_mail(mail_subject, message, 'filenexus18@gmail.com', [email])

            return Response({
                'message': 'Password reset email sent.'
            })

class PasswordResetConfirmView(APIView):
    permission_classes = (AllowAny, )

    def post(self, request, uidb64, token):
        print('Received request: ', request.data)
        
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)

            if not default_token_generator.check_token(user, token):
                return Response({
                    'message': 'Password reset link is invalid!'
                })
            
            new_password = request.data.get('new_password')
            user.set_password(new_password)
            user.save()

            return Response({
                'message': 'Password reset successful.'
            })
        except(TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response({
                'message': 'Password reset link is invalid!'
            }, status=status.HTTP_400_BAD_REQUEST)

class ChangePasswordView(APIView):
    permission_classes = (IsAuthenticated, )

    def post(self, request):
        new_password = request.data.get('new_password')

        if not new_password:
            return Response({'message': 'Please provide a new password.'}, status=400)
        
        user = request.user
            
        try:
            validate_password(new_password, user)
        except ValidationError as e:
            return Response({'message': str(e)}, status=400)
            
        user.set_password(new_password)
        user.save()

        return Response({'message': 'Password change successful.'})


class ChangeUsernameView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        new_username = request.data.get('new_username')

        if not new_username:
            return Response({'message': 'Please provide a new username in the box.'}, status=400)
        
        user = request.user
        user.username = new_username
        user.save()

        return Response({'message': 'Username change successful.'})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_file(request):

    file_obj = request.FILES['file']
    print(f"Received file: {file_obj}")
    s3 = boto3.client('s3', region_name='eu-west-2', aws_access_key_id=settings.AWS_ACCESS_KEY_ID, aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY, config=Config(signature_version='s3v4'))

    total_size = 0

    try:
        response = s3.list_objects_v2(Bucket=settings.AWS_STORAGE_BUCKET_NAME)

        if 'Contents' in response:
            for item in response['Contents']:
                corresponding_file = File.objects.filter(s3_key=item['Key'], user=request.user).first()

                if corresponding_file:
                    total_size += item['Size']

        if total_size + file_obj.size > 10 * (1024 ** 3):
            return HttpResponseBadRequest('Total file size exceeds the limit of your storage.')
            
        unique_filename = f"{int(time.time())}_{file_obj.name}"

        s3.upload_fileobj(file_obj, settings.AWS_STORAGE_BUCKET_NAME, unique_filename, 
                          ExtraArgs={'ContentType': file_obj.
                                     content_type,
                                     'ContentDisposition': 'inline'
                                     })

        print(f"File {unique_filename} uploaded to S3")

        file = File(user=request.user, name=file_obj.name, s3_key=unique_filename, file_size=file_obj.size)
        
        print(f"File object before saving: {file}") 

        file.save()

        print(f"File object after saving: {file}") 

        return Response({"message": "File uploaded successfully."})
    

    except NoCredentialsError:
        return HttpResponseBadRequest('AWS credentials not available.')
    except Exception as e:
        print(f"Error occurred: {str(e)}")
        return Response({"error": str(e)})

class FileList(generics.ListCreateAPIView):
    serializer_class = FileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        page = self.request.query_params.get('page', 1)
        page_size = self.request.query_params.get('page_size', 10)
        sort_field = self.request.query_params.get('sort_field', None)
        sort_direction = self.request.query_params.get('sort_direction', 'asc')
        files = File.objects.filter(Q(user=self.request.user) | Q(shared_with=self.request.user))

        if sort_field and sort_field in ['name', 'file_size', 'uploaded_at']:
            if sort_direction == 'desc':
                files = files.order_by('-' + sort_field)
            else:
                files = files.order_by(sort_field)

        paginator = Paginator(files, page_size)
        try:
            files = paginator.page(page)
        except EmptyPage:
            files = paginator.page(paginator.num_pages)
        return files
    
    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)

        if page is not None:
            serializer = self.get_serializer(page, many=True)
            paginator = Paginator(queryset, self.request.query_params.get('page_size', 10))
            return self.get_paginated_response({
                'results': serializer.data,
                'total_pages': paginator.num_pages
            })
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class FileDetail(generics.RetrieveUpdateDestroyAPIView):
    lookup_field = 'id'
    serializer_class = FileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return File.objects.filter(Q(user=self.request.user) | Q(shared_with=self.request.user))
    
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)
    
    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        s3_key = instance.s3_key

        other_instances = File.objects.filter(s3_key=s3_key).exclude(id=instance.id)

        if not other_instances.exists():
            s3 = boto3.client('s3', region_name='eu-west-2', aws_access_key_id=settings.AWS_ACCESS_KEY_ID, aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY, config=Config(signature_version='s3v4'))
            try:
                s3.delete_object(Bucket=settings.AWS_STORAGE_BUCKET_NAME, Key=s3_key)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
            
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

class FileSearch(generics.ListAPIView):
    serializer_class = FileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = File.objects.filter(Q(user=self.request.user) | Q(shared_with=self.request.user))
        query = self.request.query_params.get('q', None)

        if query is not None:
            queryset = queryset.filter(Q(name__icontains=query))

        return queryset

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_total_storage(request):
    max_storage_gb = 10
    total_size = File.objects.filter(user=request.user).aggregate(total=Sum('file_size'))['total'] or 0
    total_size_gb = total_size / (1024 ** 3)

    storage_percentage = (total_size_gb / max_storage_gb) * 100
    storage_percentage = ceil(storage_percentage)
    
    return Response({
        "total_size_gb": total_size_gb,
        "storage_percentage": storage_percentage,
    })

class PresignedUrlView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, id, format=None):
        file = get_object_or_404(File, id=id)
        presigned_url = generate_presigned_url(bucket_name=settings.AWS_STORAGE_BUCKET_NAME, object_name=file.s3_key)

        return Response({"presigned_url": presigned_url})


class ShareFileView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        serializer = FileShareSerializer(data=request.data)

        if serializer.is_valid():
            email = serializer.validated_data['email']
            recipient = User.objects.get(email=email)
            file_ids = serializer.validated_data['file_ids']
            note = request.data.get('note', '')

            success_files= []
            failed_files = []
            file_names = []

            with transaction.atomic():
                for file_id in file_ids:
                    try:
                        original_file = File.objects.get(id=file_id, user=request.user)
                        file_names.append(original_file.name)

                        shared_file = File(
                            user=recipient,
                            name=original_file.name,
                            file_size=original_file.file_size,
                            uploaded_at=original_file.uploaded_at,
                            folder=original_file.folder,
                            s3_key=original_file.s3_key,
                            content_type=original_file.content_type,
                            shared_from=original_file
                        )
                        shared_file.save()
                        success_files.append(file_id)
                    except Exception as e:
                        failed_files.append((file_id, str(e)))

            if len(file_names) == 1:
                notification_message = f"{file_names[0]} was shared with you by {request.user.username}"
            elif len(file_names) <= 5:
                joined_names = ", ".join(file_names)
                notification_message = f"{joined_names} were shared with you by {request.user.username}"
            else:
                joined_names = ", ".join(file_names[:5])
                notification_message = f"{joined_names}, and more were shared with you by {request.user.username}"
                
            if note:
                notification_message += f"\nNote Attached: {note}"

            notification = Notification(
                receiver=recipient,
                sender=request.user,
                message=notification_message,
                note=note
            )
            
            notification.save()

            response_message = "Files shared successfully." if not failed_files else "Some files were not shared."
            return Response({"message": response_message,
                             "success_files": success_files,
                             "failed_files": failed_files
                             })
        
        return Response(serializer.errors, status=400)  

class NotificationListView(generics.ListCreateAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(receiver=self.request.user)
    
class NotificationDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(receiver=self.request.user)

class StreamFileFromS3View(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, id, format=None):

        s3 = boto3.client('s3', region_name='eu-west-2', aws_access_key_id=settings.AWS_ACCESS_KEY_ID, aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY, config=Config(signature_version='s3v4'))

        file = get_object_or_404(File, id=id)
        s3_object = s3.get_object(Bucket=settings.AWS_STORAGE_BUCKET_NAME, Key=file.s3_key)

        def generate():
            for chunk in s3_object['Body'].iter_chunks(chunk_size=1024*1024):
                yield chunk

        response = StreamingHttpResponse(generate(), content_type=file.content_type)
        response['Content-Disposition'] = 'attachment; filename="%s"' % file.name

        return response
    
class OpenFileView(APIView):
    permission_classes = (IsAuthenticated,)
    
    def patch(self, request, file_id, format=None):
        file = get_object_or_404(File, pk=file_id)
        if not request.user == file.user:
            return Response(status=status.HTTP_403_FORBIDDEN)
        
        file.last_opened_file = timezone.now()
        file.save()
        serializer = FileSerializer(file)
        return Response(serializer.data)

class LastOpenedFilesView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, format=None):
        last_opened_files = File.objects.filter(user=request.user).order_by('-last_opened_file')[:4]
        serializer = FileSerializer(last_opened_files, many=True)
        return Response(serializer.data)

class FolderCreate(APIView):
    def post(self, request, format=None):
        serializer = FolderSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

class FolderList(generics.ListAPIView):
    serializer_class = FolderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Folder.objects.filter(Q(user=user) | Q(shared_with=user))
    
class FolderDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = FolderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Folder.objects.filter(user=self.request.user)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

class FolderDeleteView(views.APIView):
    def delete(self, request, pk):
        try:
            folder = Folder.objects.get(pk=pk, user=request.user)
            with transaction.atomic():
                files = File.objects.filter(folder=folder)
                for file in files:
                    s3_key = file.s3_key
                    other_instances = File.objects.filter(s3_key=s3_key).exclude(id=file.id)

                    if not other_instances.exists():
                        s3 = boto3.client('s3', region_name='eu-west-2', aws_access_key_id=settings.AWS_ACCESS_KEY_ID, aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY, config=Config(signature_version='s3v4'))
                        try:
                            s3.delete_object(Bucket=settings.AWS_STORAGE_BUCKET_NAME, Key=s3_key)
                        except Exception as e:
                            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

                    file.delete()

                folder.delete()

            return Response(status=status.HTTP_204_NO_CONTENT)
        
        except Folder.DoesNotExist:
            return Response({"error": "Folder not Found"}, status=status.HTTP_404_NOT_FOUND)

        
class FolderFilesList(generics.ListAPIView):
    serializer_class = FileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        folder_id = self.kwargs['folder_id']
        return File.objects.filter(folder_id=folder_id)
    
class AddFilesToFolderView(views.APIView):
    def put(self, request, folder_id):
        file_ids = request.data.get('file_ids')
        files = File.objects.filter(id__in=file_ids, user=request.user)
        if not files:
            return Response({"error": "No files found"}, status=status.HTTP_404_NOT_FOUND)
        folder = Folder.objects.get(pk=folder_id, user=request.user)
        if not folder:
            return Response({"error": "Folder not found"}, status=status.HTTP_404_NOT_FOUND) 

        files.update(folder=folder)
        return Response(status=status.HTTP_200_OK)


class ShareFolderView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, folder_id, format=None):
        serializer = FolderShareSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            recipient = User.objects.get(email=email)

            original_folder = Folder.objects.get(id=folder_id, user=request.user)

            shared_folder = Folder(
                user=recipient,
                name=original_folder.name,
                shared_from=original_folder
            )
            shared_folder.save()

            original_files = File.objects.filter(folder=original_folder)

            for original_file in original_files:
                shared_file = File(
                    user=recipient,
                    name=original_file.name,
                    file_size = original_file.file_size,
                    uploaded_at = original_file.uploaded_at,
                    folder=shared_folder,
                    s3_key = original_file.s3_key,
                    content_type=original_file.content_type,
                    shared_from=original_file
                )
                shared_file.save()

            notification_message = f"A folder was shared with you by {request.user.username}"
            notification = Notification(
                receiver=recipient,
                sender=request.user,
                message=notification_message
            )
            
            notification.save()

            return Response({'message': 'Folder shared successfully'}, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

