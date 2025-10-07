from django.core.exceptions import ObjectDoesNotExist
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.response import Response
from rest_framework.status import HTTP_400_BAD_REQUEST, HTTP_422_UNPROCESSABLE_ENTITY
from rest_framework.views import APIView

from api.models import Category, Service, User, Handyman, Review, RequestToAddCategory, RequestToAddService
from api.serializers import CategorySerializer, ServiceSerializer, UserSerializer, HandymanSerializer, \
    JobEntrySerializer, ReviewSerializer, RequestToAddCategorySerializer, RequestToAddServiceSerializer
from api.views.helpers import get_objs_or_response, get_job_entry_or_response, get_review


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
            return Response({'error': 'Category with id=%s not found' % pk}, status=status.HTTP_404_NOT_FOUND)
        serializer = CategorySerializer(category)
        return Response(serializer.data)

    def delete(self, request, pk):
        try:
            category = Category.objects.get(pk=pk)
        except ObjectDoesNotExist:
            return Response({'error': 'Category with id=%s not found' % pk}, status=status.HTTP_404_NOT_FOUND)
        category.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @swagger_auto_schema(request_body=CategorySerializer)
    def patch(self, request, pk):
        try:
            category = Category.objects.get(pk=pk)
        except ObjectDoesNotExist:
            return Response({'error': 'Category with id=%s not found' % pk}, status=status.HTTP_404_NOT_FOUND)
        serializer = CategorySerializer(category, data=request.data, partial=True)
        if serializer.is_valid():
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ServiceView(APIView):
    @swagger_auto_schema(tags=['service'])
    def get(self, request, category_pk):
        if not Category.objects.filter(pk=category_pk).exists():
            return Response({'error': 'Category with id=%s not found' % category_pk}, status=status.HTTP_404_NOT_FOUND)
        items = Service.objects.filter(category_id=category_pk)
        serializer = ServiceSerializer(items, many=True)
        return Response(serializer.data)

    @swagger_auto_schema(request_body=ServiceSerializer, tags=['service'])
    def post(self, request, category_pk):
        try:
            category = Category.objects.get(pk=category_pk)
        except ObjectDoesNotExist:
            return Response({'error': 'Category with id=%s not found' % category_pk}, status=status.HTTP_404_NOT_FOUND)
        serializer = ServiceSerializer(data=request.data, context={'category': category})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ServiceDetailView(APIView):
    @swagger_auto_schema(tags=['service'])
    def get(self, request, pk, category_pk):
        service = self._get_service_or_response(pk, category_pk)
        if isinstance(service, Response):
            return service
        serializer = ServiceSerializer(service)
        return Response(serializer.data)

    @swagger_auto_schema(tags=['service'])
    def delete(self, request, pk, category_pk):
        service = self._get_service_or_response(pk, category_pk)
        if isinstance(service, Response):
            return service
        service.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @swagger_auto_schema(
        tags=['service'],
        request_body=ServiceSerializer
    )
    def patch(self, request, pk, category_pk):
        service = self._get_service_or_response(pk, category_pk)
        if isinstance(service, Response):
            return service
        serializer = ServiceSerializer(service, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def _get_service_or_response(self, pk, category_pk):
        try:
            category = Category.objects.get(pk=category_pk)
            service = Service.objects.get(pk=pk, category=category)
        except Category.DoesNotExist:
            return Response({'error': 'Category with id=%s not found' % category_pk}, status=status.HTTP_404_NOT_FOUND)
        except Service.DoesNotExist:
            return Response({'error': 'Service with id=%s, of category id=%s, not found' % (pk, category_pk)},
                            status=status.HTTP_404_NOT_FOUND)
        return service


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
            return Response({'error': 'User with id=%s not found' % pk}, status=status.HTTP_404_NOT_FOUND)
        serializer = UserSerializer(user)
        return Response(serializer.data)

    @swagger_auto_schema(request_body=UserSerializer)
    def patch(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
        except ObjectDoesNotExist:
            return Response({'error': 'User with id=%s not found' % pk}, status=status.HTTP_404_NOT_FOUND)

        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
        except ObjectDoesNotExist:
            return Response({'error': 'User with id=%s not found' % pk}, status=status.HTTP_404_NOT_FOUND)

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
            return Response({'error': 'Handyman with id=%s not found' % pk}, status=status.HTTP_404_NOT_FOUND)
        serializer = HandymanSerializer(handyman)
        return Response(serializer.data)

    @swagger_auto_schema(request_body=HandymanSerializer)
    def patch(self, request, pk):
        try:
            handyman = Handyman.objects.get(pk=pk)
        except ObjectDoesNotExist:
            return Response({'error': 'Handyman with id=%s not found' % pk}, status=status.HTTP_404_NOT_FOUND)
        serializer = HandymanSerializer(handyman, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            handyman = Handyman.objects.get(pk=pk)
        except ObjectDoesNotExist:
            return Response({'error': 'Handyman with id=%s not found' % pk}, status=status.HTTP_404_NOT_FOUND)
        handyman.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class HandymanDetailCategoryView(APIView):
    def get(self, request, handyman_pk):
        try:
            handyman = Handyman.objects.get(pk=handyman_pk)
        except ObjectDoesNotExist:
            return Response({'error': 'Handyman with id=%s not found' % handyman_pk}, status=status.HTTP_404_NOT_FOUND)
        categories = Category.objects.filter(service__jobentry__handyman=handyman).distinct()
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)


class HandymanDetailCategoryServicesView(APIView):
    def get(self, request, handyman_pk, category_pk):
        try:
            handyman = Handyman.objects.get(pk=handyman_pk)
            category = Category.objects.get(pk=category_pk)
        except Handyman.DoesNotExist:
            return Response({'error': 'Handyman with id=%s not found' % handyman_pk}, status=status.HTTP_404_NOT_FOUND)
        except Category.DoesNotExist:
            return Response({'error': 'Category with id=%s not found' % category_pk}, status=status.HTTP_404_NOT_FOUND)

        services = Service.objects.filter(category=category, jobentry__handyman=handyman).distinct()
        serializer = ServiceSerializer(services, many=True)
        return Response(serializer.data)


class HandymanJobEntriesView(APIView):
    @swagger_auto_schema(tags=['job_entry'])
    def get(self, request, handyman_pk, category_pk, service_pk):
        objs_or_response = get_objs_or_response(handyman_pk, category_pk, service_pk)
        if isinstance(objs_or_response[0], Response):
            return objs_or_response[0]
        handyman, service = objs_or_response

        job_entries = handyman.jobentry_set.filter(service=service)
        serializer = JobEntrySerializer(job_entries, many=True)
        return Response(serializer.data)

    @swagger_auto_schema(request_body=JobEntrySerializer, tags=['job_entry'])
    def post(self, request, handyman_pk, category_pk, service_pk):
        objs_or_response = get_objs_or_response(handyman_pk, category_pk, service_pk)
        if isinstance(objs_or_response[0], Response):
            return objs_or_response[0]
        handyman, service = objs_or_response

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
        job_entry = get_job_entry_or_response(handyman_pk, category_pk, service_pk, pk)
        if isinstance(job_entry, Response):
            return job_entry
        serializer = JobEntrySerializer(job_entry)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @swagger_auto_schema(request_body=JobEntrySerializer, tags=['job_entry'])
    def patch(self, request, handyman_pk, category_pk, service_pk, pk):
        job_entry = get_job_entry_or_response(handyman_pk, category_pk, service_pk, pk)
        if isinstance(job_entry, Response):
            return job_entry
        serializer = JobEntrySerializer(job_entry, data=request.data, partial=True,
                                        context={'uploaded_files': request.FILES.getlist('uploaded_files')})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(tags=['job_entry'])
    def delete(self, request, handyman_pk, category_pk, service_pk, pk):
        job_entry = get_job_entry_or_response(handyman_pk, category_pk, service_pk, pk)
        if isinstance(job_entry, Response):
            return job_entry

        job_entry.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class HandymanReviewView(APIView):
    @swagger_auto_schema(tags=['review'])
    def get(self, request, handyman_pk, category_pk, service_pk):
        objs_or_response = get_objs_or_response(handyman_pk, category_pk, service_pk)
        if isinstance(objs_or_response[0], Response):
            return objs_or_response[0]
        handyman, service = objs_or_response

        reviews = Review.objects.filter(handyman=handyman, service=service)
        reviews_serializer = ReviewSerializer(reviews, many=True)
        return Response(reviews_serializer.data)

    @swagger_auto_schema(request_body=ReviewSerializer, tags=['review'])
    def post(self, request, handyman_pk, category_pk, service_pk):
        objs_or_response = get_objs_or_response(handyman_pk, category_pk, service_pk)
        if isinstance(objs_or_response[0], Response):
            return objs_or_response[0]
        handyman, service = objs_or_response

        serializer = ReviewSerializer(data=request.data, context={'handyman': handyman, 'service': service})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class HandymanReviewDetailView(APIView):
    @swagger_auto_schema(tags=['review'])
    def get(self, request, handyman_pk, category_pk, service_pk, pk):
        review = get_review(handyman_pk, category_pk, service_pk, pk)
        if isinstance(review, Response):
            return review

        serializer = ReviewSerializer(review)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @swagger_auto_schema(request_body=ReviewSerializer, tags=['review'])
    def patch(self, request, handyman_pk, category_pk, service_pk, pk):
        review = get_review(handyman_pk, category_pk, service_pk, pk)
        if isinstance(review, Response):
            return review

        serializer = ReviewSerializer(review, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(tags=['review'])
    def delete(self, request, handyman_pk, category_pk, service_pk, pk):
        review = get_review(handyman_pk, category_pk, service_pk, pk)
        if isinstance(review, Response):
            return review
        review.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class RequestToAddCategoryView(APIView):
    def get(self, request):
        objs = RequestToAddCategory.objects.filter(is_rejected=False)
        serializer = RequestToAddCategorySerializer(objs, many=True)
        return Response(serializer.data)

    @swagger_auto_schema(request_body=RequestToAddCategorySerializer)
    def post(self, request):
        serializer = RequestToAddCategorySerializer(data=request.data)
        if Category.objects.filter(title__iexact=request.data['title']).exists():
            return Response({'error': 'Category with title "%s" already exists' % request.data['title']},
                            status=HTTP_422_UNPROCESSABLE_ENTITY)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)


class RequestToAddCategoryDetailView(APIView):
    def get(self, request, pk):
        try:
            obj = RequestToAddCategory.objects.get(pk=pk)
        except ObjectDoesNotExist:
            return Response({'error': "Request to add category with id=%s doesnt exist" % pk},
                            status=status.HTTP_404_NOT_FOUND)
        serializer = RequestToAddCategorySerializer(obj)
        return Response(serializer.data)

    @swagger_auto_schema(request_body=RequestToAddCategorySerializer)
    def patch(self, request, pk):
        try:
            obj = RequestToAddCategory.objects.get(pk=pk)
        except ObjectDoesNotExist:
            return Response({'error': "Request to add category with id=%s doesnt exist" % pk},
                            status=status.HTTP_404_NOT_FOUND)
        if request.data.get('title') and Category.objects.filter(title__iexact=request.data.get('title')).exists():
            return Response({'error': 'Category with title "%s" already exists' % request.data.get('title')},
                            status=HTTP_422_UNPROCESSABLE_ENTITY)

        serializer = RequestToAddCategorySerializer(obj, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            obj = RequestToAddCategory.objects.get(pk=pk)
        except ObjectDoesNotExist:
            return Response({'error': "Request to add category with id=%s doesnt exist" % pk},
                            status=status.HTTP_404_NOT_FOUND)
        obj.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class RequestToAddServiceView(APIView):
    def get(self, request):
        objs = RequestToAddService.objects.filter(is_rejected=False)
        serializer = RequestToAddServiceSerializer(objs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @swagger_auto_schema(request_body=RequestToAddServiceSerializer)
    def post(self, request):
        serializer = RequestToAddServiceSerializer(data=request.data)
        if Service.objects.filter(title__iexact=request.data['title'], category_id=request.data['category']).exists():
            return Response({'error': 'Service of category %s with title "%s" already exists' % (
                request.data['category'], request.data['title'])}, status=HTTP_422_UNPROCESSABLE_ENTITY)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RequestToAddServiceDetailView(APIView):
    def get(self, request, pk):
        try:
            obj = RequestToAddService.objects.get(pk=pk)
        except ObjectDoesNotExist:
            return Response({'error': "Request to add service with id=%s doesn't exist" % pk},
                            status=status.HTTP_404_NOT_FOUND)
        serializer = RequestToAddServiceSerializer(obj)
        return Response(serializer.data)

    @swagger_auto_schema(request_body=RequestToAddServiceSerializer)
    def patch(self, request, pk):
        try:
            obj = RequestToAddService.objects.get(pk=pk)
        except ObjectDoesNotExist:
            return Response({'error': "Request to add service with id=%s doesn't exist" % pk},
                            status=status.HTTP_404_NOT_FOUND)
        if request.data.get('category') and request.data.get('title') and Service.objects.filter(
                title__iexact=request.data.get('title'), category_id=request.data.get('category')).exists():
            return Response({'error': 'Service of category %s with title "%s" already exists' % (
                request.data['category'], request.data['title'])}, status=HTTP_422_UNPROCESSABLE_ENTITY)

        serializer = RequestToAddServiceSerializer(obj, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            obj = RequestToAddService.objects.get(pk=pk)
        except ObjectDoesNotExist:
            return Response({'error': "Request to add service with id=%s doesn't exist" % pk},
                            status=status.HTTP_404_NOT_FOUND)
        obj.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
