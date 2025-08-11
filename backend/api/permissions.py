# backend/api/permissions.py

from rest_framework import permissions

class IsAdminUser(permissions.BasePermission):
    """
    Custom permission for users with 'admin' role (limited admin access).
    Allows access to order management, sales reports, and product management.
    """
    def has_permission(self, request, view):
        # Check if the user is authenticated and has the 'admin' role.
        return request.user and request.user.is_authenticated and request.user.role == 'admin'


class IsSuperAdminUser(permissions.BasePermission):
    """
    Custom permission for users with 'superadmin' role (full system access).
    Allows access to all admin features plus user management and role changes.
    """
    def has_permission(self, request, view):
        # Check if the user is authenticated and has the 'superadmin' role.
        return request.user and request.user.is_authenticated and request.user.role == 'superadmin'


class IsAdminOrSuperAdmin(permissions.BasePermission):
    """
    Custom permission for users with either 'admin' or 'superadmin' role.
    Used for endpoints that both admin levels can access.
    """
    def has_permission(self, request, view):
        # Check if the user is authenticated and has admin or superadmin role.
        return (request.user and request.user.is_authenticated and 
                request.user.role in ['admin', 'superadmin'])
