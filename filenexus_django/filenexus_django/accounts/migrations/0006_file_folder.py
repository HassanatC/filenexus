# Generated by Django 4.2.3 on 2023-07-24 10:13

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0005_folder'),
    ]

    operations = [
        migrations.AddField(
            model_name='file',
            name='folder',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='accounts.folder'),
        ),
    ]
