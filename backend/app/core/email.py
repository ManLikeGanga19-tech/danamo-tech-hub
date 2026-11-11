import logging
from typing import Optional
import resend
from app.core.config import settings

logger = logging.getLogger(__name__)

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
<title>{title}</title>
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


async def _send(to: str, subject: str, html: str, reply_to: Optional[str] = None) -> bool:
    """Internal send wrapper. Never raises — logs errors instead."""
    if not settings.resend_api_key:
        logger.warning(f"[email] RESEND_API_KEY missing — skipped email to {to}")
        return False
    try:
        params = {
            "from": f"Danamo Tech <{settings.resend_from_email}>",
            "to": [to],
            "subject": subject,
            "html": html,
        }
        if reply_to:
            params["reply_to"] = reply_to
        resend.Emails.send(params)
        logger.info(f"[email] Sent '{subject}' to {to}")
        return True
    except Exception as e:
        logger.error(f"[email] Failed to send to {to}: {e}")
        return False


# ─── CONTACT FORM ─────────────────────────────────────────────────

async def send_contact_notification(name: str, email: str, subject: str, message: str) -> bool:
    """Notify the admin team of a new contact form submission."""
    body = f"""
    <h2 style="margin:0 0 16px 0; font-size:20px; color:{DARK};">New Contact Form Message</h2>
    <p style="margin:0 0 24px 0; font-size:15px; color:{GRAY}; line-height:1.6;">
      Someone has submitted a message through the website contact form.
    </p>
    <table style="width:100%; margin-bottom:24px; border-collapse:collapse;">
      <tr>
        <td style="padding:12px 0; border-bottom:1px solid #e2e8f0; font-size:14px; color:{GRAY}; width:100px;">Name:</td>
        <td style="padding:12px 0; border-bottom:1px solid #e2e8f0; font-size:14px; color:{DARK}; font-weight:600;">{name}</td>
      </tr>
      <tr>
        <td style="padding:12px 0; border-bottom:1px solid #e2e8f0; font-size:14px; color:{GRAY};">Email:</td>
        <td style="padding:12px 0; border-bottom:1px solid #e2e8f0; font-size:14px; color:{BLUE};"><a href="mailto:{email}" style="color:{BLUE};">{email}</a></td>
      </tr>
      <tr>
        <td style="padding:12px 0; border-bottom:1px solid #e2e8f0; font-size:14px; color:{GRAY};">Subject:</td>
        <td style="padding:12px 0; border-bottom:1px solid #e2e8f0; font-size:14px; color:{DARK};">{subject}</td>
      </tr>
    </table>
    <div style="background:{LIGHT_BG}; border-left:4px solid {BLUE}; padding:16px 20px; border-radius:6px;">
      <p style="margin:0; font-size:15px; color:{DARK}; line-height:1.7; white-space:pre-wrap;">{message}</p>
    </div>
    <p style="margin:24px 0 0 0; font-size:13px; color:{GRAY};">
      Reply directly to this email to respond to {name}.
    </p>
    """
    html = _wrap_html(f"New contact from {name}", body)
    return await _send(settings.admin_notification_email, f"New Contact: {subject}", html, reply_to=email)


# ─── CAREER APPLICATION ───────────────────────────────────────────

