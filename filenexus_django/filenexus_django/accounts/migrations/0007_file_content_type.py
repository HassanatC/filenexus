# Generated by Django 4.2.3 on 2023-07-27 14:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0006_file_folder'),
    ]

    operations = [
        migrations.AddField(
            model_name='file',
            name='content_type',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]
