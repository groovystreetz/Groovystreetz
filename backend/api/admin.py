# backend/api/admin.py

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, Product, Category, Order, OrderItem, Coupon, CouponUsage, Design, Address, Wishlist

class CustomUserAdmin(UserAdmin):
    # Use the default UserAdmin configuration but for our CustomUser model
    model = CustomUser
    # You can customize the list display, search fields, etc. here if needed
    list_display = ['email', 'username', 'role', 'is_staff', 'is_active']
    list_filter = ['role', 'is_staff', 'is_active']

# Register your CustomUser model with the custom admin class
admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(Product)
admin.site.register(Category)
admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(Design)
admin.site.register(Address)
admin.site.register(Wishlist)


# ==============================================================================
# COUPON ADMIN CONFIGURATION
# ==============================================================================

@admin.register(Coupon)
class CouponAdmin(admin.ModelAdmin):
    list_display = ['code', 'name', 'discount_type', 'discount_value', 'is_active', 'valid_from', 'valid_until', 'total_uses']
    list_filter = ['discount_type', 'is_active', 'no_return_policy', 'created_at']
    search_fields = ['code', 'name', 'description']
    readonly_fields = ['total_uses', 'created_at', 'updated_at']
    filter_horizontal = ['categories', 'products', 'user_restrictions']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('code', 'name', 'description', 'created_by')
        }),
        ('Discount Configuration', {
            'fields': ('discount_type', 'discount_value', 'minimum_order_value')
        }),
        ('Usage Limits', {
            'fields': ('max_uses_total', 'max_uses_per_user', 'total_uses')
        }),
        ('Validity Period', {
            'fields': ('valid_from', 'valid_until')
        }),
        ('Status & Policies', {
            'fields': ('is_active', 'no_return_policy', 'allow_stacking')
        }),
        ('Restrictions', {
            'fields': ('categories', 'products', 'user_restrictions'),
            'classes': ['collapse']
        }),
        ('Audit', {
            'fields': ('created_at', 'updated_at'),
            'classes': ['collapse']
        })
    )


@admin.register(CouponUsage)
class CouponUsageAdmin(admin.ModelAdmin):
    list_display = ['coupon', 'user', 'order', 'used_at', 'discount_amount', 'original_order_value']
    list_filter = ['used_at', 'coupon__discount_type']
    search_fields = ['coupon__code', 'user__email', 'order__id']
    readonly_fields = ['used_at']
    
    def has_add_permission(self, request):
        return False  # Don't allow manual creation of usage records
    
    def has_change_permission(self, request, obj=None):
        return False  # Don't allow editing usage records
