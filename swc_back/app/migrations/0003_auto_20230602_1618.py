# Generated by Django 3.2.19 on 2023-06-02 07:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0002_auto_20230602_1540'),
    ]

    operations = [
        migrations.AddField(
            model_name='detection',
            name='end_time',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='detection',
            name='start_time',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
