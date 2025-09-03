# Advanced Permission System Documentation

## Overview
The GroovyStreetz backend implements a sophisticated role-based access control (RBAC) system that goes beyond simple user roles to provide granular, resource-based permissions.

## Core Components

### 1. Permissions
Individual permissions that grant specific access rights to system resources.

#### Permission Structure
```python
Permission {
    name: "Read Products"
    codename: "read_products"  
    permission_type: "read"    # read, write, delete, manage
    resource_type: "products"  # users, products, orders, etc.
    description: "Permission to view products"
    is_active: True
}
```

#### Permission Types
- **`read`**: View/retrieve operations (GET requests)
- **`write`**: Create/update operations (POST/PUT/PATCH requests)  
- **`delete`**: Delete operations (DELETE requests)
- **`manage`**: Full administrative access (all operations)

#### Resource Types
- **`users`**: User account management
- **`products`**: Product catalog management
- **`orders`**: Order processing and fulfillment
- **`coupons`**: Discount and promotion management
- **`reviews`**: Customer review moderation
- **`testimonials`**: Testimonial management
- **`contacts`**: Customer service messages
- **`banners`**: Homepage banner management
- **`spotlights`**: Featured content management
- **`rewards`**: Reward points system
- **`analytics`**: Reports and analytics access

### 2. Roles
Collections of permissions that define job functions or responsibility areas.

#### Role Structure
```python
Role {
    name: "Product Manager"
    description: "Manages product catalog and inventory"
    permissions: [read_products, write_products, delete_products, manage_products]
    is_active: True
    is_system_role: False  # Can be deleted if False
}
```

#### System Roles
Three default system roles that cannot be deleted:
- **Customer**: Basic user permissions
- **Admin**: Operations management permissions  
- **SuperAdmin**: Full system access

### 3. User Role Assignments
Links users to roles with assignment tracking.

#### Assignment Structure
```python
UserRole {
    user: User instance
    role: Role instance
    assigned_by: Admin who made the assignment
    assigned_at: Timestamp
    is_active: True
}
```

## Permission Checking

### User Methods
```python
# Check if user has specific permission
user.has_permission('read_products')  # Returns True/False

# Get all user permissions
user.get_permissions()  # Returns QuerySet of Permission objects
```

### View-Level Permission Classes

#### 1. HasPermission
Checks for a single specific permission.
```python
class ProductListView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated, HasPermission]
    required_permission = 'read_products'
```

#### 2. HasAnyPermission  
User needs ANY of the specified permissions.
```python
class OrderManagementView(views.APIView):
    permission_classes = [permissions.IsAuthenticated, HasAnyPermission]  
    required_permissions = ['read_orders', 'manage_orders']
```

#### 3. HasAllPermissions
User needs ALL of the specified permissions.
```python
class AdvancedReportView(views.APIView):
    permission_classes = [permissions.IsAuthenticated, HasAllPermissions]
    required_permissions = ['read_analytics', 'read_orders', 'read_users']
```

#### 4. ResourceBasedPermission
Automatically determines required permission based on HTTP method and resource.
```python
class ProductManagementView(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated, ResourceBasedPermission]
    resource_type = 'products'
    
    # GET = read_products, POST = write_products, DELETE = delete_products
```

#### 5. IsSuperAdminOrHasPermission
Allows access if user is SuperAdmin OR has specific permission.
```python
class SpecialFeatureView(views.APIView):
    permission_classes = [permissions.IsAuthenticated, IsSuperAdminOrHasPermission]
    required_permission = 'manage_special_features'
```

## Default Permission Matrix

### All Permissions (44 total)
```
Resource: users
- read_users, write_users, delete_users, manage_users

Resource: products  
- read_products, write_products, delete_products, manage_products

Resource: orders
- read_orders, write_orders, delete_orders, manage_orders

Resource: coupons
- read_coupons, write_coupons, delete_coupons, manage_coupons

Resource: reviews
- read_reviews, write_reviews, delete_reviews, manage_reviews

Resource: testimonials  
- read_testimonials, write_testimonials, delete_testimonials, manage_testimonials

Resource: contacts
- read_contacts, write_contacts, delete_contacts, manage_contacts

Resource: banners
- read_banners, write_banners, delete_banners, manage_banners

Resource: spotlights
- read_spotlights, write_spotlights, delete_spotlights, manage_spotlights

Resource: rewards
- read_rewards, write_rewards, delete_rewards, manage_rewards

Resource: analytics  
- read_analytics, write_analytics, delete_analytics, manage_analytics
```

### Default Role Permissions

#### Customer Role
- Basic read access to public content
- Manage their own profile and orders
- No admin permissions

#### Admin Role  
- **Products**: read_products, write_products, delete_products, manage_products
- **Orders**: read_orders, write_orders, delete_orders, manage_orders
- **Coupons**: read_coupons, write_coupons, delete_coupons, manage_coupons
- **Reviews**: read_reviews, write_reviews, delete_reviews, manage_reviews
- **Analytics**: read_analytics

