"""
URL configuration for filenexus_django project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path
from accounts import views
from accounts.views import RegisterView, LoginView, ActivateAccountView, PasswordResetView, ChangePasswordView, PasswordResetConfirmView, upload_file, PresignedUrlView, FolderCreate, FolderList, FolderDeleteView, FolderFilesList, AddFilesToFolderView, get_total_storage, FileList, FileDetail, FolderDetail, FileSearch, StreamFileFromS3View, DeleteAccount, ShareFileView, OpenFileView, LastOpenedFilesView, ChangeUsernameView, NotificationDetailView, NotificationListView, ShareFolderView


urlpatterns = [
    path('admin/', admin.site.urls),
    path('register/', RegisterView.as_view(), name='register'),
    path('activate/<str:uidb64>/<str:token>/', ActivateAccountView.as_view(), name='activate'),
    path('login/', LoginView.as_view(), name='login'),
    path('reset_password/', views.PasswordResetView.as_view(),
    name='reset_password'),
    path('change-password/confirm/<str:uidb64>/<str:token>/', PasswordResetConfirmView.as_view(), name='change-password-confirm'),
    path('delete_account/<str:email>/', DeleteAccount.as_view(), name='delete_account'),
    path('change_username/', ChangeUsernameView.as_view(), name='change_username'),
    path('upload_file/', upload_file, name='upload_file'),
    path('files/', FileList.as_view(), name='file_list'),
    path('files/<int:id>/', FileDetail.as_view(), name='detail'),
    path('files/share/', ShareFileView.as_view(), name='share_file'),
    path('files/search/', FileSearch.as_view(), name='file-search'),
    path('open_file/', LastOpenedFilesView.as_view(), name='last_opened_files'),
    path('open_file/<int:file_id>/', OpenFileView.as_view(), name='open_file'),
    path('get_presigned_url/<int:id>/', PresignedUrlView.as_view(), name='get_presigned_url'),
    path('files/download/<int:id>/', StreamFileFromS3View.as_view(), name='file-download'),
    path('notifications/', NotificationListView.as_view(), name='notification-list'),
    path('notifications/<int:pk>/', NotificationDetailView.as_view(), name='notification-detail'),
    path('total_storage/', get_total_storage, name='total_storage'),
    path('folders/', FolderCreate.as_view(), name='folder_create'),
    path('folders/<int:pk>/', FolderDetail.as_view(), name='folder-detail'),
    path('folders/list/', FolderList.as_view(), name='folder_list'),
    path('folders/<int:pk>/delete/', FolderDeleteView.as_view(), name='folder_delete'),
    path('folders/<int:folder_id>/files/', FolderFilesList.as_view(), name='folder_files_list'),
    path('folders/<int:folder_id>/share/', ShareFolderView.as_view(), name='share_folder'),
    path('folders/<int:folder_id>/addfiles/', AddFilesToFolderView.as_view(), name='add_files_to_folder'),
]
