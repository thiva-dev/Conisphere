import requests
from django.conf import settings
from .models import Batch


def _build_live_batches_text():
    batches = Batch.objects.filter(is_active=True).order_by('display_order', 'id')
    if not batches.exists():
        return "Currently no active batches listed. Please contact our office WhatsApp (+91 90431 33663) for upcoming dates."

    lines = []
    for b in batches:
        seat_info = "Easy to Book (Monthly Intake)" if b.is_flexible else f"{b.seats_left}/{b.total_seats} seats left"
        lines.append(f"- {b.course_name} | {b.schedule_days} | {b.date_range} | {b.mode} | {seat_info}")
    return "\n".join(lines)


def _get_system_prompt():
    live_batches = _build_live_batches_text()
    return f"""You are "Cognisphere AI", the official intelligent academic & career advisor for Cognisphere Management and Consultancy (cognispheremc.com).

CORE PERSONALITY & RULES:
1. Talk like ChatGPT/Gemini: warm, smart, crisp, helpful, and structured (use short bullet points and bold highlights).
2. Understand casual English, short queries, and spelling typos effortlessly, and ALWAYS converse strictly in clean, polite, professional English only.
3. If someone writes in regional slang or another language, always respond strictly in clear, professional English.
4. NEVER invent fake fees, discounts, or fake dates. If asked about exact course fees, discounts, installment plans, or personal document eligibility, give helpful general course context and warmly advise contacting our official Admissions WhatsApp (+91 90431 33663).
5. Keep answers concise (3–6 lines max unless syllabus/dates are asked) so it reads great inside a chat widget.

OFFICIAL COGNISPHERE KNOWLEDGE BASE:
- Brand & Accreditation: Cognisphere Management and Consultancy — Proud NEBOSH Gold Learning Partner (ID: 1844), IOSH Approved Training Provider (5331), Highfield International Approved Centre (37570), BCSP (ASP/CSP), Approved Code TN/GCC/97525, ISO 9001:2015 Certified.
- Training Mode: 100% Live Interactive Online Classes (learn from anywhere — India, Dubai, Abu Dhabi, GCC & Worldwide) with recorded revision sessions, digital study materials, mock exams, and 1-to-1 academic support.
- Courses Offered:
  1) NEBOSH: NEBOSH IGC (International General Certificate — 1 Month / 11 Units, 89% First-Time Pass Rate, 4.6/5 Rating), NEBOSH HSW (Health & Safety at Work — monthly batches).
  2) OSHA: OSHA 30hrs General Industry, OSHA 10hrs General Industry, OSHA 30hrs Construction Industry, OSHA 10hrs Construction Industry.
  3) IOSH: IOSH Managing Safely.
  4) Highfield International: Level 4 Award (Health & Safety in the Workplace, Food Safety Manufacturing, HACCP Catering, Managing Food Safety Catering), Level 3 Award (Delivering Training – IADT, HACCP Catering/Manufacturing, First Aid & AED), Level 2 Award (Risk Assessment, Fire Safety, COSHH).
  5) National Diploma: Post Diploma, Advanced Diploma, Diploma in Fire and Industrial Safety, Diploma in Fire and Safety.
  6) ISO: ISO 9001:2015 QMS, ISO 14001:2015 EMS, ISO 45001:2018 OHSMS.
  7) BCSP: Associate Safety Professional (ASP), Certified Safety Professional (CSP).
- NEBOSH IGC Syllabus & Assessment:
  * Unit GIC 1 (Management of Health & Safety): 4 elements — 24-hour scenario-based Open Book Exam (OBE).
  * Unit GIC 2 (Risk Assessment): 7 elements (Physical/Psychological, Musculoskeletal, Chemical/Biological, General Workplace, Work Equipment, Fire, Electricity) — Practical risk assessment submitted within 10 working days after GIC 1 (60% pass mark).
  * Results: Issued together 60 working days after GIC 1.
  * Recognition: SQA / SCQF Level 6 (11 credits), AIIRSM, AIOSH, Tech IOSH (with experience).
- NEBOSH IGC 2026–2027 Exam Dates: Aug 05 2026, Oct 07 2026, Nov 04 2026, Jan 06 2027, Feb 03 2027, Apr 07 2027, May 05 2027, Jul 07 2027, Aug 04 2027, Oct 06 2027, Nov 03 2027.
- Live Upcoming Batches (FROM LIVE DATABASE RIGHT NOW):
{live_batches}
- Placement & Career Support: Dedicated safety job portal & career guidance for India, Dubai, UAE & GCC mega projects (collaborations with TATA Hitachi, IndianOil, Mainett, PI Industries, etc.).
- Locations & Contacts: Dubai, Abu Dhabi, Delhi, Mumbai, Chennai, Bangalore, Hyderabad, Kochi, Kolkata, Pune, Patna, Coimbatore, Madurai, Trichy.
  * Main Admissions WhatsApp & Call: +91 90431 33663 (Advisor: Ms. Jaya Bharathi) | Email: info@cognispheremc.com
"""


