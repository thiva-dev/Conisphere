import threading
import traceback
from django.conf import settings
from django.core.mail import EmailMultiAlternatives, get_connection
from django.utils.html import escape
from django.utils import timezone


def _send_emails_task(enquiry):
    created_str = timezone.localtime(enquiry.created_at).strftime('%d %b %Y, %I:%M %p')

    # Admin + Office Team list (duplicates remove pannum)
    team_recipients = list(dict.fromkeys([
        email for email in [settings.ADMIN_EMAIL, *settings.OFFICE_TEAM_EMAILS] if email
    ]))

    subject_team = f"New HSE Course Enquiry from {enquiry.full_name}"

    plain_team = (
        f"Hello Team,\n\n"
        f"A new student enquiry has been received on the Cognisphere website.\n\n"
        f"Name      : {enquiry.full_name}\n"
        f"Email     : {enquiry.email}\n"
        f"WhatsApp  : {enquiry.whatsapp_number}\n"
        f"Course    : {enquiry.preferred_course or 'Not Specified'}\n"
        f"City      : {enquiry.city or 'Not Specified'}\n"
        f"Source    : {enquiry.source}\n"
        f"Time      : {created_str}\n\n"
        f"Please follow up with the candidate within 24 hours."
    )

    html_team = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e4dcf3; border-radius: 12px; overflow: hidden;">
      <div style="background: #211859; color: #ffffff; padding: 18px 24px;">
        <h2 style="margin: 0; font-size: 18px;">New Student Registration Alert</h2>
        <p style="margin: 4px 0 0; font-size: 12px; color: #e2daf3;">Cognisphere Management and Consultancy</p>
      </div>
      <div style="padding: 20px 24px; background: #ffffff;">
        <p style="margin: 0 0 14px; font-size: 14px; color: #333;">Hello Team, a new candidate has submitted an enquiry:</p>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr><td style="padding: 8px; border-bottom: 1px solid #f0ebf8; font-weight: bold; color: #211859;">Full Name</td><td style="padding: 8px; border-bottom: 1px solid #f0ebf8;">{escape(enquiry.full_name)}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #f0ebf8; font-weight: bold; color: #211859;">Email</td><td style="padding: 8px; border-bottom: 1px solid #f0ebf8;">{escape(enquiry.email)}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #f0ebf8; font-weight: bold; color: #211859;">WhatsApp</td><td style="padding: 8px; border-bottom: 1px solid #f0ebf8;">{escape(enquiry.whatsapp_number)}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #f0ebf8; font-weight: bold; color: #211859;">Course</td><td style="padding: 8px; border-bottom: 1px solid #f0ebf8; color: #a62675; font-weight: bold;">{escape(enquiry.preferred_course or 'Not Specified')}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #f0ebf8; font-weight: bold; color: #211859;">City</td><td style="padding: 8px; border-bottom: 1px solid #f0ebf8;">{escape(enquiry.city or 'Not Specified')}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #f0ebf8; font-weight: bold; color: #211859;">Form Source</td><td style="padding: 8px; border-bottom: 1px solid #f0ebf8;">{escape(enquiry.source)}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold; color: #211859;">Registered At</td><td style="padding: 8px;">{escape(created_str)}</td></tr>
        </table>
      </div>
    </div>
    """

    # Student Auto-Reply Thank You Email
    subject_student = "Thank You for Enquiring with Cognisphere Management and Consultancy"
    plain_student = (
        f"Dear {enquiry.full_name},\n\n"
        f"Thank you for enquiring about {enquiry.preferred_course or 'our HSE Training Programs'} "
        f"with Cognisphere Management and Consultancy (NEBOSH Gold Learning Partner).\n\n"
        f"Our admissions advisor will contact you on WhatsApp ({enquiry.whatsapp_number}) within 24 hours.\n\n"
        f"Warm regards,\nCognisphere Admissions Team\n+91 90431 33663 | info@cognispheremc.com"
    )

    html_student = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e4dcf3; border-radius: 12px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #211859, #a62675); color: #ffffff; padding: 20px 24px;">
        <h2 style="margin: 0; font-size: 18px;">Thank You for Enquiring!</h2>
        <p style="margin: 4px 0 0; font-size: 12px;">NEBOSH Gold Learning Partner • Empowering Safety, Protecting Lives</p>
      </div>
      <div style="padding: 22px 24px; color: #211859; font-size: 14px; line-height: 1.6;">
        <p>Dear <strong>{escape(enquiry.full_name)}</strong>,</p>
        <p>Thank you for registering your interest in <strong>{escape(enquiry.preferred_course or 'our HSE Safety Certification')}</strong>.</p>
        <p>Our certified career advisor will reach out to you within <strong>24 hours</strong> on WhatsApp (<strong>{escape(enquiry.whatsapp_number)}</strong>) with batch timings, syllabus, and fee details.</p>
        <p style="margin-top: 20px; font-size: 13px; color: #555;">Warm regards,<br><strong>Cognisphere Admissions Team</strong><br>+91 90431 33663 | info@cognispheremc.com</p>
      </div>
    </div>
    """

    try:
        connection = get_connection(fail_silently=False)
        messages = []

        # Ovvoru Team Member-kum individual-aa clean To: address (No Bulk To: list!)
        for recipient in team_recipients:
            msg_team = EmailMultiAlternatives(
                subject=subject_team,
                body=plain_team,
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[recipient],
                reply_to=[enquiry.email],
            )
            msg_team.attach_alternative(html_team, 'text/html')
            messages.append(msg_team)

        # Student Auto-Reply Mail
        if enquiry.email:
            msg_student = EmailMultiAlternatives(
                subject=subject_student,
                body=plain_student,
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[enquiry.email],
                reply_to=[settings.ADMIN_EMAIL],
            )
            msg_student.attach_alternative(html_student, 'text/html')
            messages.append(msg_student)

        connection.send_messages(messages)
        print(f"SUCCESS: Individual emails sent to {team_recipients} & student {enquiry.email}!")
    except Exception as exc:
        print(f"EMAIL ERROR: {exc}")
        traceback.print_exc()


def send_enquiry_emails_async(enquiry):
    threading.Thread(target=_send_emails_task, args=(enquiry,), daemon=True).start()