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


class JobEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = JobEntry
        fields = ['pk', 'title', 'description', 'service', 'handyman',]
        read_only_fields = ['service', 'handyman']

    def create(self, validated_data):
        handyman = self.context['handyman']
        service = self.context['service']
        return JobEntry.objects.create(
            handyman=handyman,
            service=service,
            **validated_data
        )

    def update(self, instance, validated_data):
        instance.title = validated_data.get('title', instance.title)
        instance.description = validated_data.get('description', instance.description)
        instance.save()
        return instance



class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['pk', 'rating', 'description', 'created_on', 'handyman', 'service', 'client',]
        read_only_fields = ['handyman', 'service',]

    def create(self, validated_data):
        handyman = self.context['handyman']
        service = self.context['service']
        return Review.objects.create(
            handyman=handyman,
            service=service,
            **validated_data,
        )