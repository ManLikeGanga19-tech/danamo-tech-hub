"""Transactional email via Resend.

Every value that comes from a visitor is HTML-escaped before it is placed in
a template (otherwise a form submission could inject links or markup into a
branded Danamo email sent to any address). Sending happens in a background
thread so API responses never wait on Resend; failures are logged, never
raised.
"""

import asyncio
import html
import logging
from typing import Optional

import resend

from app.core.config import settings

logger = logging.getLogger(__name__)

# Strong references to in-flight sends (asyncio only keeps weak ones).
_pending: set[asyncio.Task] = set()


def _e(value: object) -> str:
    """Escape untrusted text for HTML."""
    return html.escape(str(value or ""), quote=True)


def _subject(text: str) -> str:
    """Single-line, bounded subject."""
    return " ".join(str(text).split())[:150]


def _mask(addr: str) -> str:
    local, _, domain = addr.partition("@")
    return f"{local[:2]}***@{domain}" if domain else "***"

resend.api_key = settings.resend_api_key

# Brand colors
BLUE = "#2563eb"
DARK = "#0f172a"
GRAY = "#64748b"
LIGHT_BG = "#f8fafc"


def _wrap_html(title: str, body_html: str) -> str:
    """Wrap content in the shared branded shell."""
    return f"""
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{_e(title)}</title>
</head>
<body style="margin:0; padding:0; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif; background-color:{LIGHT_BG}; color:{DARK};">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:{LIGHT_BG}; padding:40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px; width:100%; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 1px 3px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,{BLUE} 0%,#1d4ed8 100%); padding:32px 40px; text-align:center;">
              <h1 style="margin:0; color:#ffffff; font-size:22px; font-weight:700; letter-spacing:-0.02em;">
                Danamo <span style="color:#93c5fd;">Tech</span>
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 32px 40px;">
              {body_html}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:{LIGHT_BG}; padding:24px 40px; text-align:center; border-top:1px solid #e2e8f0;">
              <p style="margin:0 0 8px 0; font-size:12px; color:{GRAY};">
                &copy; Danamo Tech Ltd &middot; Mombasa, Kenya
              </p>
              <p style="margin:0; font-size:11px; color:{GRAY};">
                <a href="{settings.frontend_url}/privacy" style="color:{GRAY}; text-decoration:underline;">Privacy Policy</a> &middot;
                <a href="{settings.frontend_url}/terms" style="color:{GRAY}; text-decoration:underline;">Terms</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
"""


def _send_blocking(params: dict) -> None:
    to = params["to"][0]
    try:
        resend.Emails.send(params)
        logger.info("[email] Sent %r to %s", params["subject"], _mask(to))
    except Exception as exc:  # never let email break a request
        logger.error("[email] Failed to send %r to %s: %s", params["subject"], _mask(to), exc)


async def _send(to: str, subject: str, html_body: str, reply_to: Optional[str] = None) -> bool:
    """Queue an email in the background. Returns False only if email is disabled."""
    if not settings.resend_api_key:
        logger.warning("[email] RESEND_API_KEY missing - skipped email to %s", _mask(to))
        return False
    params = {
        "from": f"Danamo Tech <{settings.resend_from_email}>",
        "to": [to],
        "subject": _subject(subject),
        "html": html_body,
    }
    if reply_to:
        params["reply_to"] = reply_to
    task = asyncio.create_task(asyncio.to_thread(_send_blocking, params))
    _pending.add(task)
    task.add_done_callback(_pending.discard)
    return True


# Shared bits ------------------------------------------------------

_ROW = (
    '<tr><td style="padding:12px 0; border-bottom:1px solid #e2e8f0; font-size:14px; color:{gray}; width:110px;">{label}</td>'
    '<td style="padding:12px 0; border-bottom:1px solid #e2e8f0; font-size:14px; color:{dark};">{value}</td></tr>'
)


def _rows(*pairs: tuple[str, str]) -> str:
    """Detail table. Values must already be escaped/trusted HTML."""
    inner = "".join(_ROW.format(gray=GRAY, dark=DARK, label=label, value=value) for label, value in pairs)
    return f'<table style="width:100%; margin-bottom:24px; border-collapse:collapse;">{inner}</table>'


def _mailto(addr: str) -> str:
    a = _e(addr)
    return f'<a href="mailto:{a}" style="color:{BLUE};">{a}</a>'


def _quote(text: str) -> str:
    return (
        f'<div style="background:{LIGHT_BG}; border-left:4px solid {BLUE}; padding:16px 20px; border-radius:6px;">'
        f'<p style="margin:0; font-size:15px; color:{DARK}; line-height:1.7; white-space:pre-wrap;">{_e(text)}</p></div>'
    )


