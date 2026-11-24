import re
import requests
import dns.exception
import dns.resolver
from datetime import timedelta
from django.conf import settings
from django.db.models import Q
from django.utils import timezone
from rest_framework import serializers
from .models import Batch, Enquiry,JobListing


class BatchSerializer(serializers.ModelSerializer):
    seats_left = serializers.IntegerField(read_only=True)
    enquired_count = serializers.IntegerField(read_only=True)
    enrolled_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Batch
        fields = [
            'id',
            'course_name',
            'mode',
            'batch_type',
            'schedule_days',
            'date_range',
            'total_seats',
            'seats_left',
            'enquired_count',
            'enrolled_count',
            'is_flexible',
        ]

BatchPublicSerializer = BatchSerializer

def get_enrolled_count(self, obj):
        return obj.enquiries.filter(status='enrolled').count()

def get_seats_left(self, obj):
        enrolled = obj.enquiries.filter(status='enrolled').count()
        remaining = obj.total_seats - obj.pre_booked_seats - enrolled
        return max(0, remaining)

def get_enquired_count(self, obj):
        return obj.enquiries.count()


class EnquiryCreateSerializer(serializers.ModelSerializer):
    recaptcha_token = serializers.CharField(write_only=True, required=True)
    batch = serializers.PrimaryKeyRelatedField(
        queryset=Batch.objects.filter(is_active=True),
        required=False,
        allow_null=True,
    )

    class Meta:
        model = Enquiry
        fields = [
            'id',
            'full_name',
            'email',
            'whatsapp_number',
            'preferred_course',
            'city',
            'batch',
            'source',
            'notes',
            'recaptcha_token',
        ]

    def validate_email(self, value):
        email = value.strip().lower()
        basic_pattern = r'^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$'
        if not re.match(basic_pattern, email):
            raise serializers.ValidationError('Enter a valid mail ID')

        local_part, domain = email.split('@', 1)

        blocked_domains = {
            'gamil.com', 'gmial.com', 'gnail.com', 'gmal.com', 'gmail.co',
            'yaho.com', 'yahooo.com', 'hotmal.com', 'outlok.com',
            'mailinator.com', 'tempmail.com', 'yopmail.com', '10minutemail.com',
            'guerrillamail.com', 'sharklasers.com', 'trashmail.com',
        }
        if domain in blocked_domains:
            raise serializers.ValidationError('Enter a valid mail ID')

        if domain in ('gmail.com', 'googlemail.com'):
            base_user = local_part.split('+', 1)[0]
            if (
                len(base_user) < 6
                or len(base_user) > 30
                or base_user.startswith('.')
                or base_user.endswith('.')
                or '..' in base_user
                or not re.match(r'^[a-z0-9.]+$', base_user)
            ):
                raise serializers.ValidationError('Enter a valid mail ID')

        try:
            resolver = dns.resolver.Resolver()
            resolver.lifetime = 2.5
            answers = resolver.resolve(domain, 'MX')
            if not answers:
                raise serializers.ValidationError('Enter a valid mail ID')
        except (dns.resolver.NXDOMAIN, dns.resolver.NoAnswer):
            raise serializers.ValidationError('Enter a valid mail ID')
        except (dns.resolver.NoNameservers, dns.exception.Timeout):
            pass

        return email

    def validate_whatsapp_number(self, value):
        cleaned = re.sub(r'\s+', '', value.strip())
        digits = re.sub(r'\D', '', cleaned)
        if len(digits) < 8 or len(digits) > 15:
            raise serializers.ValidationError('Please enter a valid WhatsApp number (8 to 15 digits).')
        return cleaned

    def validate_recaptcha_token(self, value):
        secret_key = settings.RECAPTCHA_SECRET_KEY
        if not secret_key:
            raise serializers.ValidationError('Server reCAPTCHA configuration is missing.')

        try:
            response = requests.post(
                'https://www.google.com/recaptcha/api/siteverify',
                data={'secret': secret_key, 'response': value},
                timeout=5,
            )
            result = response.json()
        except requests.RequestException:
            raise serializers.ValidationError('Unable to verify reCAPTCHA right now. Please try again.')

        if not result.get('success'):
            raise serializers.ValidationError("reCAPTCHA verification failed. Please tick 'I'm not a robot' again.")

        return value

    def validate(self, attrs):
        email = attrs.get('email')
        whatsapp = attrs.get('whatsapp_number')
        last_24_hours = timezone.now() - timedelta(hours=24)

        already_registered = Enquiry.objects.filter(
            Q(email=email) | Q(whatsapp_number=whatsapp),
            created_at__gte=last_24_hours,
        ).exists()

        if already_registered:
            raise serializers.ValidationError(
                'You have already registered! Our team will get back to you within 24 hours.'
            )

        return attrs

    def create(self, validated_data):
        validated_data.pop('recaptcha_token', None)

        # Home page-la irundhu batch select pannaama vandha, matching course-oda 1st active batch-la auto-link pannum
        if not validated_data.get('batch') and validated_data.get('preferred_course'):
            course_text = validated_data['preferred_course'].lower()
            for active_batch in Batch.objects.filter(is_active=True):
                if active_batch.course_name.lower() in course_text:
                    validated_data['batch'] = active_batch
                    break

        return super().create(validated_data)


class EnquiryAdminSerializer(serializers.ModelSerializer):
    batch_label = serializers.SerializerMethodField()

    class Meta:
        model = Enquiry
        fields = [
            'id',
            'full_name',
            'email',
            'whatsapp_number',
            'preferred_course',
            'city',
            'batch',
            'batch_label',
            'source',
            'notes',
            'status',
            'created_at',
        ]
        read_only_fields = ['id', 'created_at']

    def get_batch_label(self, obj):
        if obj.batch:
            return f"{obj.batch.course_name} ({obj.batch.date_range})"
        return ''

class JobListingSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobListing
        fields = [
            'id',
            'title',
            'company_name',
            'company_logo',
            'category',
            'salary',
            'experience',
            'nationality',
            'job_type',
            'vacancy',
            'location',
            'posted_label',
            'apply_url',
            'nebosh_required',
            'is_active',
            'created_at',
        ]
        read_only_fields = ['id', 'created_at']