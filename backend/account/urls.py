from django.urls import path

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from .views import (
    RegisterView,
    ProfileView,
    UserListView,
    OAuthURLView,
    OAuthLoginView,
)

urlpatterns = [

    path(
        "register/",
        RegisterView.as_view(),
        name="register"
    ),

    path(
        "login/",
        TokenObtainPairView.as_view(),
        name="login"
    ),

    path(
        "refresh/",
        TokenRefreshView.as_view(),
        name="refresh"
    ),

    path(
        "profile/",
        ProfileView.as_view(),
        name="profile"
    ),

    path(
        "users/",
        UserListView.as_view(),
        name="user-list"
    ),

    path(
        "oauth/url/",
        OAuthURLView.as_view(),
        name="oauth-url"
    ),

    path(
        "oauth/login/",
        OAuthLoginView.as_view(),
        name="oauth-login"
    ),
]