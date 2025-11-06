from django.conf.urls.static import static
from django.urls import path, include
from drf_yasg import openapi
from drf_yasg.views import get_schema_view

from findMasteris import settings

schema_view = get_schema_view(
    openapi.Info(
        title='FindMasteris',
        default_version='v1',
        description='',
    ),
    public=True,
    url='https://find-masteris-42bmh.ondigitalocean.app' if settings.DEBUG else '',
)
urlpatterns = [
    path('', include('api.urls')),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
