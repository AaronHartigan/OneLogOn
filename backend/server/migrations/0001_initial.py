# Generated by Django 2.1.5 on 2019-02-21 18:05

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='CheckIns',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('visitor_id', models.IntegerField()),
                ('user_id', models.CharField(max_length=30)),
                ('check_in', models.DateTimeField()),
                ('check_out', models.DateTimeField()),
            ],
        ),
        migrations.CreateModel(
            name='CheckInVisitorReason',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('CheckIn_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='server.CheckIns')),
            ],
        ),
        migrations.CreateModel(
            name='Company',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('company_name', models.CharField(max_length=30)),
                ('company_address', models.CharField(max_length=50)),
                ('company_city', models.CharField(max_length=30)),
                ('company_zip', models.CharField(max_length=15)),
                ('company_state', models.CharField(max_length=2)),
            ],
        ),
        migrations.CreateModel(
            name='ListReasons',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('visit_reason', models.CharField(max_length=50)),
                ('company_sponsoring', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='server.Company')),
            ],
        ),
        migrations.CreateModel(
            name='Student',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('major', models.CharField(max_length=100)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
        ),
        migrations.CreateModel(
            name='TimeSheet',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('time_in', models.DateTimeField()),
                ('time_out', models.DateTimeField()),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='UserCompany',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('company_name', models.CharField(max_length=50)),
                ('company', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='server.Company')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='VisitorReason',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('visit_reason', models.CharField(max_length=30)),
                ('is_active', models.BooleanField(default=False)),
                ('company_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='server.Company')),
            ],
        ),
        migrations.CreateModel(
            name='Visitors',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('visitor_id', models.CharField(max_length=10)),
                ('first_name', models.CharField(max_length=30, null=True)),
                ('last_name', models.CharField(max_length=30, null=True)),
                ('is_employee', models.BooleanField(default=False)),
                ('waiver_signed', models.BooleanField(default=False)),
                ('company', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='server.Company', verbose_name='compamy ID')),
            ],
        ),
        migrations.AddField(
            model_name='checkinvisitorreason',
            name='visitor_reason_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='server.VisitorReason'),
        ),
        migrations.AddField(
            model_name='checkins',
            name='visit_reason',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='server.ListReasons'),
        ),
    ]
