# backend/api/admin.py

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

class CustomUserAdmin(UserAdmin):
    # Use the default UserAdmin configuration but for our CustomUser model
    model = CustomUser
    # You can customize the list display, search fields, etc. here if needed
    list_display = ['email', 'username', 'is_staff', 'is_active']

# Unregister the default User model admin if it's registered
# admin.site.unregister(User)

# Register your CustomUser model with the custom admin class
admin.site.register(CustomUser, CustomUserAdmin)
