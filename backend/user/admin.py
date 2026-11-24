from django.contrib import admin
from .models import Batch, Enquiry, JobListing


@admin.register(Batch)
class BatchAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'course_name',
        'batch_type',
        'schedule_days',
        'date_range',
        'total_seats',
        'pre_booked_seats',
        'seats_left',
        'enquired_count',
        'is_flexible',
        'is_active',
        'display_order',
    )
    list_filter = ('course_name', 'batch_type', 'is_active', 'is_flexible')
    list_editable = ('pre_booked_seats', 'is_active', 'display_order')
    search_fields = ('course_name', 'date_range')


@admin.register(Enquiry)
class EnquiryAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'full_name',
        'email',
        'whatsapp_number',
        'preferred_course',
        'batch',
        'city',
        'source',
        'status',
        'created_at',
    )
    list_filter = ('status', 'source', 'preferred_course', 'batch', 'created_at')
    search_fields = ('full_name', 'email', 'whatsapp_number', 'city', 'preferred_course')
    list_editable = ('status',)
    readonly_fields = ('created_at', 'updated_at')
    list_per_page = 25

@admin.register(JobListing)
class JobListingAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'company_name', 'location', 'salary', 'nebosh_required', 'is_active', 'created_at')
    list_filter = ('category', 'nebosh_required', 'is_active')
    list_editable = ('is_active',)
    search_fields = ('title', 'company_name', 'location', 'nationality')