#### SuperAdmin Role
- **All Permissions**: Complete system access
- **User Management**: Can create/modify/delete users
- **Role Management**: Can assign/revoke roles
- **System Configuration**: Can modify system settings

## API Endpoints

### Permission Management
```http
# List all permissions (SuperAdmin)
GET /api/permissions/

# Get user's current permissions
GET /api/user/permissions/
Response: {
  "user": "admin@example.com",
  "permissions": {
    "products": [
      {"codename": "read_products", "permission_type": "read"},
      {"codename": "write_products", "permission_type": "write"}
    ],
    "orders": [...]
  }
}

# Check specific permission  
POST /api/user/check-permission/
Body: {"permission": "read_products"}
Response: {"has_permission": true}
```

### Role Management
```http  
# List/Create/Update/Delete roles (SuperAdmin)
GET /api/admin/roles/
POST /api/admin/roles/
Body: {
  "name": "Inventory Manager", 
  "description": "Manages product inventory",
  "permission_ids": [1, 2, 5, 6],  # read_products, write_products, read_orders, write_orders
  "is_active": true
}

# Assign roles to user (SuperAdmin)
POST /api/admin/assign-roles/
Body: {
  "user_id": 5,
  "role_ids": [2, 3]  # Can assign multiple roles
}
```

### System Initialization
```http
# Initialize default permissions and roles (Run once)
POST /api/admin/initialize-permissions/
Response: {
  "message": "Permissions and roles initialized successfully",
  "permissions_created": 44,
  "total_permissions": 44, 
  "total_roles": 3
}
```

## Implementation Examples

### Custom Permission View
```python
class ProductAnalyticsView(views.APIView):
    permission_classes = [permissions.IsAuthenticated, HasAllPermissions]
    required_permissions = ['read_products', 'read_analytics']
    
    def get(self, request):
        # Only users with BOTH read_products AND read_analytics can access
        return response.Response(analytics_data)
```

### Resource-Based View
```python  
class CouponManagementViewSet(viewsets.ModelViewSet):
    queryset = Coupon.objects.all()
    serializer_class = CouponSerializer
    permission_classes = [permissions.IsAuthenticated, ResourceBasedPermission]
    resource_type = 'coupons'
    
    # GET /coupons/ requires read_coupons
    # POST /coupons/ requires write_coupons  
    # DELETE /coupons/{id}/ requires delete_coupons
```

### Conditional Permission View
```python
class OrderStatusUpdateView(views.APIView):
    permission_classes = [permissions.IsAuthenticated, IsSuperAdminOrHasPermission]  
    required_permission = 'write_orders'
    
    def patch(self, request, order_id):
        # SuperAdmins can access regardless
        # Others need write_orders permission
        return self.update_order_status(order_id, request.data)
```

## Security Considerations

### Permission Inheritance
- Higher-level roles inherit lower-level permissions
- SuperAdmin has implicit access to all resources
- Role hierarchies prevent privilege escalation

### Assignment Restrictions  
- Only SuperAdmins can assign roles to users
- System roles cannot be deleted or modified
- Role assignments are logged with admin attribution

### Permission Validation
- All API endpoints have appropriate permission checks
- Frontend should also implement permission-based UI hiding
- Regular permission audits recommended

### Database Security
- Permission checks happen at the database level
- QuerySets are filtered based on user permissions
- Sensitive operations require explicit permission validation

## Troubleshooting

### Common Issues
1. **Permission Denied**: User lacks required permission for operation
   - Solution: Check user's role assignments and role permissions
   
2. **Missing Permissions**: New features not protected
   - Solution: Add appropriate permission_classes to views
   
3. **Role Assignment Fails**: User cannot be assigned role
   - Solution: Ensure requesting user has SuperAdmin privileges

### Debug Commands
```python
# Check user permissions
user = User.objects.get(email='user@example.com')
permissions = user.get_permissions()
print([p.codename for p in permissions])

# Check if user has specific permission
has_perm = user.has_permission('read_products')
print(f"User has read_products: {has_perm}")

# List user's roles
roles = user.user_roles.filter(is_active=True)
print([ur.role.name for ur in roles])
```

## Best Practices

### Role Design
- Create roles based on job functions, not individual users
- Use descriptive role names and descriptions
- Regularly review and audit role permissions
- Avoid creating overly granular roles

### Permission Assignments
- Follow principle of least privilege
- Group related permissions into logical roles
- Document role purposes and use cases
- Regular permission audits and cleanup

### Code Implementation
- Always use permission classes on views
- Implement both backend and frontend permission checks
- Use resource-based permissions for consistency
- Test permission scenarios thoroughly

### Monitoring
- Log permission-related operations
- Monitor for unusual permission patterns
- Regular security audits
- Track role assignment changes