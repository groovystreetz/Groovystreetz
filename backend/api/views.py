# backend/api/views.py

from django.contrib.auth import login, logout, get_user_model
from rest_framework import views, response, status, permissions
from .serializers import RegisterSerializer, LoginSerializer, CustomUserDetailsSerializer

User = get_user_model()


class RegisterView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            login(request, user)
            # Use the CustomUserDetailsSerializer to return the correct user data
            return response.Response(
                CustomUserDetailsSerializer(user).data,
                status=status.HTTP_201_CREATED
            )
        return response.Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        # Pass the request to the serializer's context
        serializer = LoginSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            user = serializer.validated_data
            login(request, user)
            # Use the CustomUserDetailsSerializer here as well for a consistent response
            return response.Response(CustomUserDetailsSerializer(user).data, status=status.HTTP_200_OK)
        return response.Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(views.APIView):
    def post(self, request):
        logout(request)
        return response.Response({"detail": "Successfully logged out."}, status=status.HTTP_200_OK)

# The basic UserView is no longer needed because dj-rest-auth provides
# a more complete one at '/api/auth/user/'.
# If you still want a custom one, you would create it like this:
#
# class UserDetailView(views.APIView):
#     def get(self, request):
#         serializer = CustomUserDetailsSerializer(request.user)
#         return response.Response(serializer.data, status=status.HTTP_200_OK)
