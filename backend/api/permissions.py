# backend/api/permissions.py

from rest_framework import permissions

class IsAdminUser(permissions.BasePermission):
    """
    Custom permission to only allow users with the 'admin' role to access an endpoint.
    """
    def has_permission(self, request, view):
        # Check if the user is authenticated and has the 'admin' role.
        return request.user and request.user.is_authenticated and request.user.role == 'admin'