async def send_application_received(name: str, email: str, role: str) -> bool:
    """Acknowledge receipt of a job application."""
    body = f"""
    <h2 style="margin:0 0 16px 0; font-size:20px; color:{DARK};">Application Received</h2>
    <p style="margin:0 0 16px 0; font-size:15px; color:{GRAY}; line-height:1.7;">
      Hi {name},
    </p>
    <p style="margin:0 0 24px 0; font-size:15px; color:{GRAY}; line-height:1.7;">
      Thank you for applying for the <strong style="color:{DARK};">{role}</strong> position at Danamo Tech.
      We have received your application and CV, and our hiring team is reviewing it.
    </p>
    <p style="margin:0 0 24px 0; font-size:15px; color:{GRAY}; line-height:1.7;">
      If your experience aligns with what we are looking for, we will reach out within
      <strong style="color:{DARK};">7-10 business days</strong> to schedule a conversation.
    </p>
    <p style="margin:0 0 8px 0; font-size:15px; color:{GRAY}; line-height:1.7;">
      In the meantime, feel free to explore our work at
      <a href="{settings.frontend_url}/projects" style="color:{BLUE}; text-decoration:none; font-weight:600;">danamotech.co.ke/projects</a>.
    </p>
    <p style="margin:24px 0 0 0; font-size:15px; color:{GRAY}; line-height:1.7;">
      Best regards,<br>
      <strong style="color:{DARK};">The Danamo Tech Hiring Team</strong>
    </p>
    """
    html = _wrap_html("Application Received", body)
    return await _send(email, f"We received your application — {role}", html)


async def send_application_notification(name: str, email: str, role: str, phone: str | None = None) -> bool:
    """Notify the admin team of a new application."""
    phone_row = f"""
      <tr>
        <td style="padding:12px 0; border-bottom:1px solid #e2e8f0; font-size:14px; color:{GRAY};">Phone:</td>
        <td style="padding:12px 0; border-bottom:1px solid #e2e8f0; font-size:14px; color:{DARK};">{phone}</td>
      </tr>
    """ if phone else ""

    body = f"""
    <h2 style="margin:0 0 16px 0; font-size:20px; color:{DARK};">New Job Application</h2>
    <p style="margin:0 0 24px 0; font-size:15px; color:{GRAY}; line-height:1.6;">
      A new candidate has applied through the Careers page.
    </p>
    <table style="width:100%; margin-bottom:24px; border-collapse:collapse;">
      <tr>
        <td style="padding:12px 0; border-bottom:1px solid #e2e8f0; font-size:14px; color:{GRAY}; width:100px;">Name:</td>
        <td style="padding:12px 0; border-bottom:1px solid #e2e8f0; font-size:14px; color:{DARK}; font-weight:600;">{name}</td>
      </tr>
      <tr>
        <td style="padding:12px 0; border-bottom:1px solid #e2e8f0; font-size:14px; color:{GRAY};">Email:</td>
        <td style="padding:12px 0; border-bottom:1px solid #e2e8f0; font-size:14px; color:{BLUE};"><a href="mailto:{email}" style="color:{BLUE};">{email}</a></td>
      </tr>
      {phone_row}
      <tr>
        <td style="padding:12px 0; border-bottom:1px solid #e2e8f0; font-size:14px; color:{GRAY};">Role:</td>
        <td style="padding:12px 0; border-bottom:1px solid #e2e8f0; font-size:14px; color:{DARK}; font-weight:600;">{role}</td>
      </tr>
    </table>
    <p style="margin:0; font-size:14px; color:{GRAY};">
      Log into the <a href="{settings.frontend_url}/admin/careers" style="color:{BLUE}; font-weight:600;">admin dashboard</a> to download the CV and review the full application.
    </p>
    """
    html = _wrap_html(f"New application from {name}", body)
    return await _send(settings.admin_notification_email, f"New Application: {role}", html, reply_to=email)


# ─── WEBINAR REGISTRATION ─────────────────────────────────────────

