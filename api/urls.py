from django.urls import path

from api.views import CategoryView, CategoryDetailView, ServiceView, ServiceDetailView

urlpatterns = [
    path('category/', CategoryView.as_view(), name='category'),
    path('category/<int:pk>/', CategoryDetailView.as_view(), name='category-detail'),
    path('service/', ServiceView.as_view(), name='service'),
    path('service/<int:pk>', ServiceDetailView.as_view(), name='service-detail'),
]
