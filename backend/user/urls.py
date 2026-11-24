from django.urls import path
from .views import (
    AdminEnquiryDetailView,
    AdminEnquiryExportCSVView,
    AdminEnquiryListView,
    AdminLoginView,
    EnquiryCreateView,
    PublicBatchListView,
    ChatbotView,
    JobListPublicView,
    AdminJobDetailView,
    AdminJobListCreateView
)

urlpatterns = [
    path('batches/', PublicBatchListView.as_view(), name='public-batch-list'),
    path('enquiries/', EnquiryCreateView.as_view(), name='enquiry-create'),

    path('admin/login/', AdminLoginView.as_view(), name='admin-login'),
    path('admin/enquiries/', AdminEnquiryListView.as_view(), name='admin-enquiry-list'),
    path('admin/enquiries/export/', AdminEnquiryExportCSVView.as_view(), name='admin-enquiry-export'),
    path('admin/enquiries/<int:pk>/', AdminEnquiryDetailView.as_view(), name='admin-enquiry-detail'),
    path('chat/', ChatbotView.as_view(), name='ai-chat'),
    path('jobs/', JobListPublicView.as_view(), name='job-list'),
    path('admin/jobs/', AdminJobListCreateView.as_view(), name='admin-job-list'),
    path('admin/jobs/<int:pk>/', AdminJobDetailView.as_view(), name='admin-job-detail'),
]
