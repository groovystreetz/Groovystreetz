# backend/api/models.py

from django.db import models
from django.contrib.auth.models import AbstractUser
from allauth.account.signals import user_signed_up
from django.dispatch import receiver
import uuid

# Define the choices for the role field
ROLE_CHOICES = (
    ('customer', 'Customer'),
    ('admin', 'Admin'),
    ('superadmin', 'SuperAdmin'),
)

class CustomUser(AbstractUser):
    """
    Custom User Model with both username and email fields, using email as login.
    """
    # Explicitly define username field with proper max_length
    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(unique=True)

    # --- ROLE FIELD ---
    # This field will store the user's role with three tiers:
    # customer (default), admin (limited), superadmin (full access)
    role = models.CharField(max_length=15, choices=ROLE_CHOICES, default='customer')

    USERNAME_FIELD = 'email'  # Use email for authentication
    REQUIRED_FIELDS = ['username']  # Username is required but not used for login

    def __str__(self):
        return self.email

    def save(self, *args, **kwargs):
        # Auto-generate username if not provided
        if not self.username:
            username_part = self.email.split('@')[0]
            unique_id = str(uuid.uuid4()).split('-')[0][:4]
            self.username = f"{username_part}_{unique_id}"
        super().save(*args, **kwargs)


@receiver(user_signed_up)
def populate_username(sender, request, user, **kwargs):
    """
    When a user signs up (e.g., via Google), this function is triggered.
    It populates the username field with a unique value derived from the email.
    """
    if not user.username:
        username_part = user.email.split('@')[0]
        unique_id = str(uuid.uuid4()).split('-')[0][:4]
        user.username = f"{username_part}_{unique_id}"
        user.save()


# ==============================================================================
# E-COMMERCE MODELS
# ==============================================================================

class Category(models.Model):
    name = models.CharField(max_length=255, unique=True)
    slug = models.SlugField(max_length=255, unique=True)

    class Meta:
        verbose_name_plural = 'Categories'

    def __str__(self):
        return self.name


class Product(models.Model):
    category = models.ForeignKey(Category, related_name='products', on_delete=models.CASCADE, null=True, blank=True)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to='products/', blank=True, null=True)  # Local image upload
    stock = models.PositiveIntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class Design(models.Model):
    user = models.ForeignKey(CustomUser, related_name='designs', on_delete=models.CASCADE)
    image_url = models.URLField()  # URL to the user-uploaded design
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Design for {self.user.email} created at {self.created_at}"


class Order(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('shipped', 'Shipped'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
    )
    user = models.ForeignKey(CustomUser, related_name='orders', on_delete=models.SET_NULL, null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    # Pricing with coupon support
    original_price = models.DecimalField(max_digits=10, decimal_places=2, default=0,
                                       help_text="Price before any discounts")
    discount_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0,
                                        help_text="Total discount applied")
    total_price = models.DecimalField(max_digits=10, decimal_places=2,
                                    help_text="Final price after discounts")
    
    # Coupon tracking
    applied_coupon = models.ForeignKey('Coupon', on_delete=models.SET_NULL, 
                                     null=True, blank=True, related_name='orders')
    
    # Policy enforcement
    no_return_allowed = models.BooleanField(default=False,
                                          help_text="Return policy restriction from coupon")
    
    shipping_address = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    tracking_number = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f"Order {self.id} by {self.user.email if self.user else 'Guest'}"

    @property
    def has_discount(self):
        """Check if order has any discount applied"""
        return self.discount_amount > 0

    @property
    def discount_percentage(self):
        """Calculate discount percentage"""
        if self.original_price > 0:
            return (self.discount_amount / self.original_price) * 100
        return 0


class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, related_name='order_items', on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2) # Price at the time of purchase

    def __str__(self):
        return f"{self.quantity} of {self.product.name} in Order {self.order.id}"


# ==============================================================================
# USER PROFILE MODELS
# ==============================================================================

class Address(models.Model):
    user = models.ForeignKey(CustomUser, related_name='addresses', on_delete=models.CASCADE)
    address_line_1 = models.CharField(max_length=255)
    address_line_2 = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=20)
    country = models.CharField(max_length=100)
    is_default = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.address_line_1}, {self.city}, {self.state}"

    class Meta:
        verbose_name_plural = 'Addresses'


