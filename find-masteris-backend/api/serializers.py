import os

from rest_framework import serializers
from api.models import Category, Service, User, Handyman, JobEntry, Review, JobEntryFile


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


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['pk', 'username', 'password', 'email', 'is_staff', 'is_active', 'date_joined', ]
        extra_kwargs = {'password': {'write_only': True}}


class HandymanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Handyman
        fields = ['pk', 'username', 'password', 'email', 'is_staff', 'is_active', 'date_joined', 'first_name',
                  'last_name', 'contact_email', 'phone_no', 'website', ]
        extra_kwargs = {
            'password': {'write_only': True},
        }


class JobFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobEntryFile
        fields = ['pk', 'file', 'uploaded_at']


class JobEntrySerializer(serializers.ModelSerializer):
    uploaded_files = serializers.ListSerializer(child=serializers.FileField(), write_only=True, required=False)
    files = JobFileSerializer(many=True, read_only=True)

    class Meta:
        model = JobEntry
        fields = ['pk', 'title', 'description', 'service', 'handyman', 'uploaded_files', 'files',]
        read_only_fields = ['service', 'handyman']

    def create(self, validated_data):
        files = self.context.get('uploaded_files', [])
        handyman = self.context['handyman']
        service = self.context['service']
        job_entry =  JobEntry.objects.create(handyman=handyman, service=service, **validated_data)

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
