from django.urls import path

from api.views import CategoryView, CategoryDetailView, ServiceView, ServiceDetailView, UserView, UserDetailView, \
    HandymanView, HandymanDetailView, JobEntryView, JobEntryDetailView, ReviewView, \
    ReviewDetailView

urlpatterns = [
    path('category/', CategoryView.as_view(), name='category'),
    path('category/<int:pk>/', CategoryDetailView.as_view(), name='category-detail'),
    path('service/', ServiceView.as_view(), name='service'),
    path('service/<int:pk>/', ServiceDetailView.as_view(), name='service-detail'),
    path('user/', UserView.as_view(), name='user'),
    path('user/<int:pk>/', UserDetailView.as_view(), name='user-detail'),
    path('handyman/', HandymanView.as_view(), name='handyman'),
    path('handyman/<int:pk>/', HandymanDetailView.as_view(), name='handyman-detail'),
    path('job_entry/', JobEntryView.as_view(), name='job-entry'),
    path('job_entry/<int:pk>/', JobEntryDetailView.as_view(), name='job-entry-detail'),
    path('review/', ReviewView.as_view(), name='review'),
    path('review/<int:pk>/', ReviewDetailView.as_view(), name='review-detail'),
]
