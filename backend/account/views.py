import os

import requests
from allauth.socialaccount.models import SocialAccount
from decouple import Config, RepositoryEnv
from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle, UserRateThrottle
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView

from .serializers import ProfileSerializer, RegisterSerializer

User = get_user_model()


class LoginRateThrottle(AnonRateThrottle):
    rate = "10/min"


class RegisterRateThrottle(AnonRateThrottle):
    rate = "5/min"


class LogoutRateThrottle(UserRateThrottle):
    rate = "20/min"


class ThrottledTokenObtainPairView(TokenObtainPairView):
    throttle_classes = [LoginRateThrottle]


class LogoutView(APIView):
    # AllowAny allows blacklisting refresh tokens even when the short-lived access token has already expired.
    permission_classes = [permissions.AllowAny]
    throttle_classes = [LogoutRateThrottle]

    def post(self, request):
        refresh_token = request.data.get("refresh") or request.data.get("refresh_token")
        if not refresh_token:
            return Response(
                {"message": "No refresh token provided."},
                status=status.HTTP_200_OK,
            )
        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(
                {"message": "Successfully logged out."},
                status=status.HTTP_205_RESET_CONTENT,
            )
        except Exception:
            return Response(
                {"message": "Session invalidated or already expired."},
                status=status.HTTP_200_OK,
            )


def get_env_val(key, default=""):
    if key in os.environ and os.environ[key]:
        return os.environ[key].strip()
    env_file = os.path.join(settings.BASE_DIR, ".env")
    if os.path.exists(env_file):
        try:
            val = Config(RepositoryEnv(env_file))(key, default=default)
            if val:
                return val.strip()
        except Exception:
            pass
    val = getattr(settings, key, default)
    return val.strip() if isinstance(val, str) else default


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]
    throttle_classes = [RegisterRateThrottle]

    def perform_create(self, serializer):
        user = serializer.save()
        try:
            from project.services.invitation_service import InvitationService

            InvitationService.process_pending_invitations_for_user(user)
        except Exception:
            pass


class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer

    def get_object(self):
        return self.request.user


