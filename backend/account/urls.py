from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    LogoutView,
    OAuthLoginView,
    OAuthURLView,
    ProfileView,
    RegisterView,
    ThrottledTokenObtainPairView,
    UserListView,
)

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", ThrottledTokenObtainPairView.as_view(), name="login"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("refresh/", TokenRefreshView.as_view(), name="refresh"),
    path("profile/", ProfileView.as_view(), name="profile"),
    path("users/", UserListView.as_view(), name="user-list"),
    path("oauth/url/", OAuthURLView.as_view(), name="oauth-url"),
    path("oauth/login/", OAuthLoginView.as_view(), name="oauth-login"),
]
