import logging

from .models import Notification

logger = logging.getLogger(__name__)


def create_notification(user, title, message, notification_type="system"):
    """
    Creates a user-specific database notification.
    Prevent duplicate unread notifications with identical title/message for the user within a short timeframe.
    """
    if not user:
        return None
    try:
        # Check if identical unread notification exists to prevent spamming
        exists = Notification.objects.filter(user=user, title=title, is_read=False).exists()
        if exists:
            return None

        notification = Notification.objects.create(
            user=user, title=title, message=message, notification_type=notification_type
        )
        return notification
    except Exception as e:
        logger.error(f"Failed to create notification for user {user}: {e}")
        return None


def notify_project_members(project, title, message, notification_type="system", exclude_user=None):
    """
    Notifies manager and all project members of a project.
    """
    if not project:
        return

    users_to_notify = set()
    if project.manager:
        users_to_notify.add(project.manager)

    for member in project.members.all():
        if member.user:
            users_to_notify.add(member.user)

    if exclude_user:
        users_to_notify.discard(exclude_user)

    for user in users_to_notify:
        create_notification(user=user, title=title, message=message, notification_type=notification_type)
