# backend/main/urls.py

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

# Imports for the custom Google Login View
from dj_rest_auth.registration.views import SocialLoginView
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from api.views import UserAccountView
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from rest_framework.response import Response
from rest_framework import status


class GoogleLogin(SocialLoginView):
    """
    Custom view for Google login that uses the GoogleOAuth2Adapter.
    This view is responsible for the API-based Google login flow.
    """
    adapter_class = GoogleOAuth2Adapter
    client_class = OAuth2Client
    
    # Set the callback URL for OAuth2Client (required for proper token validation)
    callback_url = "http://localhost:3000"  # or your frontend URL

    def post(self, request, *args, **kwargs):
        """
        Override the post method to return user data after successful login
        instead of the default empty 204 response.
        """
        # Call the parent's post method which handles the authentication
        response = super().post(request, *args, **kwargs)
        
        # If authentication was successful, return user data
        if response.status_code == 204:
            # Use your custom serializer if configured
            from api.serializers import CustomUserDetailsSerializer
            serializer = CustomUserDetailsSerializer(instance=request.user, context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        # If there was an error, return the original response
        return response


urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Your custom API endpoints for email/password registration
    path('api/', include('api.urls')),
    
    # Override the default user details view to add DELETE functionality
    path('api/auth/user/', UserAccountView.as_view(), name='rest_user_details'),
    
    # Standard dj-rest-auth endpoints (for password reset, etc.)
    path('api/auth/', include('dj_rest_auth.urls')),
    
    # dj-rest-auth endpoint for email/password registration
    path('api/auth/registration/', include('dj_rest_auth.registration.urls')),
    
    # Our custom Google login endpoint
    path('api/auth/google/', GoogleLogin.as_view(), name='google_login'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
