# Generated by Django 4.2.3 on 2023-08-29 09:39

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0013_folder_shared_from'),
    ]

    operations = [
        migrations.DeleteModel(
            name='Note',
        ),
    ]