async def send_webinar_registration(name: str, email: str, webinar_title: str, date: str, time: str, join_url: str | None) -> bool:
    """Confirm webinar registration and share the join link."""
    join_section = ""
    if join_url:
        join_section = f"""
        <div style="text-align:center; margin:32px 0;">
          <a href="{join_url}" style="display:inline-block; background:{BLUE}; color:#ffffff; text-decoration:none; padding:14px 32px; border-radius:8px; font-weight:600; font-size:15px;">
            Join Webinar
          </a>
          <p style="margin:12px 0 0 0; font-size:12px; color:{GRAY};">
            Or copy this link: <br>
            <span style="font-family:monospace; color:{BLUE};">{join_url}</span>
          </p>
        </div>
        """
    else:
        join_section = f"""
        <div style="background:#fef3c7; border-left:4px solid #f59e0b; padding:16px 20px; border-radius:6px; margin:24px 0;">
          <p style="margin:0; font-size:14px; color:#92400e; line-height:1.6;">
            <strong>The joining link will be sent to you 24 hours before the event.</strong>
          </p>
        </div>
        """

    body = f"""
    <h2 style="margin:0 0 16px 0; font-size:20px; color:{DARK};">You're Registered</h2>
    <p style="margin:0 0 16px 0; font-size:15px; color:{GRAY}; line-height:1.7;">
      Hi {name},
    </p>
    <p style="margin:0 0 24px 0; font-size:15px; color:{GRAY}; line-height:1.7;">
      Your spot is confirmed for the upcoming webinar:
    </p>
    <div style="background:{LIGHT_BG}; padding:20px; border-radius:8px; margin-bottom:24px; text-align:center;">
      <h3 style="margin:0 0 8px 0; font-size:18px; color:{DARK};">{webinar_title}</h3>
      <p style="margin:0; font-size:14px; color:{GRAY};">{date} &middot; {time}</p>
    </div>
    {join_section}
    <p style="margin:32px 0 0 0; font-size:15px; color:{GRAY}; line-height:1.7;">
      We look forward to seeing you there.<br>
      <strong style="color:{DARK};">The Danamo Tech Team</strong>
    </p>
    """
    html = _wrap_html("Webinar Registration Confirmed", body)
    return await _send(email, f"Confirmed: {webinar_title}", html)


# ─── NEWSLETTER ───────────────────────────────────────────────────

async def send_newsletter_welcome(email: str) -> bool:
    """Welcome new newsletter subscribers."""
    body = f"""
    <h2 style="margin:0 0 16px 0; font-size:20px; color:{DARK};">Welcome to the Danamo Newsletter</h2>
    <p style="margin:0 0 16px 0; font-size:15px; color:{GRAY}; line-height:1.7;">
      Thanks for subscribing.
    </p>
    <p style="margin:0 0 24px 0; font-size:15px; color:{GRAY}; line-height:1.7;">
      You will now receive curated insights on technology trends, product launches, and engineering
      best practices — straight from the Danamo Tech team. We send only when we have something genuinely
      worth your time.
    </p>
    <p style="margin:0 0 8px 0; font-size:15px; color:{GRAY}; line-height:1.7;">
      To explore what we do, visit
      <a href="{settings.frontend_url}/projects" style="color:{BLUE}; text-decoration:none; font-weight:600;">our case studies</a>.
    </p>
    <p style="margin:32px 0 0 0; font-size:15px; color:{GRAY}; line-height:1.7;">
      Talk soon,<br>
      <strong style="color:{DARK};">Danamo Tech</strong>
    </p>
    """
    html = _wrap_html("Welcome to Danamo", body)
    return await _send(email, "Welcome to the Danamo Tech Newsletter", html)


async def send_newsletter_notification(email: str) -> bool:
    """Notify admin of new subscriber."""
    body = f"""
    <h2 style="margin:0 0 16px 0; font-size:20px; color:{DARK};">New Newsletter Subscriber</h2>
    <p style="margin:0 0 16px 0; font-size:15px; color:{GRAY}; line-height:1.6;">
      <strong style="color:{BLUE};">{email}</strong> has just subscribed to the newsletter.
    </p>
    <p style="margin:0; font-size:13px; color:{GRAY};">
      Manage your subscriber list in the <a href="{settings.frontend_url}/admin/newsletter" style="color:{BLUE};">admin dashboard</a>.
    </p>
    """
    html = _wrap_html("New Subscriber", body)
    return await _send(settings.admin_notification_email, f"New subscriber: {email}", html)