def _p(text_html: str, margin: str = "0 0 16px 0") -> str:
    return f'<p style="margin:{margin}; font-size:15px; color:{GRAY}; line-height:1.7;">{text_html}</p>'


def _signoff(team: str = "The Danamo Tech Team") -> str:
    return _p(f'Best regards,<br><strong style="color:{DARK};">{team}</strong>', "24px 0 0 0")


def _h2(text: str) -> str:
    return f'<h2 style="margin:0 0 16px 0; font-size:20px; color:{DARK};">{text}</h2>'


def _admin_link(path: str, label: str = "admin dashboard") -> str:
    return f'<a href="{settings.admin_url}{path}" style="color:{BLUE}; font-weight:600;">{label}</a>'


def _humanize(slug: str) -> str:
    return " ".join(part.capitalize() for part in str(slug).replace("_", "-").split("-") if part)


# ─── CONTACT FORM ─────────────────────────────────────────────────

async def send_contact_notification(name: str, email: str, subject: str, message: str) -> bool:
    """Notify the team of a new contact form submission."""
    body = (
        _h2("New Contact Form Message")
        + _p("Someone has submitted a message through the website contact form.", "0 0 24px 0")
        + _rows(("Name:", f"<strong>{_e(name)}</strong>"), ("Email:", _mailto(email)), ("Subject:", _e(subject)))
        + _quote(message)
        + _p(f"Reply directly to this email to respond to {_e(name)}, or open the {_admin_link('/messages')}.", "24px 0 0 0")
    )
    return await _send(settings.admin_notification_email, f"New Contact: {subject}", _wrap_html("New contact message", body), reply_to=email)


async def send_contact_received(name: str, email: str, subject: str) -> bool:
    """Confirm to the visitor that their message arrived."""
    body = (
        _h2("We received your message")
        + _p(f"Hi {_e(name)},")
        + _p(
            f'Thank you for contacting Danamo Tech. We have received your message about '
            f'<strong style="color:{DARK};">{_e(subject)}</strong> and a member of our team will get back to you '
            f'within <strong style="color:{DARK};">1-2 business days</strong>.'
        )
        + _p(f'If it is urgent, reply to this email or write to <a href="mailto:{settings.admin_notification_email}" style="color:{BLUE};">{settings.admin_notification_email}</a>.')
        + _signoff()
    )
    return await _send(email, "We received your message - Danamo Tech", _wrap_html("Message received", body), reply_to=settings.admin_notification_email)


# ─── SERVICE INQUIRY ──────────────────────────────────────────────

async def send_service_inquiry_notification(name: str, email: str, company: str | None, service: str, message: str) -> bool:
    body = (
        _h2("New Service Inquiry")
        + _rows(
            ("Name:", f"<strong>{_e(name)}</strong>"),
            ("Email:", _mailto(email)),
            ("Company:", _e(company) or "&mdash;"),
            ("Service:", _e(_humanize(service))),
        )
        + _quote(message)
        + _p(f"Reply directly to this email to respond to {_e(name)}.", "24px 0 0 0")
    )
    return await _send(settings.admin_notification_email, f"New Inquiry: {_humanize(service)}", _wrap_html("New service inquiry", body), reply_to=email)


async def send_service_inquiry_received(name: str, email: str, service: str) -> bool:
    body = (
        _h2("Thanks for your inquiry")
        + _p(f"Hi {_e(name)},")
        + _p(
            f'Thank you for your interest in our <strong style="color:{DARK};">{_e(_humanize(service))}</strong> services. '
            f'We have received your inquiry and will get back to you within <strong style="color:{DARK};">1-2 business days</strong> '
            "to discuss your project."
        )
        + _p(f'Meanwhile, see what we have built in <a href="{settings.frontend_url}/projects" style="color:{BLUE}; font-weight:600;">our projects</a>.')
        + _signoff()
    )
    return await _send(email, "We received your inquiry - Danamo Tech", _wrap_html("Inquiry received", body), reply_to=settings.admin_notification_email)


# ─── CAREER APPLICATION ───────────────────────────────────────────

async def send_application_received(name: str, email: str, role: str) -> bool:
    """Acknowledge receipt of a job application and CV."""
    role_txt = _e(_humanize(role))
    body = (
        _h2("Application Received")
        + _p(f"Hi {_e(name)},")
        + _p(
            f'Thank you for applying for the <strong style="color:{DARK};">{role_txt}</strong> position at Danamo Tech. '
            "We have received your application and CV, and our hiring team is reviewing it."
        )
        + _p(
            "If your experience aligns with what we are looking for, we will reach out within "
            f'<strong style="color:{DARK};">7-10 business days</strong> to schedule a conversation.'
        )
        + _p(f'In the meantime, feel free to explore <a href="{settings.frontend_url}/projects" style="color:{BLUE}; font-weight:600;">our work</a>.')
        + _signoff("The Danamo Tech Hiring Team")
    )
    return await _send(email, f"We received your application - {_humanize(role)}", _wrap_html("Application received", body), reply_to=settings.admin_notification_email)


