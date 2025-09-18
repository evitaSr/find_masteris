from rest_framework import serializers
from api.models import Category, Service, User, Handyman, JobEntry, Review


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['pk', 'title', ]


class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ['pk', 'title', 'category', ]


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['pk', 'username', 'password', 'email', 'is_admin', 'is_active', 'created_on', ]
        extra_kwargs = {'password': {'write_only': True}}


class HandymanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Handyman
        fields = ['pk', 'username', 'password', 'email', 'is_admin', 'is_active', 'created_on', 'first_name',
                  'last_name', 'contact_email', 'phone_no', 'website', ]
        extra_kwargs = {
            'password': {'write_only': True},
        }


class JobEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = JobEntry
        fields = ['pk', 'title', 'description', 'service', 'handyman',]

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['pk', 'rating', 'description', 'created_on', 'handyman', 'service', 'client',]