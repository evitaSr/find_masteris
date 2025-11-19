import os
from decimal import Decimal

from django.contrib.auth.hashers import make_password
from django.db.models import Avg
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from api.models import Category, Service, FindMasterisUser, Handyman, JobEntry, Review, JobEntryFile, \
    RequestToAddCategory, \
    RequestToAddService


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['pk', 'title', ]


class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ['pk', 'title', 'category', ]
        read_only_fields = ['category', ]

    def create(self, validated_data):
        category = self.context['category']
        return Service.objects.create(category=category, **validated_data)


class PasswordHashingSerializer(serializers.ModelSerializer):
    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)

    def update(self, instance, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        return super().update(instance, validated_data)


class UserSerializer(PasswordHashingSerializer):
    date_joined = serializers.DateTimeField(format="%Y-%m-%d", read_only=True)

    class Meta:
        model = FindMasterisUser
        fields = ['pk', 'username', 'password', 'email', 'is_staff', 'is_active', 'date_joined', 'role']
        extra_kwargs = {'password': {'write_only': True}}


class HandymanSerializer(PasswordHashingSerializer):
    avg_rating = serializers.SerializerMethodField(read_only=True)
    date_joined = serializers.DateTimeField(format="%Y-%m-%d", read_only=True)

    class Meta:
        model = Handyman
        fields = ['pk', 'username', 'password', 'email', 'is_staff', 'is_active', 'date_joined', 'first_name',
                  'last_name', 'contact_email', 'phone_no', 'website', 'avg_rating', 'role']
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def get_avg_rating(self, obj):
        avg = obj.received_reviews.all().aggregate(avg_rating=Avg('rating'))['avg_rating']
        return round(avg if avg else Decimal(0), 1)

class JobFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobEntryFile
        fields = ['pk', 'file', 'uploaded_at']


class JobEntrySerializer(serializers.ModelSerializer):
    uploaded_files = serializers.ListSerializer(child=serializers.FileField(), write_only=True, required=False)
    files = JobFileSerializer(many=True, read_only=True)

    class Meta:
        model = JobEntry
        fields = ['pk', 'title', 'description', 'service', 'handyman', 'uploaded_files', 'files', ]
        read_only_fields = ['service', 'handyman']

    def create(self, validated_data):
        files = self.context.get('uploaded_files', [])
        handyman = self.context['handyman']
        service = self.context['service']
        job_entry = JobEntry.objects.create(handyman=handyman, service=service, **validated_data)

        for file in files:
            JobEntryFile.objects.create(job_entry=job_entry, file=file)
        return job_entry

    def update(self, instance, validated_data):
        instance.title = validated_data.get('title', instance.title)
        instance.description = validated_data.get('description', instance.description)
        instance.save()

        uploaded_files = list(self.context.get('uploaded_files', []))
        uploaded_file_names = [f.name for f in uploaded_files]

        for f in instance.files.all():
            if os.path.basename(f.file.name) not in uploaded_file_names:
                f.delete()

        existing_file_names = [os.path.basename(f.file.name) for f in instance.files.all()]
        for file in uploaded_files:
            if file.name in existing_file_names:
                continue
            instance.files.create(file=file)

        return instance


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['pk', 'rating', 'description', 'created_on', 'handyman', 'service', 'client', ]
        read_only_fields = ['handyman', 'service', ]

    def create(self, validated_data):
        handyman = self.context['handyman']
        service = self.context['service']
        return Review.objects.create(
            handyman=handyman,
            service=service,
            **validated_data,
        )


class RequestToAddCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = RequestToAddCategory
        fields = ['pk', 'requested_by', 'title', 'is_rejected', ]


class RequestToAddServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = RequestToAddService
        fields = ['pk', 'requested_by', 'title', 'category', 'is_rejected', ]


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['username'] = user.username
        token['role'] = user.role

        return token
