# backend/main/urls.py

from django.contrib import admin
from django.urls import path, include  # <-- Make sure 'include' is imported

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # This line tells Django to look in 'api/urls.py' for any path
    # that starts with 'api/'. This is the missing piece.
    path('api/', include('api.urls')),
]