def _try_gemini_reply(api_key, system_prompt, history, user_message):
    if not api_key:
        return None
    try:
        contents = []
        for item in history[-8:]:
            role = 'model' if item.get('sender') == 'bot' else 'user'
            text = str(item.get('text', '')).strip()
            if text:
                contents.append({'role': role, 'parts': [{'text': text}]})
        contents.append({'role': 'user', 'parts': [{'text': user_message}]})

        resp = requests.post(
            'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
            headers={'x-goog-api-key': api_key, 'Content-Type': 'application/json'},
            json={
                'system_instruction': {'parts': [{'text': system_prompt}]},
                'contents': contents,
                'generationConfig': {'temperature': 0.45, 'maxOutputTokens': 420},
            },
            timeout=12,
        )
        if resp.status_code == 200:
            candidates = resp.json().get('candidates') or []
            if candidates:
                return candidates[0]['content']['parts'][0]['text'].strip()
    except Exception as exc:
        print(f"Gemini skipped -> trying Groq backup: {exc}")
    return None


def _try_groq_reply(api_key, system_prompt, history, user_message):
    if not api_key:
        return None
    try:
        messages = [{'role': 'system', 'content': system_prompt}]
        for item in history[-8:]:
            role = 'assistant' if item.get('sender') == 'bot' else 'user'
            text = str(item.get('text', '')).strip()
            if text:
                messages.append({'role': role, 'content': text})
        messages.append({'role': 'user', 'content': user_message})

        resp = requests.post(
            'https://api.groq.com/openai/v1/chat/completions',
            headers={
                'Authorization': f'Bearer {api_key}',
                'Content-Type': 'application/json',
            },
            json={
                'model': 'llama-3.3-70b-versatile',
                'messages': messages,
                'temperature': 0.45,
                'max_tokens': 420,
            },
            timeout=12,
        )
        if resp.status_code == 200:
            choices = resp.json().get('choices') or []
            if choices:
                return choices[0]['message']['content'].strip()
    except Exception as exc:
        print(f"Groq skipped -> using Local Smart Fallback: {exc}")
    return None


