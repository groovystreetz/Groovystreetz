# backend/api/urls.py

from django.urls import path
# We no longer import UserView
from .views import RegisterView, LoginView, LogoutView

urlpatterns = [
    # These are our custom endpoints.
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    
    # Note: The endpoint for getting user details is now provided by dj-rest-auth
    # at '/api/auth/user/' (configured in the main urls.py file).
]
