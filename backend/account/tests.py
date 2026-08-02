from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

User = get_user_model()


class AccountTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser",
            email="testuser@example.com",
            password="TestPassword123!",
            first_name="Test",
            last_name="User",
            role="member",
        )

    def test_user_registration(self):
        url = reverse("register")
        data = {
            "username": "newuser",
            "email": "newuser@fairsplit.com",
            "password": "Password123!",
            "first_name": "New",
            "last_name": "User",
            "role": "member",
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.filter(username="newuser").count(), 1)

    def test_registration_weak_password_fails(self):
        url = reverse("register")
        data = {
            "username": "weakuser",
            "email": "weakuser@fairsplit.com",
            "password": "123",  # Too short, fails Django password validation
            "first_name": "Weak",
            "last_name": "User",
            "role": "member",
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("password", response.data)

    def test_logout_endpoint(self):
        login_url = reverse("login")
        login_data = {"username": "testuser", "password": "TestPassword123!"}
        login_resp = self.client.post(login_url, login_data)
        self.assertEqual(login_resp.status_code, status.HTTP_200_OK)
        refresh_token = login_resp.data["refresh"]

        logout_url = reverse("logout")
        logout_resp = self.client.post(logout_url, {"refresh": refresh_token})
        self.assertEqual(logout_resp.status_code, status.HTTP_205_RESET_CONTENT)
