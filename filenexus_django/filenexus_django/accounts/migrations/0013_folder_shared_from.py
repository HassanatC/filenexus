# Generated by Django 4.2.3 on 2023-08-21 12:41

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0012_folder_shared_with'),
    ]

    operations = [
        migrations.AddField(
            model_name='folder',
            name='shared_from',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='accounts.folder'),
        ),
    ]
