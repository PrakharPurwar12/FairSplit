import logging
from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from decouple import config

logger = logging.getLogger(__name__)


class EmailService:
    @staticmethod
    def get_config_val(key, default=""):
        val = getattr(settings, key, None)
        if val is not None and str(val).strip() != "":
            return str(val).strip()
        try:
            cfg_val = config(key, default=default)
            if cfg_val is not None and str(cfg_val).strip() != "":
                return str(cfg_val).strip()
        except Exception:
            pass
        return default

    @classmethod
    def send_invitation_email(cls, invitation):
        """
        Dispatches a production-grade HTML and Plain-Text invitation email
        using Django's configured EmailBackend (SMTP / Gmail).
        """
        from_email = cls.get_config_val("DEFAULT_FROM_EMAIL", "FairSplit Team <noreply@fairsplit.com>")
        frontend_url = cls.get_config_val("FRONTEND_URL", "http://localhost").rstrip("/")
        host_user = cls.get_config_val("EMAIL_HOST_USER", "")
        host_password = cls.get_config_val("EMAIL_HOST_PASSWORD", "")

        # Check if SMTP credentials are set
        if not host_user or not host_password or host_user.strip() == "" or host_password.strip() == "":
            logger.warning("SMTP email backend is not configured (EMAIL_HOST_USER / EMAIL_HOST_PASSWORD missing). Email delivery disabled.")
            return False

        invite_link = f"{frontend_url}/invite/{invitation.invitation_token}"
        inviter_name = invitation.invited_by.get_full_name() or invitation.invited_by.username
        project_title = invitation.project.title
        role_name = invitation.role.title() if invitation.role else "Team Member"
        skills_str = ", ".join(invitation.skills) if invitation.skills else "General Responsibilities"
        personal_message = invitation.personal_message.strip() if invitation.personal_message else None

        # Build Plain Text Fallback
        plain_text = (
            f"You're invited to join {project_title} on FairSplit!\n\n"
            f"{inviter_name} has invited you to collaborate on FairSplit.\n\n"
            f"Role: {role_name}\n"
            f"Assigned Skills: {skills_str}\n"
        )
        if personal_message:
            plain_text += f"Message: \"{personal_message}\"\n"
        plain_text += f"\nAccept your invitation by visiting the link below:\n{invite_link}\n\n"
        plain_text += f"Note: This invitation will expire in 7 days.\n"

        # Build Modern HTML Template
        skills_chips_html = "".join([
            f'<span style="display:inline-block; background-color:#EFF6FF; color:#1D4ED8; font-size:12px; font-weight:600; padding:4px 10px; border-radius:9999px; margin-right:6px; margin-bottom:6px;">{s}</span>'
            for s in (invitation.skills or ["General Responsibilities"])
        ])

        personal_message_html = ""
        if personal_message:
            personal_message_html = f'''
            <div style="background-color: #F8FAFC; border-left: 4px solid #3B82F6; padding: 14px 18px; border-radius: 8px; margin: 20px 0;">
                <p style="margin:0; font-size:13px; color:#64748B; font-weight:600; text-transform:uppercase; letter-spacing:0.5px;">Personal Note from {inviter_name}</p>
                <p style="margin:6px 0 0 0; font-size:14px; color:#334155; font-style:italic;">"{personal_message}"</p>
            </div>
            '''

        html_content = f'''
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Project Invitation - FairSplit</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F1F5F9; margin: 0; padding: 30px 15px; color: #1E293B;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 560px; margin: 0 auto; background-color: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.01);">
                <!-- Header Banner -->
                <tr>
                    <td style="background: linear-gradient(135deg, #1E293B 0%, #0F172A 100%); padding: 32px 40px; text-align: center;">
                        <h1 style="color: #FFFFFF; font-size: 24px; font-weight: 700; margin: 0; letter-spacing: -0.5px;">FairSplit</h1>
                        <p style="color: #94A3B8; font-size: 13px; margin: 4px 0 0 0; font-weight: 500;">Smart Workload Allocation & Team Management</p>
                    </td>
                </tr>

                <!-- Content Area -->
                <tr>
                    <td style="padding: 36px 40px;">
                        <h2 style="font-size: 20px; font-weight: 700; color: #0F172A; margin: 0 0 12px 0;">You're invited to join <span style="color: #2563EB;">{project_title}</span></h2>
                        <p style="font-size: 15px; line-height: 1.6; color: #475569; margin: 0 0 20px 0;">
                            <strong style="color:#0F172A;">{inviter_name}</strong> has invited you to collaborate on <strong>{project_title}</strong> as part of the team.
                        </p>

                        <!-- Assignment Details Card -->
                        <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
                            <div style="margin-bottom: 12px;">
                                <span style="font-size: 11px; text-transform: uppercase; color: #64748B; font-weight: 700; letter-spacing: 0.5px; display: block; margin-bottom: 4px;">Assigned Role</span>
                                <span style="font-size: 15px; font-weight: 700; color: #0F172A;">{role_name}</span>
                            </div>
                            <div>
                                <span style="font-size: 11px; text-transform: uppercase; color: #64748B; font-weight: 700; letter-spacing: 0.5px; display: block; margin-bottom: 8px;">Target Skills</span>
                                <div>{skills_chips_html}</div>
                            </div>
                        </div>

                        {personal_message_html}

                        <!-- Call To Action Button -->
                        <div style="text-align: center; margin: 32px 0 24px 0;">
                            <a href="{invite_link}" target="_blank" style="display: inline-block; background-color: #2563EB; color: #FFFFFF; font-size: 15px; font-weight: 600; text-decoration: none; padding: 14px 32px; border-radius: 10px; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);">
                                Accept Invitation & Join Project
                            </a>
                        </div>

                        <p style="font-size: 12px; color: #94A3B8; text-align: center; margin: 0 0 20px 0;">
                            Or copy and paste this URL into your browser:<br>
                            <a href="{invite_link}" style="color: #2563EB; text-decoration: underline; word-break: break-all;">{invite_link}</a>
                        </p>

                        <div style="border-top: 1px solid #E2E8F0; padding-top: 16px; margin-top: 24px; text-align: center;">
                            <p style="font-size: 12px; color: #64748B; margin: 0;">
                                This invitation will expire in <strong>7 days</strong>. If you were not expecting this invite, you can safely ignore this email.
                            </p>
                        </div>
                    </td>
                </tr>

                <!-- Footer -->
                <tr>
                    <td style="background-color: #F8FAFC; border-top: 1px solid #E2E8F0; padding: 20px 40px; text-align: center;">
                        <p style="font-size: 12px; color: #94A3B8; margin: 0;">
                            &copy; FairSplit Platform. All rights reserved.
                        </p>
                    </td>
                </tr>
            </table>
        </body>
        </html>
        '''

        subject = f"Invitation: Join {project_title} on FairSplit"
        reply_to = [invitation.invited_by.email or "support@fairsplit.com"]

        try:
            msg = EmailMultiAlternatives(
                subject=subject,
                body=plain_text,
                from_email=from_email,
                to=[invitation.email],
                reply_to=reply_to
            )
            msg.attach_alternative(html_content, "text/html")
            msg.send(fail_silently=False)
            logger.info(f"SMTP invitation email sent successfully to {invitation.email}")
            return True
        except Exception as e:
            logger.error(f"Failed to send SMTP email to {invitation.email}: {e}", exc_info=True)
            return False


# Provider abstraction alias for backwards compatibility
ResendEmailService = EmailService
