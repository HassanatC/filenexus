# Generated by Django 4.2.3 on 2023-07-20 11:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0002_file'),
    ]

    operations = [
        migrations.AlterField(
            model_name='file',
            name='uploaded_at',
            field=models.DateTimeField(auto_now_add=True),
        ),
    ]