# Generated by Django 4.2.3 on 2023-08-29 11:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0014_delete_note'),
    ]

    operations = [
        migrations.AddField(
            model_name='notification',
            name='note',
            field=models.TextField(blank=True, null=True),
        ),
    ]
