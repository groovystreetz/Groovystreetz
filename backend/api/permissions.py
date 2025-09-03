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


# ==============================================================================
# ENHANCED PERMISSION SYSTEM
# ==============================================================================

class HasPermission(permissions.BasePermission):
    """
    Custom permission class that checks for specific granular permissions.
    Usage: permission_classes = [permissions.IsAuthenticated, HasPermission]
    And in the view, define: required_permission = 'read_products'
    """
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        # Get required permission from view
        required_permission = getattr(view, 'required_permission', None)
        if not required_permission:
            return True  # No specific permission required
        
        # Check if user has the required permission
        return request.user.has_permission(required_permission)


class HasAnyPermission(permissions.BasePermission):
    """
    Custom permission class that checks if user has any of the specified permissions.
    Usage: In view, define: required_permissions = ['read_products', 'write_products']
    """
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        required_permissions = getattr(view, 'required_permissions', [])
        if not required_permissions:
            return True
        
        # Check if user has any of the required permissions
        for permission in required_permissions:
            if request.user.has_permission(permission):
                return True
        return False


class HasAllPermissions(permissions.BasePermission):
    """
    Custom permission class that checks if user has all specified permissions.
    Usage: In view, define: required_permissions = ['read_products', 'write_products']
    """
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        required_permissions = getattr(view, 'required_permissions', [])
        if not required_permissions:
            return True
        
        # Check if user has all required permissions
        for permission in required_permissions:
            if not request.user.has_permission(permission):
                return False
        return True


class ResourceBasedPermission(permissions.BasePermission):
    """
    Permission class that automatically determines required permission based on HTTP method and resource.
    """
    
    # Mapping of HTTP methods to permission types
    METHOD_PERMISSION_MAP = {
        'GET': 'read',
        'HEAD': 'read',
        'OPTIONS': 'read',
        'POST': 'write',
        'PUT': 'write',
        'PATCH': 'write',
        'DELETE': 'delete',
    }
    
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        # Get resource type from view
        resource_type = getattr(view, 'resource_type', None)
        if not resource_type:
            return True
        
        # Determine required permission based on HTTP method
        permission_type = self.METHOD_PERMISSION_MAP.get(request.method, 'read')
        permission_codename = f"{permission_type}_{resource_type}"
        
        # Check if user has the required permission
        return request.user.has_permission(permission_codename)


class IsSuperAdminOrHasPermission(permissions.BasePermission):
    """
    Allows access if user is superadmin OR has specific permission.
    """
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        # Superadmin has access to everything
        if request.user.role == 'superadmin':
            return True
        
        # Otherwise check specific permission
        required_permission = getattr(view, 'required_permission', None)
        if required_permission:
            return request.user.has_permission(required_permission)
        
        return False
