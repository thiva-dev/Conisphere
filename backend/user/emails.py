import threading
import traceback
import requests
from django.conf import settings
from django.utils import timezone
from django.utils.html import escape

BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email'


def _send_via_brevo(api_key, sender_name, sender_email, to_email, reply_to_email, reply_to_name, subject, html_body, plain_body):
    resp = requests.post(
        BREVO_API_URL,
        headers={
            'api-key': api_key,
            'Content-Type': 'application/json',
            'accept': 'application/json',
        },
        json={
            'sender': {'name': sender_name, 'email': sender_email},
            'to': [{'email': to_email}],
            'replyTo': {'email': reply_to_email, 'name': reply_to_name},
            'subject': subject,
            'htmlContent': html_body,
            'textContent': plain_body,
        },
        timeout=10,
    )
    if resp.status_code not in (200, 201, 202):
        raise RuntimeError(f"Brevo API {resp.status_code}: {resp.text}")


def _send_emails_task(enquiry):
    created_str = timezone.localtime(enquiry.created_at).strftime('%d %b %Y, %I:%M %p')
    batch_text = f"{enquiry.batch.course_name} ({enquiry.batch.date_range})" if getattr(enquiry, 'batch', None) else 'Not Selected'

    team_recipients = list(dict.fromkeys([
        email for email in [settings.ADMIN_EMAIL, *settings.OFFICE_TEAM_EMAILS] if email
    ]))

    subject_team = f"New HSE Course Enquiry from {enquiry.full_name}"
    plain_team = (
        f"New Student Enquiry Received\n"
        f"----------------------------\n"
        f"Name     : {enquiry.full_name}\n"
        f"Email    : {enquiry.email}\n"
        f"WhatsApp : {enquiry.whatsapp_number}\n"
        f"Course   : {enquiry.preferred_course or 'Not Specified'}\n"
        f"Batch    : {batch_text}\n"
        f"City     : {enquiry.city or 'Not Specified'}\n"
        f"Source   : {enquiry.source}\n"
        f"Notes    : {enquiry.notes or '-'}\n"
        f"Time     : {created_str}\n"
    )

    html_team = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e4dcf3; border-radius: 12px; overflow: hidden;">
      <div style="background: #211859; color: #ffffff; padding: 18px 24px;">
        <h2 style="margin: 0; font-size: 18px;">New Student Registration Alert</h2>
        <p style="margin: 4px 0 0; font-size: 12px; color: #e2daf3;">Cognisphere Management and Consultancy</p>
      </div>
      <div style="padding: 20px 24px; background: #ffffff;">
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr><td style="padding: 8px; border-bottom: 1px solid #f0ebf8; font-weight: bold; color: #211859;">Full Name</td><td style="padding: 8px; border-bottom: 1px solid #f0ebf8;">{escape(enquiry.full_name)}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #f0ebf8; font-weight: bold; color: #211859;">Email</td><td style="padding: 8px; border-bottom: 1px solid #f0ebf8;">{escape(enquiry.email)}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #f0ebf8; font-weight: bold; color: #211859;">WhatsApp</td><td style="padding: 8px; border-bottom: 1px solid #f0ebf8;">{escape(enquiry.whatsapp_number)}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #f0ebf8; font-weight: bold; color: #211859;">Course</td><td style="padding: 8px; border-bottom: 1px solid #f0ebf8; color: #a62675; font-weight: bold;">{escape(enquiry.preferred_course or 'Not Specified')}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #f0ebf8; font-weight: bold; color: #211859;">Batch</td><td style="padding: 8px; border-bottom: 1px solid #f0ebf8;">{escape(batch_text)}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #f0ebf8; font-weight: bold; color: #211859;">City</td><td style="padding: 8px; border-bottom: 1px solid #f0ebf8;">{escape(enquiry.city or 'Not Specified')}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #f0ebf8; font-weight: bold; color: #211859;">Source</td><td style="padding: 8px; border-bottom: 1px solid #f0ebf8;">{escape(enquiry.source)}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #f0ebf8; font-weight: bold; color: #211859;">Notes</td><td style="padding: 8px; border-bottom: 1px solid #f0ebf8;">{escape(enquiry.notes or '-')}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold; color: #211859;">Registered At</td><td style="padding: 8px;">{escape(created_str)}</td></tr>
        </table>
      </div>
    </div>
    """

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

    api_key = getattr(settings, 'BREVO_API_KEY', '')
    if not api_key:
        print("BREVO_API_KEY not set — Email preview:\n", plain_team)
        return

    try:
        for recipient in team_recipients:
            _send_via_brevo(
                api_key, settings.SENDER_NAME, settings.SENDER_EMAIL,
                recipient, enquiry.email, enquiry.full_name,
                subject_team, html_team, plain_team
            )

        if enquiry.email:
            _send_via_brevo(
                api_key, settings.SENDER_NAME, settings.SENDER_EMAIL,
                enquiry.email, settings.ADMIN_EMAIL, settings.SENDER_NAME,
                subject_student, html_student, plain_student
            )

        print(f"SUCCESS (Brevo HTTPS): Sent to {team_recipients} & {enquiry.email}")
    except Exception as exc:
        print(f"EMAIL ERROR (Brevo): {exc}")
        traceback.print_exc()


def send_enquiry_emails_async(enquiry):
    threading.Thread(target=_send_emails_task, args=(enquiry,), daemon=True).start()