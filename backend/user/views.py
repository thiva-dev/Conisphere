import csv
from django.contrib.auth import authenticate, get_user_model
from django.db.models import Q
from django.http import HttpResponse
from django.utils import timezone
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from .chatbot import generate_ai_chat_reply
from .emails import send_enquiry_emails_async
from .models import Batch, Enquiry,JobListing
from .serializers import BatchPublicSerializer, EnquiryAdminSerializer,EnquiryCreateSerializer,JobListingSerializer

User = get_user_model()


# Default Batches Auto-Seeder (1st time DB empty-aa irundha automatic-aa create pannidum)
def _ensure_default_batches():
    if Batch.objects.exists():
        return
    default_batches = [
        Batch(
            course_name='NEBOSH IGC',
            mode='Online',
            batch_type='Weekdays',
            schedule_days='Weekdays (Mon–Fri)',
            date_range='09th Nov – 11th Dec 2026',
            timing='Live Online (IST & GST Friendly)',
            total_seats=20,
            pre_booked_seats=13,  # Initial 7 / 20 Seats Left
            display_order=1,
        ),
        Batch(
            course_name='NEBOSH IGC',
            mode='Online',
            batch_type='Weekdays',
            schedule_days='Weekdays (Mon–Fri)',
            date_range='16th Nov – 18th Dec 2026',
            timing='Live Online (IST & GST Friendly)',
            total_seats=20,
            pre_booked_seats=2,   # Initial 18 / 20 Seats Left
            display_order=2,
        ),
        Batch(
            course_name='NEBOSH IGC',
            mode='Online',
            batch_type='Weekdays',
            schedule_days='Weekdays (Mon–Fri)',
            date_range='23rd Nov – 25th Dec 2026',
            timing='Live Online (IST & GST Friendly)',
            total_seats=20,
            pre_booked_seats=5,   # Initial 15 / 20 Seats Left
            display_order=3,
        ),
        Batch(
            course_name='NEBOSH IGC',
            mode='Online',
            batch_type='Weekdays',
            schedule_days='Weekdays (Mon–Fri)',
            date_range='30th Nov – 1st Jan 2027',
            timing='Live Online (IST & GST Friendly)',
            total_seats=20,
            pre_booked_seats=0,   # Initial 20 / 20 Seats Left
            display_order=4,
        ),
        Batch(
            course_name='NEBOSH IGC',
            mode='Online',
            batch_type='Weekend',
            schedule_days='Weekend (Sunday)',
            date_range='29th Nov – 31st Jan 2027',
            timing='Live Online (Sunday Special)',
            total_seats=20,
            pre_booked_seats=0,   # Initial 20 / 20 Seats Left
            display_order=5,
        ),
        Batch(
            course_name='NEBOSH HSW',
            mode='Online',
            batch_type='Weekdays',
            schedule_days='Weekdays (Mon–Fri)',
            date_range='Every Month',
            timing='Live Online (Flexible Monthly Intake)',
            total_seats=20,
            pre_booked_seats=0,
            is_flexible=True,     # Shows "Easy to Book"
            display_order=6,
        ),
    ]
    Batch.objects.bulk_create(default_batches)


