from django.shortcuts import render
from rest_framework import generics, permissions

from .serializers import (
    RegisterSerializer,
    ProfileSerializer,
)


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer

    def get_object(self):
        return self.request.user
# Create your views here.
