from django.urls import path

from api.views.views import CategoryView, CategoryDetailView, ServiceView, ServiceDetailView, UserView, UserDetailView, \
    HandymanView, HandymanDetailView, HandymanDetailCategoryView, HandymanDetailCategoryServicesView, \
    HandymanJobEntriesView, HandymanDetailJobEntriesView, HandymanReviewView, HandymanReviewDetailView, \
    RequestToAddCategoryView, RequestToAddCategoryDetailView, RequestToAddServiceView, RequestToAddServiceDetailView

urlpatterns = [
    path('category/', CategoryView.as_view(), name='category'),
    path('category/<int:pk>/', CategoryDetailView.as_view(), name='category-detail'),
    path('category/<int:category_pk>/service/', ServiceView.as_view(), name='service'),
    path('category/<int:category_pk>/service/<int:pk>/', ServiceDetailView.as_view(), name='service-detail'),
    path('user/', UserView.as_view(), name='user'),
    path('user/<int:pk>/', UserDetailView.as_view(), name='user-detail'),
    path('handyman/', HandymanView.as_view(), name='handyman'),
    path('handyman/<int:pk>/', HandymanDetailView.as_view(), name='handyman-detail'),
    path('handyman/<int:handyman_pk>/category/', HandymanDetailCategoryView.as_view(), name='handyman-category'),
    path('handyman/<int:handyman_pk>/category/<int:category_pk>/service/', HandymanDetailCategoryServicesView.as_view(),
         name='handyman-category-service'),
    path('handyman/<int:handyman_pk>/category/<int:category_pk>/service/<int:service_pk>/job_entry/',
         HandymanJobEntriesView.as_view(), name='handyman-job-entry'),
    path('handyman/<int:handyman_pk>/category/<int:category_pk>/service/<int:service_pk>/job_entry/<int:pk>/',
         HandymanDetailJobEntriesView.as_view(), name='handyman-job_entries-detail'),
    path('handyman/<int:handyman_pk>/category/<int:category_pk>/service/<int:service_pk>/review/',
         HandymanReviewView.as_view(), name='handyman-review'),
    path('handyman/<int:handyman_pk>/category/<int:category_pk>/service/<int:service_pk>/review/<int:pk>/',
         HandymanReviewDetailView.as_view(), name='handyman-review-detail'),
    path('category_request/', RequestToAddCategoryView.as_view(), name='request-to-add-category'),
    path('category_request/<int:pk>/', RequestToAddCategoryDetailView.as_view(), name='request-to-add-category-detail'),
    path('service_request/', RequestToAddServiceView.as_view(), name='request-to-add-service'),
    path('service_request/<int:pk>/', RequestToAddServiceDetailView.as_view(), name='request-to-add-service-detail'),
]
