from django.core.exceptions import ObjectDoesNotExist
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from api.models import Category, Service, User, Handyman, JobEntry, Review
from api.serializers import CategorySerializer, ServiceSerializer, UserSerializer, HandymanSerializer, \
    JobEntrySerializer, ReviewSerializer


class CategoryView(APIView):
    def get(self, request):
        items = Category.objects.all()
        serializer = CategorySerializer(items, many=True)
        return Response(serializer.data)

    @swagger_auto_schema(request_body=CategorySerializer)
    def post(self, request):
        serializer = CategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CategoryDetailView(APIView):
    def get(self, request, pk):
        try:
            category = Category.objects.get(pk=pk)
        except ObjectDoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = CategorySerializer(category)
        return Response(serializer.data)

    def delete(self, request, pk):
        try:
            category = Category.objects.get(pk=pk)
        except ObjectDoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        category.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @swagger_auto_schema(request_body=CategorySerializer)
    def patch(self, request, pk):
        try:
            category = Category.objects.get(pk=pk)
        except ObjectDoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = CategorySerializer(category, data=request.data, partial=True)
        if serializer.is_valid():
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ServiceView(APIView):
    def get(self, request):
        items = Service.objects.all()
        serializer = ServiceSerializer(items, many=True)
        return Response(serializer.data)

    @swagger_auto_schema(request_body=ServiceSerializer)
    def post(self, request):
        serializer = ServiceSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ServiceDetailView(APIView):
    def get(self, request, pk):
        try:
            service = Service.objects.get(pk=pk)
        except ObjectDoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = ServiceSerializer(service)
        return Response(serializer.data)

    def delete(self, request, pk):
        try:
            service = Service.objects.get(pk=pk)
        except ObjectDoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        service.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @swagger_auto_schema(request_body=ServiceSerializer)
    def patch(self, request, pk):
        try:
            service = Service.objects.get(pk=pk)
        except ObjectDoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = ServiceSerializer(service, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserView(APIView):
    def get(self, request):
        items = User.objects.all()
        serializer = UserSerializer(items, many=True)
        return Response(serializer.data)

    @swagger_auto_schema(request_body=UserSerializer)
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserDetailView(APIView):
    def get(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
        except ObjectDoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = UserSerializer(user)
        return Response(serializer.data)

    @swagger_auto_schema(request_body=UserSerializer)
    def patch(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
        except ObjectDoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
        except ObjectDoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class HandymanView(APIView):
    def get(self, request):
        items = Handyman.objects.all()
        serializer = HandymanSerializer(items, many=True)
        return Response(serializer.data)

    @swagger_auto_schema(request_body=HandymanSerializer)
    def post(self, request):
        serializer = HandymanSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class HandymanDetailView(APIView):
    def get(self, request, pk):
        try:
            handyman = Handyman.objects.get(pk=pk)
        except ObjectDoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = HandymanSerializer(handyman)
        return Response(serializer.data)

    @swagger_auto_schema(request_body=HandymanSerializer)
    def patch(self, request, pk):
        try:
            handyman = Handyman.objects.get(pk=pk)
        except ObjectDoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = HandymanSerializer(handyman, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            handyman = Handyman.objects.get(pk=pk)
        except ObjectDoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        handyman.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class HandymanDetailCategoryView(APIView):
    def get(self, request, pk):
        try:
            handyman = Handyman.objects.get(pk=pk)
        except ObjectDoesNotExist:
            return Response({'error': 'Handyman not found'}, status=status.HTTP_404_NOT_FOUND)
        categories = Category.objects.filter(service__jobentry__handyman=handyman)
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)

class HandymanDetailCategoryServicesView(APIView):
    def get(self, request, handyman_pk, category_pk):
        try:
            handyman = Handyman.objects.get(pk=handyman_pk)
        except ObjectDoesNotExist:
            return Response({'error': 'Handyman not found'}, status=status.HTTP_404_NOT_FOUND)

        try:
            category = Category.objects.get(pk=category_pk)
        except ObjectDoesNotExist:
            return Response({'error': 'Category not found'}, status=status.HTTP_404_NOT_FOUND)

        services = Service.objects.filter(category=category, jobentry__handyman=handyman)
        serializer = ServiceSerializer(services, many=True)
        return Response(serializer.data)


class HandymanDetailJobEntriesView(APIView):
    def get(self, request, handyman_pk, category_pk, service_pk):
        try:
            handyman = Handyman.objects.get(pk=handyman_pk)
        except ObjectDoesNotExist:
            return Response({'error': 'Handyman not found'}, status=status.HTTP_404_NOT_FOUND)

        try:
            category = Category.objects.get(pk=category_pk)
        except ObjectDoesNotExist:
            return Response({'error': 'Category not found'}, status=status.HTTP_404_NOT_FOUND)

        try:
            service = Service.objects.get(pk=service_pk, category=category)
        except ObjectDoesNotExist:
            return Response({'error': 'Service not found'}, status=status.HTTP_404_NOT_FOUND)

        job_entries = handyman.jobentry_set.filter(service=service)
        serializer = JobEntrySerializer(job_entries, many=True)
        return Response(serializer.data)


class JobEntryView(APIView):
    def get(self, request):
        items = JobEntry.objects.all()
        serializer = JobEntrySerializer(items, many=True)
        return Response(serializer.data)

    @swagger_auto_schema(request_body=JobEntrySerializer)
    def post(self, request):
        serializer = JobEntrySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class JobEntryDetailView(APIView):
    def get(self, request, pk):
        try:
            entry = JobEntry.objects.get(pk=pk)
        except ObjectDoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = JobEntrySerializer(entry)
        return Response(serializer.data)

    @swagger_auto_schema(request_body=JobEntrySerializer)
    def patch(self, request, pk):
        try:
            entry = JobEntry.objects.get(pk=pk)
        except ObjectDoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = JobEntrySerializer(entry, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            entry = JobEntry.objects.get(pk=pk)
        except ObjectDoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        entry.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ReviewView(APIView):
    def get(self, request):
        items = Review.objects.all()
        serializer = ReviewSerializer(items, many=True)
        return Response(serializer.data)

    @swagger_auto_schema(request_body=ReviewSerializer)
    def post(self, request):
        serializer = ReviewSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)


class ReviewDetailView(APIView):
    def get(self, request, pk):
        try:
            review = Review.objects.get(pk=pk)
        except ObjectDoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = ReviewSerializer(review)
        return Response(serializer.data)

    @swagger_auto_schema(request_body=ReviewSerializer)
    def patch(self, request, pk):
        try:
            review = Review.objects.get(pk=pk)
        except ObjectDoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = ReviewSerializer(review, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            review = Review.objects.get(pk=pk)
        except ObjectDoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        review.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)