# Generated by Django 2.1.5 on 2019-03-20 00:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('server', '0002_companyinvite'),
    ]

    operations = [
        migrations.AlterField(
            model_name='companyinvite',
            name='invite_key',
            field=models.CharField(max_length=256, unique=True),
        ),
    ]