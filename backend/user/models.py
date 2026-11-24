from django.db import models
from django.utils import timezone  

class Batch(models.Model):
    BATCH_TYPE_CHOICES = [
        ('Weekdays', 'Weekdays'),
        ('Weekend', 'Weekend'),
    ]

    course_name = models.CharField(max_length=150)          # e.g., NEBOSH IGC, NEBOSH HSW
    mode = models.CharField(max_length=50, default='Online')
    batch_type = models.CharField(max_length=20, choices=BATCH_TYPE_CHOICES, default='Weekdays')
    schedule_days = models.CharField(max_length=100)        # e.g., Weekdays (Mon–Fri)
    date_range = models.CharField(max_length=120)           # e.g., 09th Nov – 11th Dec 2026
    timing = models.CharField(max_length=100, default='Live Online (IST / GST)')

    total_seats = models.PositiveIntegerField(default=20)
    pre_booked_seats = models.PositiveIntegerField(default=0)  # Initial seats already filled
    is_flexible = models.BooleanField(default=False)           # True for "Easy to Book" batches
    is_active = models.BooleanField(default=True)
    display_order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['display_order', 'id']
        verbose_name = 'Upcoming Batch'
        verbose_name_plural = 'Upcoming Batches'
    @property
    def enquired_count(self):
        return self.enquiries.count()

    @property
    def enrolled_count(self):
        return self.enquiries.filter(status='enrolled').count()

    @property
    def seats_left(self):
        remaining = self.total_seats - self.pre_booked_seats - self.enrolled_count
        return max(0, remaining)

    def __str__(self):
        return f"{self.course_name} | {self.batch_type} ({self.date_range})"


class Enquiry(models.Model):
    STATUS_CHOICES = [
        ('new', 'New'),
        ('contacted', 'Contacted'),
        ('interested', 'Interested'),
        ('enrolled', 'Enrolled'),
        ('closed', 'Closed'),
    ]

    # Core Student / Lead Details
    full_name = models.CharField(max_length=150)
    email = models.EmailField(db_index=True)
    whatsapp_number = models.CharField(max_length=20, db_index=True)
    preferred_course = models.CharField(max_length=150, blank=True, default='')
    city = models.CharField(max_length=100, blank=True, default='')

    # Link to Upcoming Batch (Seat decrease & Enquired count sync-ku!)
    batch = models.ForeignKey(
        Batch,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='enquiries',
    )

    # Future-Proof Fields
    source = models.CharField(max_length=60, default='home_page')
    notes = models.TextField(blank=True, default='')

    # Office Team Follow-up Tracking
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='new')
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Student Enquiry'
        verbose_name_plural = 'Student Enquiries'

    def __str__(self):
        return f"{self.full_name} ({self.preferred_course or self.source})"

# JOB LISTING PART
class JobListing(models.Model):
    title = models.CharField(max_length=150)                      # e.g. Safety Officer, Junior Safety Officer
    company_name = models.CharField(max_length=150)               # e.g. DigitalX, JUMBO, PME
    company_logo = models.CharField(max_length=300, blank=True, default='')  # Optional logo path/URL
    category = models.CharField(max_length=100, default='Safety Officer')    # Filter category
    salary = models.CharField(max_length=120, default='Based on Experience')
    experience = models.CharField(max_length=80, default='0 – 2 Years')
    nationality = models.CharField(max_length=180, default='Any Nationality')
    job_type = models.CharField(max_length=60, default='Full-time')
    vacancy = models.CharField(max_length=60, default='1 Vacancy')
    location = models.CharField(max_length=200)                   # e.g. Dubai – United Arab Emirates (UAE)
    posted_label = models.CharField(max_length=60, blank=True, default='')  # e.g. Posted on 26 Oct
    apply_url = models.URLField(max_length=500, blank=True, default='')     # Third-party Apply Website URL
    nebosh_required = models.BooleanField(default=True)           # Shows "*NEBOSH IGC certificate is a must*"
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    company_logo = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(default=timezone.now)
    
    class Meta:
        ordering = ['-created_at', '-id']
        verbose_name = 'HSE Job Listing'
        verbose_name_plural = 'HSE Job Listings'

    def __str__(self):
        return f"{self.title} - {self.company_name} ({self.location})"