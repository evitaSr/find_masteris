from django.urls import path, include
from drf_yasg import openapi
from drf_yasg.views import get_schema_view


api_info = openapi.Info(
    title='FindMasteris',
    default_version='v1',
    description='',
)
schema_view = get_schema_view(
    api_info,
    public=True,
    url='',
)
urlpatterns = [
    path('', include('api.urls')),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger'),
]
