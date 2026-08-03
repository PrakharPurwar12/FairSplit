from datetime import date

from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from tasks.models import Task

from .models import Project, ProjectInvitation, ProjectMember


class ObjectAuthorizationTests(APITestCase):
    """Regression coverage for project-scoped endpoints and mutations."""

    def setUp(self):
        User = get_user_model()
        self.manager = User.objects.create_user(
            username="manager", email="manager@example.com", password="test-pass-123"
        )
        self.member = User.objects.create_user(username="member", email="member@example.com", password="test-pass-123")
        self.attacker = User.objects.create_user(
            username="attacker", email="attacker@example.com", password="test-pass-123"
        )
        self.project = Project.objects.create(
            title="Private project",
            manager=self.manager,
            start_date=date.today(),
            end_date=date.today(),
        )
        self.member_record = ProjectMember.objects.create(project=self.project, user=self.member, role="backend")
        self.task = Task.objects.create(
            project=self.project,
            title="Private task",
            estimated_hours=4,
            priority="medium",
            deadline=date.today(),
            created_by=self.manager,
        )
        self.invitation = ProjectInvitation.objects.create(
            project=self.project,
            email="invitee@example.com",
            invited_by=self.manager,
            invitation_token="a" * 32,
            expires_at="2030-01-01T00:00:00Z",
        )

    def test_unrelated_user_cannot_access_or_mutate_project_resources(self):
        self.client.force_authenticate(self.attacker)

        cases = [
            ("get", f"/api/projects/{self.project.id}/members/", None),
            ("post", f"/api/projects/{self.project.id}/members/", {"user": self.attacker.id, "role": "tester"}),
            ("patch", f"/api/projects/{self.project.id}/", {"title": "Taken over"}),
            ("delete", f"/api/projects/{self.project.id}/", None),
            ("get", f"/api/projects/{self.project.id}/invitations/", None),
            ("get", f"/api/analytics/project/{self.project.id}/", None),
            ("post", f"/api/allocation/generate/{self.project.id}/", None),
            ("patch", f"/api/tasks/{self.task.id}/", {"title": "Altered"}),
        ]
        for method, url, data in cases:
            response = getattr(self.client, method)(url, data or {}, format="json")
            self.assertIn(response.status_code, (403, 404), url)

        self.assertTrue(Project.objects.filter(id=self.project.id, title="Private project").exists())
        self.assertTrue(Task.objects.filter(id=self.task.id, title="Private task").exists())

    def test_project_member_can_read_but_not_administer_project(self):
        self.client.force_authenticate(self.member)

        self.assertEqual(self.client.get(f"/api/projects/{self.project.id}/").status_code, 200)
        self.assertEqual(self.client.get(f"/api/projects/{self.project.id}/members/").status_code, 200)
        self.assertEqual(
            self.client.patch(f"/api/projects/{self.project.id}/", {"title": "Changed"}, format="json").status_code, 403
        )
        self.assertIn(
            self.client.delete(f"/api/projects/members/{self.member_record.id}/").status_code,
            (403, 404),
        )
