# backend/api/views.py

from django.contrib.auth import login, logout
from rest_framework import views, response, status, permissions
from .serializers import RegisterSerializer, LoginSerializer, UserSerializer

# Allow any user (authenticated or not) to access this view
class RegisterView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            # Log the user in automatically after registration
            login(request, user)
            return response.Response(
                UserSerializer(user).data,
                status=status.HTTP_201_CREATED
            )
        return response.Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data
            login(request, user)
            return response.Response(UserSerializer(user).data, status=status.HTTP_200_OK)
        return response.Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(views.APIView):
    # This view requires the user to be authenticated
    def post(self, request):
        logout(request)
        return response.Response({"detail": "Successfully logged out."}, status=status.HTTP_200_OK)


class UserView(views.APIView):
    # This view also requires the user to be authenticated
    def get(self, request):
        # The 'request.user' is automatically available because of session auth
        serializer = UserSerializer(request.user)
        return response.Response(serializer.data, status=status.HTTP_200_OK)
