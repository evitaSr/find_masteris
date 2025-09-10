from django.urls import path, include
from drf_yasg import openapi
from drf_yasg.views import get_schema_view

schema_view = get_schema_view(
    openapi.Info(
        title='FindMasteris',
        default_version='v1',
        description='',
    ),
    public=False,
)
urlpatterns = [
    path('', include('api.urls')),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger'),
]
