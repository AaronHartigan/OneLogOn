# Generated by Django 2.1.5 on 2019-02-16 19:53

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Admin',
            fields=[
                ('company_name', models.CharField(max_length=50)),
                ('user_name', models.CharField(max_length=25, primary_key=True, serialize=False)),
                ('first_name', models.CharField(max_length=30)),
                ('last_name', models.CharField(max_length=30)),
                ('role', models.CharField(max_length=10)),
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
            name='SignIns',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('visitor_id', models.IntegerField()),
                ('user_id', models.CharField(max_length=30)),
                ('sign_in', models.DateTimeField()),
                ('sign_out', models.DateTimeField()),
            ],
        ),
        migrations.CreateModel(
            name='SignInVisitorReason',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('signin_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='server.SignIns')),
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
                ('is_Employee', models.BooleanField(default=False)),
                ('waiver_signed', models.BooleanField(default=False)),
                ('company_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='server.Company')),
            ],
        ),
        migrations.AddField(
            model_name='signinvisitorreason',
            name='visitor_reason_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='server.VisitorReason'),
        ),
        migrations.AddField(
            model_name='signins',
            name='visit_reason',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='server.Visitors'),
        ),
        migrations.AddField(
            model_name='admin',
            name='company_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='server.Company'),
        ),
    ]