# =========================================================
# 1. PUBLIC API: Upcoming Online Batches (Live Seats & Enquired Count)
# =========================================================
class PublicBatchListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        _ensure_default_batches()
        batches = Batch.objects.filter(is_active=True)
        serializer = BatchPublicSerializer(batches, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


# =========================================================
# 2. PUBLIC API: Student Registration / Lead Submission
# =========================================================
class EnquiryCreateView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = EnquiryCreateSerializer(data=request.data)
        if serializer.is_valid():
            enquiry = serializer.save()
            send_enquiry_emails_async(enquiry)
            return Response(
                {
                    'message': 'Registration successful! Our advisor will contact you within 24 hours.',
                    'data': EnquiryAdminSerializer(enquiry).data,
                },
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# =========================================================
# 3. ADMIN-ONLY LOGIN API
# =========================================================
class AdminLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        identifier = (request.data.get('username') or request.data.get('email') or '').strip()
        password = request.data.get('password') or ''

        if not identifier or not password:
            return Response(
                {'detail': 'Username/Email and password are required.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        username_to_check = identifier
        if '@' in identifier:
            matched_user = User.objects.filter(email__iexact=identifier).first()
            if matched_user:
                username_to_check = matched_user.get_username()

        user = authenticate(request, username=username_to_check, password=password)

        if user is None:
            return Response({'detail': 'Invalid username/email or password.'}, status=status.HTTP_401_UNAUTHORIZED)

        if not user.is_active or not user.is_staff:
            return Response({'detail': 'Access denied. Admin privileges required.'}, status=status.HTTP_403_FORBIDDEN)

        refresh = RefreshToken.for_user(user)
        return Response(
            {
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'user': {
                    'id': user.id,
                    'username': user.get_username(),
                    'email': user.email,
                    'is_superuser': user.is_superuser,
                },
            },
            status=status.HTTP_200_OK,
        )


def _get_filtered_enquiries(request):
    queryset = Enquiry.objects.select_related('batch').all()

    search = request.query_params.get('search', '').strip()
    lead_status = request.query_params.get('status', '').strip()
    course = request.query_params.get('course', '').strip()
    source = request.query_params.get('source', '').strip()

    if search:
        queryset = queryset.filter(
            Q(full_name__icontains=search)
            | Q(email__icontains=search)
            | Q(whatsapp_number__icontains=search)
            | Q(city__icontains=search)
            | Q(preferred_course__icontains=search)
        )
    if lead_status:
        queryset = queryset.filter(status=lead_status)
    if course:
        queryset = queryset.filter(preferred_course__icontains=course)
    if source:
        queryset = queryset.filter(source=source)

    return queryset


# =========================================================
# 4. ADMIN LEADS LIST + KPI STATS + BATCHES LIST
# =========================================================
class AdminEnquiryListView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        _ensure_default_batches()
        queryset = _get_filtered_enquiries(request)
        serializer = EnquiryAdminSerializer(queryset, many=True)
        batches = BatchPublicSerializer(Batch.objects.filter(is_active=True), many=True).data

        all_leads = Enquiry.objects.all()
        stats = {
            'total': all_leads.count(),
            'new': all_leads.filter(status='new').count(),
            'contacted': all_leads.filter(status='contacted').count(),
            'interested': all_leads.filter(status='interested').count(),
            'enrolled': all_leads.filter(status='enrolled').count(),
            'closed': all_leads.filter(status='closed').count(),
        }

        return Response({'stats': stats, 'enquiries': serializer.data, 'batches': batches}, status=status.HTTP_200_OK)


# =========================================================
# 5. ADMIN LEAD STATUS / BATCH / NOTES UPDATE & DELETE API
# =========================================================
class AdminEnquiryDetailView(APIView):
    permission_classes = [IsAdminUser]

    def patch(self, request, pk):
        try:
            enquiry = Enquiry.objects.get(pk=pk)
        except Enquiry.DoesNotExist:
            return Response({'detail': 'Enquiry not found.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = EnquiryAdminSerializer(enquiry, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            enquiry = Enquiry.objects.get(pk=pk)
        except Enquiry.DoesNotExist:
            return Response({'detail': 'Enquiry not found.'}, status=status.HTTP_404_NOT_FOUND)

        enquiry.delete()
        return Response({'detail': 'Enquiry deleted successfully.'}, status=status.HTTP_200_OK)


# =========================================================
# 6. ADMIN EXCEL / CSV EXPORT API
# =========================================================
class AdminEnquiryExportCSVView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        queryset = _get_filtered_enquiries(request)

        today_str = timezone.localdate().strftime('%Y-%m-%d')
        response = HttpResponse(content_type='text/csv; charset=utf-8')
        response['Content-Disposition'] = f'attachment; filename="cognisphere_enquiries_{today_str}.csv"'
        response.write('\ufeff')

        writer = csv.writer(response)
        writer.writerow([
            'ID', 'Full Name', 'Email', 'WhatsApp Number', 'Preferred Course',
            'Batch', 'City', 'Source', 'Status', 'Notes', 'Registered At',
        ])

        for item in queryset:
            local_dt = timezone.localtime(item.created_at).strftime('%d-%m-%Y %I:%M %p')
            batch_name = f"{item.batch.course_name} ({item.batch.date_range})" if item.batch else '-'
            writer.writerow([
                item.id, item.full_name, item.email, item.whatsapp_number,
                item.preferred_course, batch_name, item.city, item.source,
                item.get_status_display(), item.notes, local_dt,
            ])

        return response

    # =========================================================
# 6. PUBLIC AI CHATBOT API (Gemini + Live DB + Smart Fallback)
# =========================================================
class ChatbotView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        message = (request.data.get('message') or '').strip()
        history = request.data.get('history') or []
        turn_count = int(request.data.get('turn_count') or 1)

        if not message:
            return Response({'detail': 'Please enter a message.'}, status=status.HTTP_400_BAD_REQUEST)

        result = generate_ai_chat_reply(message, history=history, turn_count=turn_count)
        return Response(result, status=status.HTTP_200_OK)

    # =========================================================
# 7. HSE JOBS PORTAL APIs (Public View + Admin CRUD)
# =========================================================
class JobListPublicView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        jobs = JobListing.objects.filter(is_active=True)
        serializer = JobListingSerializer(jobs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class AdminJobListCreateView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        jobs = JobListing.objects.all()
        serializer = JobListingSerializer(jobs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = JobListingSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AdminJobDetailView(APIView):
    permission_classes = [IsAdminUser]

    def patch(self, request, pk):
        try:
            job = JobListing.objects.get(pk=pk)
        except JobListing.DoesNotExist:
            return Response({'detail': 'Job not found.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = JobListingSerializer(job, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            job = JobListing.objects.get(pk=pk)
        except JobListing.DoesNotExist:
            return Response({'detail': 'Job not found.'}, status=status.HTTP_404_NOT_FOUND)
        job.delete()
        return Response({'detail': 'Job deleted successfully.'}, status=status.HTTP_200_OK)