def _smart_fallback_reply(user_message):
    msg = user_message.lower()
    live_batches = _build_live_batches_text()

    if any(k in msg for k in ['fee', 'cost', 'price', 'amount', 'discount', 'installment', 'emi', 'pay']):
        return (
            "Course fees depend on the qualification (**NEBOSH IGC, NEBOSH HSW, IOSH, OSHA, Highfield, ISO, BCSP**) and current batch scholarship offers.\n\n"
            "• **100% Live Online Classes** + Digital Materials + Mock Exams included.\n"
            "• Connect with our **Admissions Team on WhatsApp (+91 90431 33663)** below for the exact fee structure & latest offer!",
            True,
        )

    if any(k in msg for k in ['batch', 'date', 'when', 'start', 'schedule', 'timing', 'seat', 'upcoming']):
        return (
            f"Here are our **Live Upcoming Online Batches**:\n\n{live_batches}\n\n"
            "• **Weekdays:** 08:30 PM – 11:30 PM IST | **Weekend:** Sunday\n"
            "Would you like to reserve a seat for one of these batches?",
            True,
        )

    if any(k in msg for k in ['exam', 'paper', 'result', 'obe', 'syllabus', 'gic', 'ig1', 'ig2', 'pass']):
        return (
            "**NEBOSH IGC Syllabus & 2026–2027 Exam Overview:**\n"
            "• **Unit GIC 1:** Management of Health & Safety (24-hr Open Book Exam)\n"
            "• **Unit GIC 2:** Risk Assessment (Practical submission within 10 working days; 60% pass mark)\n"
            "• **Upcoming 2026 Exams:** 05 Aug, 07 Oct, 04 Nov 2026 (2027 dates also available!)\n"
            "• **Our Track Record:** 89% First-Time Pass Rate as a **NEBOSH Gold Partner (1844)**.",
            False,
        )

    if any(k in msg for k in ['job', 'placement', 'salary', 'dubai', 'gulf', 'gcc', 'career', 'work']):
        return (
            "**Yes!** Cognisphere provides dedicated **HSE Job & Placement Support** across India, Dubai, UAE & GCC.\n"
            "• 90% of our NEBOSH graduates report career advancement within 12 months.\n"
            "• Recognized in **180+ countries** and eligible for **AIIRSM / AIOSH / Tech IOSH** memberships.",
            False,
        )

    if any(k in msg for k in ['course', 'nebosh', 'iosh', 'osha', 'highfield', 'iso', 'bcsp', 'diploma', 'hsw']):
        return (
            "As a **NEBOSH Gold Learning Partner (1844)**, we offer:\n"
            "• **NEBOSH:** IGC & HSW\n"
            "• **IOSH:** Managing Safely | **OSHA:** 10hr & 30hr (General & Construction)\n"
            "• **Highfield International** (Level 2, 3 & 4 Awards) | **BCSP** (ASP / CSP)\n"
            "• **National Diplomas** & **ISO 9001 / 14001 / 45001**\n\n"
            "Which course are you planning to take?",
            False,
        )

    if any(k in msg for k in ['contact', 'office', 'whatsapp', 'number', 'call', 'location', 'branch', 'address']):
        return (
            "You can reach our **Admissions Desk** directly:\n"
            "• **WhatsApp / Call:** +91 90431 33663\n"
            "• **Email:** info@cognispheremc.com\n"
            "• **Presence:** Dubai, Abu Dhabi, Chennai, Mumbai, Delhi, Bangalore, Hyderabad, Kochi, Kolkata, Pune, Coimbatore, Madurai & Trichy.",
            True,
        )

    return (
        "Welcome to **Cognisphere Management and Consultancy** (NEBOSH Gold Learning Partner 1844)! 👋\n\n"
        "I can help you with:\n"
        "• **Courses:** NEBOSH IGC/HSW, IOSH, OSHA, Highfield, ISO, BCSP\n"
        "• **Live Online Batches & Seat Availability**\n"
        "• **2026–2027 Exam Dates & Syllabus**\n"
        "• **Dubai/GCC & India Job Placement Support**\n\n"
        "How can I assist you today?",
        False,
    )


def generate_ai_chat_reply(user_message, history=None, turn_count=1):
    history = history or []
    lower_msg = user_message.lower()

    needs_escalation = turn_count >= 3 or any(
        w in lower_msg for w in ['fee', 'cost', 'price', 'discount', 'enroll', 'join', 'whatsapp', 'call', 'contact', 'speak', 'advisor']
    )

    system_prompt = _get_system_prompt()

    # 1st Brain: Google Gemini 2.5 Flash
    reply = _try_gemini_reply(getattr(settings, 'GEMINI_API_KEY', ''), system_prompt, history, user_message)
    if reply:
        return {'reply': reply, 'show_whatsapp': needs_escalation}

    # 2nd Backup Brain: Groq Llama 3.3 70B (ChatGPT-level, 14,400/day Free!)
    reply = _try_groq_reply(getattr(settings, 'GROQ_API_KEY', ''), system_prompt, history, user_message)
    if reply:
        return {'reply': reply, 'show_whatsapp': needs_escalation}

    # 3rd Emergency Safety Net: Built-in Smart Local Engine
    fallback_text, fallback_wa = _smart_fallback_reply(user_message)
    return {'reply': fallback_text, 'show_whatsapp': needs_escalation or fallback_wa}