class UserListView(generics.ListAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = User.objects.filter(is_active=True)
        qs = qs.exclude(username__icontains="verify")
        qs = qs.exclude(username__icontains="test")
        qs = qs.exclude(email__icontains="example.com")
        qs = qs.exclude(email__icontains="test")
        return qs


def get_oauth_redirect_uri():
    explicit_uri = get_env_val("GOOGLE_REDIRECT_URI")
    if explicit_uri and explicit_uri != "http://localhost/auth/callback":
        return explicit_uri

    frontend_url = get_env_val("FRONTEND_URL")
    if frontend_url:
        return f"{frontend_url.rstrip('/')}/auth/callback"

    return explicit_uri or "http://localhost/auth/callback"


class OAuthURLView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        provider = request.query_params.get("provider", "google").lower()
        redirect_uri = get_oauth_redirect_uri()

        if provider == "google":
            client_id = get_env_val("GOOGLE_CLIENT_ID")
            auth_url = (
                f"https://accounts.google.com/o/oauth2/v2/auth?"
                f"client_id={client_id}&redirect_uri={redirect_uri}&"
                f"response_type=code&scope=openid%20email%20profile&access_type=offline&prompt=consent"
            )
            return Response({"url": auth_url, "provider": "google"})
        elif provider == "github":
            client_id = get_env_val("GITHUB_CLIENT_ID")
            auth_url = (
                f"https://github.com/login/oauth/authorize?"
                f"client_id={client_id}&redirect_uri={redirect_uri}&scope=user:email"
            )
            return Response({"url": auth_url, "provider": "github"})
        else:
            return Response({"error": "Unsupported provider"}, status=status.HTTP_400_BAD_REQUEST)


class OAuthLoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        provider = request.data.get("provider", "").lower()
        code = request.data.get("code")
        redirect_uri = request.data.get("redirect_uri") or get_oauth_redirect_uri()

        if not provider or not code:
            return Response(
                {"error": "Provider and authorization code are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        email = None
        first_name = ""
        last_name = ""
        username = ""
        uid = ""
        extra_data = {}

        try:
            if provider == "google":
                client_id = get_env_val("GOOGLE_CLIENT_ID")
                client_secret = get_env_val("GOOGLE_CLIENT_SECRET")

                print({
                    "client_id": client_id,
                    "client_secret_present": bool(client_secret),
                    "client_secret_length": len(client_secret),
                    "client_secret_first5": client_secret[:5] if client_secret else "",
                    "redirect_uri": redirect_uri,
                })

                # Exchange code for access token
                token_res = requests.post(
                    "https://oauth2.googleapis.com/token",
                    data={
                        "code": code,
                        "client_id": client_id,
                        "client_secret": client_secret,
                        "redirect_uri": redirect_uri,
                        "grant_type": "authorization_code",
                    },
                    timeout=10,
                )
                if token_res.status_code != 200:
                    try:
                        err_payload = token_res.json()
                    except Exception:
                        err_payload = {"raw": token_res.text}

                    err_msg = (
                        err_payload.get("error_description")
                        or err_payload.get("error")
                        or "Failed to exchange code with Google"
                    )
                    return Response(
                        {
                            "error": f"Google OAuth exchange error: {err_msg}",
                            "details": err_payload,
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                token_data = token_res.json()
                access_token = token_data.get("access_token")

                # Fetch user profile from Google
                user_info_res = requests.get(
                    "https://www.googleapis.com/oauth2/v3/userinfo",
                    headers={"Authorization": f"Bearer {access_token}"},
                    timeout=10,
                )
                if user_info_res.status_code != 200:
                    return Response(
                        {"error": "Failed to fetch user profile from Google."},
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                extra_data = user_info_res.json()
                uid = extra_data.get("sub", "")
                email = extra_data.get("email", "")
                first_name = extra_data.get("given_name", "")
                last_name = extra_data.get("family_name", "")
                username = email.split("@")[0] if email else f"google_{uid[:8]}"

            elif provider == "github":
                client_id = get_env_val("GITHUB_CLIENT_ID")
                client_secret = get_env_val("GITHUB_CLIENT_SECRET")

                # Exchange code for access token
                token_res = requests.post(
                    "https://github.com/login/oauth/access_token",
                    headers={"Accept": "application/json"},
                    data={
                        "code": code,
                        "client_id": client_id,
                        "client_secret": client_secret,
                        "redirect_uri": redirect_uri,
                    },
                    timeout=10,
                )
                if token_res.status_code != 200:
                    try:
                        err_payload = token_res.json()
                    except Exception:
                        err_payload = {"raw": token_res.text}
                    return Response(
                        {
                            "error": "Failed to exchange authorization code with GitHub.",
                            "details": err_payload,
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                token_data = token_res.json()
                access_token = token_data.get("access_token")

                if not access_token:
                    return Response(
                        {"error": token_data.get("error_description", "Invalid code")},
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                # Fetch user profile from GitHub
                user_info_res = requests.get(
                    "https://api.github.com/user",
                    headers={
                        "Authorization": f"Bearer {access_token}",
                        "Accept": "application/json",
                    },
                    timeout=10,
                )
                if user_info_res.status_code != 200:
                    return Response(
                        {"error": "Failed to fetch user profile from GitHub."},
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                extra_data = user_info_res.json()
                uid = str(extra_data.get("id", ""))
                username = extra_data.get("login", "")

                # Fetch user emails from GitHub if email is private
                email = extra_data.get("email")
                if not email:
                    emails_res = requests.get(
                        "https://api.github.com/user/emails",
                        headers={
                            "Authorization": f"Bearer {access_token}",
                            "Accept": "application/json",
                        },
                        timeout=10,
                    )
                    if emails_res.status_code == 200:
                        emails_list = emails_res.json()
                        primary_email = next(
                            (e for e in emails_list if e.get("primary") and e.get("verified")),
                            None,
                        )
                        if primary_email:
                            email = primary_email.get("email")
                        elif len(emails_list) > 0:
                            email = emails_list[0].get("email")

                if not email:
                    email = f"{username}@users.noreply.github.com"

                name_parts = (extra_data.get("name") or "").split(" ")
                first_name = name_parts[0] if name_parts else username
                last_name = " ".join(name_parts[1:]) if len(name_parts) > 1 else ""

            else:
                return Response(
                    {"error": "Unsupported provider"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if not email:
                return Response(
                    {"error": "Could not retrieve email from OAuth provider."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Check if user with existing email exists
            user = User.objects.filter(email=email).first()

            if user:
                # Link OAuth account to existing user
                if first_name and not user.first_name:
                    user.first_name = first_name
                if last_name and not user.last_name:
                    user.last_name = last_name
                user.save()
            else:
                # Ensure unique username
                base_username = username or email.split("@")[0]
                unique_username = base_username
                counter = 1
                while User.objects.filter(username=unique_username).exists():
                    unique_username = f"{base_username}_{counter}"
                    counter += 1

                # Create new user
                user = User.objects.create(
                    username=unique_username,
                    email=email,
                    first_name=first_name,
                    last_name=last_name,
                    role="member",
                )

            # Link social account via django-allauth SocialAccount model
            SocialAccount.objects.get_or_create(
                user=user,
                provider=provider,
                defaults={"uid": uid, "extra_data": extra_data},
            )

            # Auto-accept pending project invitations for user email
            try:
                from project.services.invitation_service import InvitationService

                InvitationService.process_pending_invitations_for_user(user)
            except Exception:
                pass

            # Issue SimpleJWT Access & Refresh Tokens
            refresh = RefreshToken.for_user(user)

            return Response(
                {
                    "access": str(refresh.access_token),
                    "refresh": str(refresh),
                    "user": ProfileSerializer(user).data,
                },
                status=status.HTTP_200_OK,
            )

        except Exception as e:
            return Response(
                {"error": f"OAuth authentication failed: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
