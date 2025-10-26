from typing import Union

from django.core.exceptions import ObjectDoesNotExist
from rest_framework import status
from rest_framework.response import Response

from api.models import Handyman, Category, Service, JobEntry, Review


def get_objs_or_response(handyman_pk, category_pk, service_pk) -> Union[list, tuple]:
    try:
        handyman = Handyman.objects.get(pk=handyman_pk)
        category = Category.objects.get(pk=category_pk)
        service = Service.objects.get(pk=service_pk, category=category)
    except Handyman.DoesNotExist:
        return [
            Response({'error': 'Handyman with id=%s not found' % handyman_pk}, status=status.HTTP_404_NOT_FOUND),
            None]
    except Category.DoesNotExist:
        return [
            Response({'error': 'Category with id=%s not found' % category_pk}, status=status.HTTP_404_NOT_FOUND),
            None]
    except Service.DoesNotExist:
        return [Response({'error': 'Service with id=%s of category id=%s not found' % (service_pk, category_pk)},
                         status=status.HTTP_404_NOT_FOUND), None]
    return handyman, service


def get_job_entry_or_response(handyman_pk, category_pk, service_pk, pk):
    try:
        handyman = Handyman.objects.get(pk=handyman_pk)
        category = Category.objects.get(pk=category_pk)
        service = Service.objects.get(category=category, pk=service_pk)
        job_entry = JobEntry.objects.get(handyman=handyman, service=service, pk=pk)
    except Handyman.DoesNotExist:
        return Response({'error': 'Handyman with id=%s not found' % handyman_pk}, status=status.HTTP_404_NOT_FOUND)
    except Category.DoesNotExist:
        return Response({'error': 'Category with id=%s not found' % category_pk}, status=status.HTTP_404_NOT_FOUND)
    except Service.DoesNotExist:
        return Response({'error': 'Service with id=%s of category id=%s not found' % (category_pk, service_pk)},
                        status=status.HTTP_404_NOT_FOUND)
    except JobEntry.DoesNotExist:
        return Response({'error': 'Job entry with id=%s not found' % pk}, status=status.HTTP_404_NOT_FOUND)

    return job_entry


def get_review(handyman_pk, category_pk, service_pk, pk):
    objs_or_response = get_objs_or_response(handyman_pk, category_pk, service_pk)
    if isinstance(objs_or_response[0], Response):
        return objs_or_response[0]
    handyman, service = objs_or_response

    try:
        review = Review.objects.get(handyman=handyman, service=service, pk=pk)
    except ObjectDoesNotExist:
        return Response({'error': 'Review with id=%s of handyman id=%s and service id=%s not found' % (
            pk, handyman_pk, service_pk)}, status=status.HTTP_404_NOT_FOUND)
    return review


def get_service_or_response(pk, category_pk):
    try:
        category = Category.objects.get(pk=category_pk)
        service = Service.objects.get(pk=pk, category=category)
    except Category.DoesNotExist:
        return Response({'error': 'Category with id=%s not found' % category_pk}, status=status.HTTP_404_NOT_FOUND)
    except Service.DoesNotExist:
        return Response({'error': 'Service with id=%s, of category id=%s, not found' % (pk, category_pk)},
                        status=status.HTTP_404_NOT_FOUND)
    return service