async def send_application_notification(name: str, email: str, role: str, phone: str | None = None) -> bool:
    """Notify the team of a new application."""
    pairs = [("Name:", f"<strong>{_e(name)}</strong>"), ("Email:", _mailto(email))]
    if phone:
        pairs.append(("Phone:", _e(phone)))
    pairs.append(("Role:", f"<strong>{_e(_humanize(role))}</strong>"))
    body = (
        _h2("New Job Application")
        + _p("A new candidate has applied through the Careers page.", "0 0 24px 0")
        + _rows(*pairs)
        + _p(f"Open the {_admin_link('/careers')} to download the CV and review the application.", "0")
    )
    return await _send(settings.admin_notification_email, f"New Application: {_humanize(role)}", _wrap_html("New application", body), reply_to=email)


# ─── WEBINAR REGISTRATION ─────────────────────────────────────────

async def send_webinar_registration(name: str, email: str, webinar_title: str, date: str, time: str, join_url: str | None) -> bool:
    """Confirm webinar registration and share the join link (admin-set fields)."""
    if join_url and join_url.startswith(("https://", "http://")):
        url = _e(join_url)
        join_section = (
            '<div style="text-align:center; margin:32px 0;">'
            f'<a href="{url}" style="display:inline-block; background:{BLUE}; color:#ffffff; text-decoration:none; padding:14px 32px; border-radius:8px; font-weight:600; font-size:15px;">Join Webinar</a>'
            f'<p style="margin:12px 0 0 0; font-size:12px; color:{GRAY};">Or copy this link:<br><span style="font-family:monospace; color:{BLUE};">{url}</span></p>'
            "</div>"
        )
    else:
        join_section = (
            '<div style="background:#fef3c7; border-left:4px solid #f59e0b; padding:16px 20px; border-radius:6px; margin:24px 0;">'
            '<p style="margin:0; font-size:14px; color:#92400e; line-height:1.6;"><strong>The joining link will be sent to you 24 hours before the event.</strong></p>'
            "</div>"
        )
    body = (
        _h2("You're Registered")
        + _p(f"Hi {_e(name)},")
        + _p("Your spot is confirmed for the upcoming webinar:", "0 0 24px 0")
        + f'<div style="background:{LIGHT_BG}; padding:20px; border-radius:8px; margin-bottom:24px; text-align:center;">'
        + f'<h3 style="margin:0 0 8px 0; font-size:18px; color:{DARK};">{_e(webinar_title)}</h3>'
        + f'<p style="margin:0; font-size:14px; color:{GRAY};">{_e(date)} &middot; {_e(time)}</p></div>'
        + join_section
        + _signoff()
    )
    return await _send(email, f"Confirmed: {webinar_title}", _wrap_html("Webinar registration confirmed", body))


# ─── NEWSLETTER ───────────────────────────────────────────────────

async def send_newsletter_welcome(email: str) -> bool:
    """Confirm a new newsletter subscription."""
    body = (
        _h2("You're subscribed")
        + _p(f'Thanks for subscribing to the Danamo Tech newsletter with <strong style="color:{DARK};">{_e(email)}</strong>.')
        + _p(
            "You will receive curated insights on technology trends, product launches, and engineering best practices "
            "from the Danamo Tech team. We only send when we have something genuinely worth your time."
        )
        + _p(f'To explore what we do, visit <a href="{settings.frontend_url}/projects" style="color:{BLUE}; font-weight:600;">our projects</a>.')
        + _p("Didn't subscribe? Just reply to this email and we'll remove you.", "16px 0 0 0")
        + _signoff()
    )
    return await _send(email, "Welcome to the Danamo Tech Newsletter", _wrap_html("Subscription confirmed", body), reply_to=settings.admin_notification_email)


async def send_newsletter_notification(email: str) -> bool:
    """Notify the team of a new subscriber."""
    body = (
        _h2("New Newsletter Subscriber")
        + _p(f'<strong style="color:{BLUE};">{_e(email)}</strong> has just subscribed to the newsletter.')
        + _p(f"Manage your subscriber list in the {_admin_link('/newsletter')}.", "0")
    )
    return await _send(settings.admin_notification_email, "New newsletter subscriber", _wrap_html("New subscriber", body))
