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
    @swagger_auto_schema(tags=['service'])
    def get(self, request, category_pk):
        if not Category.objects.filter(pk=category_pk).exists():
            return Response({'error': 'Category not found'}, status=status.HTTP_404_NOT_FOUND)
        items = Service.objects.filter(category_id=category_pk)
        serializer = ServiceSerializer(items, many=True)
        return Response(serializer.data)

    @swagger_auto_schema(request_body=ServiceSerializer, tags=['service'])
    def post(self, request, category_pk):
        try:
            category = Category.objects.get(pk=category_pk)
        except ObjectDoesNotExist:
            return Response({'error': 'Category not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = ServiceSerializer(data=request.data, context={'category': category})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ServiceDetailView(APIView):
    @swagger_auto_schema(tags=['service'])
    def get(self, request, pk, category_pk):
        try:
            service = Service.objects.get(pk=pk, category_id=category_pk)
        except ObjectDoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = ServiceSerializer(service)
        return Response(serializer.data)

    @swagger_auto_schema(tags=['service'])
    def delete(self, request, pk, category_pk):
        try:
            service = Service.objects.get(pk=pk, category_id=category_pk)
        except ObjectDoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        service.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @swagger_auto_schema(
        tags=['service'],
        request_body=ServiceSerializer
    )
    def patch(self, request, pk, category_pk):
        try:
            service = Service.objects.get(pk=pk, category_id=category_pk)
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


class HandymanJobEntriesView(APIView):
    @swagger_auto_schema(tags=['job_entry'])
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

    @swagger_auto_schema(request_body=JobEntrySerializer, tags=['job_entry'])
    def post(self, request, handyman_pk, category_pk, service_pk):
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

        serializer = JobEntrySerializer(data=request.data, context={'handyman': handyman, 'service': service,
                                                                    'uploaded_files': request.FILES.getlist(
                                                                        'uploaded_files')})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class HandymanDetailJobEntriesView(APIView):
    @swagger_auto_schema(tags=['job_entry'])
    def get(self, request, handyman_pk, category_pk, service_pk, pk):
        try:
            job_entry = JobEntry.objects.get(handyman_id=handyman_pk, service__category_id=category_pk,
                                             service_id=service_pk, pk=pk)
        except ObjectDoesNotExist:
            return Response({'error': 'Job entry not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = JobEntrySerializer(job_entry)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @swagger_auto_schema(request_body=JobEntrySerializer, tags=['job_entry'])
    def patch(self, request, handyman_pk, category_pk, service_pk, pk):
        try:
            job_entry = JobEntry.objects.get(handyman_id=handyman_pk, service__category_id=category_pk,
                                             service_id=service_pk, pk=pk)
        except ObjectDoesNotExist:
            return Response({'error': 'Job entry not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = JobEntrySerializer(job_entry, data=request.data, partial=True, context={'uploaded_files': request.FILES.getlist('uploaded_files')})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(tags=['job_entry'])
    def delete(self, request, handyman_pk, category_pk, service_pk, pk):
        try:
            job_entry = JobEntry.objects.get(handyman_id=handyman_pk, service__category_id=category_pk,
                                             service_id=service_pk, pk=pk)
        except ObjectDoesNotExist:
            return Response({'error': 'Job entry not found'}, status=status.HTTP_404_NOT_FOUND)

        job_entry.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class HandymanReviewView(APIView):
    @swagger_auto_schema(tags=['review'])
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

        reviews = Review.objects.filter(handyman=handyman, service=service)
        reviews_serializer = ReviewSerializer(reviews, many=True)
        return Response(reviews_serializer.data)

    @swagger_auto_schema(request_body=ReviewSerializer, tags=['review'])
    def post(self, request, handyman_pk, category_pk, service_pk):
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

        serializer = ReviewSerializer(data=request.data, context={'handyman': handyman, 'service': service})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class HandymanReviewDetailView(APIView):
    @swagger_auto_schema(tags=['review'])
    def get(self, request, handyman_pk, category_pk, service_pk, pk):
        review = self._get_review(handyman_pk, category_pk, service_pk, pk)
        if isinstance(review, Response):
            return review

        serializer = ReviewSerializer(review)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @swagger_auto_schema(request_body=ReviewSerializer, tags=['review'])
    def patch(self, request, handyman_pk, category_pk, service_pk, pk):
        review = self._get_review(handyman_pk, category_pk, service_pk, pk)
        if isinstance(review, Response):
            return review

        serializer = ReviewSerializer(review, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(tags=['review'])
    def delete(self, request, handyman_pk, category_pk, service_pk, pk):
        review = self._get_review(handyman_pk, category_pk, service_pk, pk)
        if isinstance(review, Response):
            return review
        review.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def _get_review(self, handyman_pk, category_pk, service_pk, pk):
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

        try:
            review = Review.objects.get(handyman=handyman, service=service, pk=pk)
        except ObjectDoesNotExist:
            return Response({'error': 'Review not found'}, status=status.HTTP_404_NOT_FOUND)
        return review