class Wishlist(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='wishlist')
    products = models.ManyToManyField(Product, related_name='wishlists', blank=True)

    def __str__(self):
        return f"Wishlist for {self.user.email}"


# ==============================================================================
# COUPON SYSTEM MODELS
# ==============================================================================

class Coupon(models.Model):
    DISCOUNT_TYPE_CHOICES = (
        ('percentage', 'Percentage Discount'),
        ('fixed', 'Fixed Amount Discount'),
        ('free_shipping', 'Free Shipping'),
        ('buy_x_get_y', 'Buy X Get Y Free'),
    )

    # Basic coupon information
    code = models.CharField(max_length=50, unique=True, help_text="Unique coupon code")
    name = models.CharField(max_length=100, help_text="Display name for the coupon")
    description = models.TextField(blank=True, help_text="Description of the coupon")
    
    # Discount configuration
    discount_type = models.CharField(max_length=20, choices=DISCOUNT_TYPE_CHOICES)
    discount_value = models.DecimalField(max_digits=10, decimal_places=2, 
                                       help_text="Amount or percentage value")
    
    # Usage restrictions
    minimum_order_value = models.DecimalField(max_digits=10, decimal_places=2, default=0,
                                            help_text="Minimum order total required")
    max_uses_total = models.IntegerField(null=True, blank=True,
                                       help_text="Total usage limit across all users")
    max_uses_per_user = models.IntegerField(default=1,
                                          help_text="Usage limit per user")
    
    # Time restrictions
    valid_from = models.DateTimeField(help_text="When the coupon becomes active")
    valid_until = models.DateTimeField(help_text="When the coupon expires")
    
    # Status and policies
    is_active = models.BooleanField(default=True, help_text="Enable/disable coupon")
    no_return_policy = models.BooleanField(default=False, 
                                         help_text="Orders with this coupon cannot be returned")
    allow_stacking = models.BooleanField(default=False,
                                       help_text="Allow with other coupons")
    
    # Product/Category restrictions
    categories = models.ManyToManyField(Category, blank=True, 
                                      help_text="Applicable categories (empty = all)")
    products = models.ManyToManyField(Product, blank=True,
                                    help_text="Specific products (empty = all)")
    
    # User restrictions
    user_restrictions = models.ManyToManyField(CustomUser, blank=True,
                                             help_text="Specific users (empty = all users)")
    
    # Audit fields
    created_by = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, 
                                 null=True, related_name='created_coupons')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.code} - {self.name}"

    @property
    def total_uses(self):
        """Get total number of times this coupon has been used"""
        return self.coupon_usages.count()

    @property
    def is_valid_date_range(self):
        """Check if coupon is within valid date range"""
        from django.utils import timezone
        now = timezone.now()
        return self.valid_from <= now <= self.valid_until

    def can_be_used_by_user(self, user):
        """Check if user can use this coupon"""
        # Check if user-specific restrictions exist
        if self.user_restrictions.exists():
            return self.user_restrictions.filter(id=user.id).exists()
        return True

    def get_user_usage_count(self, user):
        """Get how many times a specific user has used this coupon"""
        return self.coupon_usages.filter(user=user).count()


class CouponUsage(models.Model):
    """Track coupon usage for analytics and enforcement"""
    coupon = models.ForeignKey(Coupon, on_delete=models.CASCADE, related_name='coupon_usages')
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='coupon_usages')
    order = models.ForeignKey('Order', on_delete=models.CASCADE, related_name='coupon_usage')
    
    # Usage details
    used_at = models.DateTimeField(auto_now_add=True)
    discount_amount = models.DecimalField(max_digits=10, decimal_places=2,
                                        help_text="Actual discount amount applied")
    original_order_value = models.DecimalField(max_digits=10, decimal_places=2,
                                             help_text="Order value before discount")

    class Meta:
        unique_together = ['coupon', 'order']  # One coupon per order
        ordering = ['-used_at']

    def __str__(self):
        return f"{self.coupon.code} used by {self.user.email} on {self.used_at.date()}"
