import os
from decimal import Decimal

from django.contrib.auth.hashers import make_password, check_password
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
        if 'password' in validated_data:
            validated_data['password'] = make_password(validated_data['password'])
        return super().update(instance, validated_data)


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=False)
    new_password = serializers.CharField(required=True)

    def validate(self, data):
        user = self.context['user']
        request = self.context['request']

        if request.auth.get('role') != 'admin':
            if 'old_password' not in data:
                raise serializers.ValidationError({"old_password": "Old password is required."})

            if not check_password(data['old_password'], user.password):
                raise serializers.ValidationError({"old_password": "Old password is incorrect."})

        return data

    def save(self, **kwargs):
        user = self.context['user']
        new_password = self.validated_data['new_password']

        user.password = make_password(new_password)
        user.save()
        return user


class UserSerializer(PasswordHashingSerializer):
    date_joined = serializers.DateTimeField(format="%Y-%m-%d", read_only=True)

    class Meta:
        model = FindMasterisUser
        fields = ['pk', 'first_name', 'last_name', 'username', 'password', 'email', 'is_active', 'date_joined', 'role']
        extra_kwargs = {'password': {'write_only': True}}


class HandymanSerializer(PasswordHashingSerializer):
    avg_rating = serializers.SerializerMethodField(read_only=True)
    total_count = serializers.SerializerMethodField(read_only=True)
    date_joined = serializers.DateTimeField(format="%Y-%m-%d", read_only=True)
    categories_and_services = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Handyman
        fields = ['pk', 'first_name', 'last_name', 'username', 'password', 'email', 'is_active', 'date_joined',
                  'contact_email', 'phone_no', 'website', 'avg_rating', 'total_count', 'role', 'categories_and_services']
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def get_avg_rating(self, obj):
        avg = obj.received_reviews.all().aggregate(avg_rating=Avg('rating'))['avg_rating']
        return round(avg if avg else Decimal(0), 1)

    def get_total_count(self, obj):
        return obj.received_reviews.all().count()

    def get_categories_and_services(self, obj):
        reviews_data = obj.review_set.select_related("service__category").values("service__id", "service__title",
                                                                "service__category__id",
                                                                "service__category__title").distinct()
        categories = {}
        for d in reviews_data:
            category_pk = d['service__category__id']
            category_title = d['service__category__title']
            service_pk = d['service__id']
            service_title = d['service__title']

            if category_pk not in categories:
                categories[category_pk] = {
                    'pk': category_pk,
                    'title': category_title,
                    'services': [{
                        'pk': service_pk,
                        'title': service_title
                    }],
                }
            else:
                categories[category_pk]['services'].append({
                    'pk': service_pk,
                    'title': service_title
                })

        return list(categories.values())

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

    def validate(self, attrs):
        attrs['uploaded_files'] = self.context.get('uploaded_files', [])
        return attrs

    def create(self, validated_data):
        files = validated_data.pop('uploaded_files', [])
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
    created_on = serializers.DateTimeField(format="%Y-%m-%d", read_only=True)
    client_full_title = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Review
        fields = ['pk', 'rating', 'description', 'created_on', 'handyman', 'service', 'client', 'client_full_title',]
        read_only_fields = ['handyman', 'service', ]

    def create(self, validated_data):
        handyman = self.context['handyman']
        service = self.context['service']
        return Review.objects.create(
            handyman=handyman,
            service=service,
            **validated_data,
        )

    def get_client_full_title(self, obj):
        client = obj.client
        return '%s %s' % (client.first_name, client.last_name) if client.first_name and client.last_name else client.username


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
