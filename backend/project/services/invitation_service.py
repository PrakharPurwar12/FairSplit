import secrets
import logging
from datetime import timedelta
from django.utils import timezone
from django.db import transaction
from django.contrib.auth import get_user_model
from rest_framework.exceptions import ValidationError, PermissionDenied

from project.models import Project, ProjectMember, ProjectInvitation
from notifications.models import Notification
from .email_service import EmailService, ResendEmailService

User = get_user_model()
logger = logging.getLogger(__name__)


def generate_secure_token():
    """Generates a cryptographically secure, URL-safe 32-byte token."""
    return secrets.token_urlsafe(32)


class InvitationService:
    @staticmethod
    def create_invitation(project, email, full_name="", role="", skills=None, personal_message="", invited_by=None):
        email_clean = email.strip().lower()
        skills_clean = skills or []

        # 1. Permission check: Only project manager can invite
        if project.manager != invited_by:
            raise PermissionDenied("Only the project manager can send invitations for this project.")

        # 2. Check if user is already a member of this project
        if ProjectMember.objects.filter(project=project, user__email__iexact=email_clean).exists():
            raise ValidationError("A user with this email address is already a member of this project.")

        # 3. Check for existing pending invitation
        if ProjectInvitation.objects.filter(project=project, email__iexact=email_clean, status="PENDING").exists():
            raise ValidationError("A pending invitation already exists for this email address in this project.")

        token = generate_secure_token()
        expires_at = timezone.now() + timedelta(days=7)

        invitation = ProjectInvitation.objects.create(
            project=project,
            email=email_clean,
            full_name=full_name.strip(),
            role=role.strip(),
            skills=skills_clean,
            personal_message=personal_message.strip(),
            invited_by=invited_by,
            invitation_token=token,
            status="PENDING",
            expires_at=expires_at,
        )

        # Send email
        email_sent = EmailService.send_invitation_email(invitation)

        # Create notification for manager ONLY if email was sent successfully
        if email_sent:
            Notification.objects.create(
                user=invited_by,
                title="Invitation Sent",
                message=f"Invitation sent to {email_clean} for project '{project.title}'.",
                notification_type="invitation_sent"
            )

        return invitation, email_sent

    @staticmethod
    def get_invitation_by_token(token):
        try:
            invitation = ProjectInvitation.objects.select_related("project", "invited_by").get(invitation_token=token)
        except ProjectInvitation.DoesNotExist:
            raise ValidationError("Invalid or non-existent invitation token.")

        # Auto-expire check
        if invitation.status in ["PENDING", "OPENED"] and invitation.expires_at < timezone.now():
            invitation.status = "EXPIRED"
            invitation.save(update_fields=["status", "updated_at"])

            # Create notification for manager
            Notification.objects.create(
                user=invitation.invited_by,
                title="Invitation Expired",
                message=f"Invitation sent to {invitation.email} for project '{invitation.project.title}' has expired.",
                notification_type="invitation_expired"
            )

        return invitation

    @classmethod
    def preview_invitation(cls, token):
        invitation = cls.get_invitation_by_token(token)

        if invitation.status == "EXPIRED":
            raise ValidationError("This invitation has expired.")

        if invitation.status == "CANCELLED":
            raise ValidationError("This invitation has been cancelled by the project manager.")

        if invitation.status == "DECLINED":
            raise ValidationError("This invitation was declined.")

        # Mark OPENED on first preview if PENDING
        if invitation.status == "PENDING":
            invitation.status = "OPENED"
            invitation.opened_at = timezone.now()
            invitation.save(update_fields=["status", "opened_at", "updated_at"])

            Notification.objects.create(
                user=invitation.invited_by,
                title="Invitation Opened",
                message=f"Invitation sent to {invitation.email} for project '{invitation.project.title}' was opened.",
                notification_type="invitation_opened"
            )

        return invitation

    @classmethod
    def accept_invitation(cls, token, user):
        invitation = cls.get_invitation_by_token(token)

        if invitation.status in ["EXPIRED", "CANCELLED", "DECLINED"]:
            raise ValidationError(f"Cannot accept invitation with status: {invitation.status}.")

        if invitation.status == "ACCEPTED":
            return invitation

        if user.email.strip().lower() != invitation.email.strip().lower():
            raise ValidationError(f"This invitation was issued to {invitation.email}. Please sign in with that email.")

        with transaction.atomic():
            # Create ProjectMember
            member, _ = ProjectMember.objects.get_or_create(
                project=invitation.project,
                user=user,
                defaults={"role": invitation.role, "skills": invitation.skills}
            )

            # Update Invitation
            invitation.status = "ACCEPTED"
            invitation.accepted_by = user
            invitation.accepted_at = timezone.now()
            invitation.save(update_fields=["status", "accepted_by", "accepted_at", "updated_at"])

            # Notify Manager
            user_display = user.get_full_name() or user.username
            Notification.objects.create(
                user=invitation.invited_by,
                title="Invitation Accepted!",
                message=f"{user_display} accepted your invitation to join '{invitation.project.title}'.",
                notification_type="invitation_accepted"
            )

        return invitation

    @staticmethod
    def cancel_invitation(invitation_id, manager):
        try:
            invitation = ProjectInvitation.objects.get(id=invitation_id)
        except ProjectInvitation.DoesNotExist:
            raise ValidationError("Invitation not found.")

        if invitation.project.manager != manager:
            raise PermissionDenied("Only the project manager can cancel invitations.")

        if invitation.status in ["ACCEPTED", "CANCELLED"]:
            raise ValidationError(f"Cannot cancel an invitation with status: {invitation.status}.")

        invitation.status = "CANCELLED"
        invitation.save(update_fields=["status", "updated_at"])

        Notification.objects.create(
            user=manager,
            title="Invitation Cancelled",
            message=f"Invitation sent to {invitation.email} for project '{invitation.project.title}' was cancelled.",
            notification_type="invitation_cancelled"
        )

        return invitation

    @staticmethod
    def resend_invitation(invitation_id, manager):
        try:
            invitation = ProjectInvitation.objects.get(id=invitation_id)
        except ProjectInvitation.DoesNotExist:
            raise ValidationError("Invitation not found.")

        if invitation.project.manager != manager:
            raise PermissionDenied("Only the project manager can resend invitations.")

        if invitation.status == "ACCEPTED":
            raise ValidationError("Cannot resend an invitation that has already been accepted.")

        # Rate Limit Rule 1: Max 3 resends
        if invitation.resend_count >= 3:
            raise ValidationError("Maximum resend limit (3 attempts) reached for this invitation.")

        # Rate Limit Rule 2: Minimum 5 minutes interval
        last_sent_time = invitation.last_resent_at or invitation.created_at
        if last_sent_time:
            time_since_last = timezone.now() - last_sent_time
            if time_since_last < timedelta(minutes=5):
                remaining_secs = int(300 - time_since_last.total_seconds())
                mins = remaining_secs // 60
                secs = remaining_secs % 60
                raise ValidationError(f"Please wait {mins}m {secs}s before resending this invitation again.")

        # Refresh token and extend expiry
        invitation.invitation_token = generate_secure_token()
        invitation.expires_at = timezone.now() + timedelta(days=7)
        invitation.resend_count += 1
        invitation.last_resent_at = timezone.now()
        invitation.status = "PENDING"
        invitation.save(update_fields=["invitation_token", "expires_at", "resend_count", "last_resent_at", "status", "updated_at"])

        # Send fresh email
        email_sent = EmailService.send_invitation_email(invitation)

        if email_sent:
            Notification.objects.create(
                user=manager,
                title="Invitation Resent",
                message=f"Invitation to {invitation.email} for '{invitation.project.title}' was resent ({invitation.resend_count}/3).",
                notification_type="invitation_sent"
            )

        return invitation, email_sent

    @classmethod
    def process_pending_invitations_for_user(cls, user):
        """Auto-detects and accepts all valid pending invitations matching the user's email."""
        if not user or not user.email:
            return []

        user_email = user.email.strip().lower()
        pending_invitations = ProjectInvitation.objects.filter(
            email__iexact=user_email,
            status__in=["PENDING", "OPENED"],
            expires_at__gt=timezone.now()
        )

        accepted_list = []
        for invitation in pending_invitations:
            try:
                accepted = cls.accept_invitation(invitation.invitation_token, user)
                accepted_list.append(accepted)
            except Exception as e:
                logger.error(f"Error auto-accepting invitation {invitation.id} for user {user_email}: {e}")

        return accepted_list
