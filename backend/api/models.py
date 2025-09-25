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
    phone = models.CharField(max_length=15, blank=True, null=True)

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
    image = models.ImageField(upload_to='categories/', blank=True, null=True)

    class Meta:
        verbose_name_plural = 'Categories'

    def __str__(self):
        return self.name


class Product(models.Model):
    GENDER_CHOICES = (
        ('male', 'Male'),
        ('female', 'Female'),
        ('unisex', 'Unisex'),
    )

    category = models.ForeignKey(Category, related_name='products', on_delete=models.CASCADE, null=True, blank=True)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to='products/', blank=True, null=True)  # Local image upload
    stock = models.PositiveIntegerField(default=0)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, default='unisex')

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
    
    # ShipRocket Integration Fields
    shiprocket_order_id = models.CharField(max_length=100, blank=True, null=True, 
                                          help_text="ShipRocket order ID")
    awb_code = models.CharField(max_length=100, blank=True, null=True,
                               help_text="Airway Bill number from ShipRocket")
    courier_company_id = models.CharField(max_length=50, blank=True, null=True,
                                         help_text="Courier company ID from ShipRocket")
    courier_company_name = models.CharField(max_length=100, blank=True, null=True,
                                           help_text="Courier company name")
    shipment_id = models.CharField(max_length=100, blank=True, null=True,
                                  help_text="ShipRocket shipment ID")
    shipment_pickup_token = models.CharField(max_length=255, blank=True, null=True,
                                           help_text="Pickup token for shipment")
    shiprocket_status = models.CharField(max_length=50, blank=True, null=True,
                                        help_text="Current status from ShipRocket")
    estimated_delivery_date = models.DateTimeField(blank=True, null=True,
                                                   help_text="Estimated delivery date from courier")
    shipped_date = models.DateTimeField(blank=True, null=True,
                                       help_text="Date when shipment was picked up")
    delivered_date = models.DateTimeField(blank=True, null=True,
                                         help_text="Date when shipment was delivered")
    shipping_charges = models.DecimalField(max_digits=10, decimal_places=2, default=0,
                                          help_text="Actual shipping charges from courier")
    is_shiprocket_enabled = models.BooleanField(default=True,
                                               help_text="Whether to use ShipRocket for this order")

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

    @property
    def is_shipped_via_shiprocket(self):
        """Check if order is shipped through ShipRocket"""
        return bool(self.shiprocket_order_id and self.awb_code)

    @property
    def can_be_tracked(self):
        """Check if order can be tracked"""
        return bool(self.awb_code or self.tracking_number)

    @property
    def shiprocket_tracking_url(self):
        """Generate ShipRocket tracking URL"""
        if self.awb_code:
            return f"https://shiprocket.co/tracking/{self.awb_code}"
        return None

    def get_shiprocket_status_display(self):
        """Get human-readable ShipRocket status"""
        status_mapping = {
            'NEW': 'Order Placed',
            'AWB_ASSIGNED': 'AWB Assigned',
            'PICKUP_GENERATED': 'Pickup Scheduled',
            'PICKED_UP': 'Picked Up',
            'IN_TRANSIT': 'In Transit',
            'OUT_FOR_DELIVERY': 'Out for Delivery',
            'DELIVERED': 'Delivered',
            'RTO': 'Return to Origin',
            'CANCELLED': 'Cancelled',
            'LOST': 'Lost',
            'DAMAGED': 'Damaged'
        }
        return status_mapping.get(self.shiprocket_status, self.shiprocket_status or 'Unknown')

    def update_from_shiprocket_webhook(self, webhook_data):
        """Update order from ShipRocket webhook data"""
        from django.utils import timezone
        
        # Update status
        if 'current_status' in webhook_data:
            self.shiprocket_status = webhook_data['current_status']
            
        # Update dates based on status
        if self.shiprocket_status == 'PICKED_UP' and not self.shipped_date:
            self.shipped_date = timezone.now()
            if self.status == 'pending':
                self.status = 'shipped'
                
        elif self.shiprocket_status == 'DELIVERED' and not self.delivered_date:
            self.delivered_date = timezone.now()
            self.status = 'delivered'
            
        elif self.shiprocket_status == 'CANCELLED':
            self.status = 'cancelled'
        
        # Update tracking information
        if 'etd' in webhook_data:
            try:
                from datetime import datetime
                self.estimated_delivery_date = datetime.fromisoformat(webhook_data['etd'])
            except:
                pass
        
        self.save(update_fields=[
            'shiprocket_status', 'status', 'shipped_date', 
            'delivered_date', 'estimated_delivery_date', 'updated_at'
        ])


class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, related_name='order_items', on_delete=models.CASCADE)
    variant = models.ForeignKey('ProductVariant', related_name='order_items', on_delete=models.CASCADE, null=True, blank=True)
    quantity = models.PositiveIntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2) # Price at the time of purchase

    def __str__(self):
        variant_info = f" - {self.variant.name}" if self.variant else ""
        return f"{self.quantity} of {self.product.name}{variant_info} in Order {self.order.id}"

    @property
    def final_price(self):
        """Get the final price including variant price modifier"""
        from decimal import Decimal
        if self.variant:
            return Decimal(str(self.price)) + Decimal(str(self.variant.price_modifier))
        return self.price


# ==============================================================================
# USER PROFILE MODELS
# ==============================================================================

class Address(models.Model):
    ADDRESS_TYPE_CHOICES = [
        ('Home', 'Home'),
        ('Work', 'Work'),
        ('Other', 'Other'),
    ]

    user = models.ForeignKey(CustomUser, related_name='addresses', on_delete=models.CASCADE)
    address_type = models.CharField(max_length=20, choices=ADDRESS_TYPE_CHOICES, default='Home')
    full_name = models.CharField(max_length=255)
    address_line_1 = models.CharField(max_length=255, verbose_name="Address Line 1")
    address_line_2 = models.CharField(max_length=255, blank=True, null=True, verbose_name="Address Line 2")
    landmark = models.CharField(max_length=255, blank=True, null=True, help_text="Nearby landmark for easy location")
    city = models.CharField(max_length=100)
    state_province = models.CharField(max_length=100, verbose_name="State/Province")
    zip_postal_code = models.CharField(max_length=20, verbose_name="ZIP/Postal Code")
    country = models.CharField(max_length=100, default="India")
    region = models.CharField(max_length=100, blank=True, null=True, help_text="Region or territory")
    phone_number = models.CharField(max_length=20)
    alternative_phone = models.CharField(max_length=20, blank=True, null=True, help_text="Alternative contact number")
    delivery_instructions = models.TextField(blank=True, null=True, help_text="Special instructions for delivery (Optional)")
    is_default = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.full_name} - {self.address_line_1}, {self.city}, {self.state_province}"

    class Meta:
        verbose_name_plural = 'Addresses'

    def save(self, *args, **kwargs):
        # If this address is being set as default, remove default from other addresses
        if self.is_default:
            Address.objects.filter(user=self.user, is_default=True).exclude(id=self.id).update(is_default=False)
        super().save(*args, **kwargs)


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


# ==============================================================================
# NEW MODELS FOR ENHANCED FEATURES
# ==============================================================================

class Testimonial(models.Model):
    """Model for customer testimonials"""
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='testimonials')
    content = models.TextField(help_text="Testimonial content")
    rating = models.PositiveSmallIntegerField(choices=[(i, i) for i in range(1, 6)], help_text="Rating from 1 to 5")
    user_image = models.ImageField(upload_to='testimonials/users/', blank=True, null=True,
                                 help_text="User profile image for testimonial display")
    is_approved = models.BooleanField(default=False, help_text="Admin approval status")
    is_featured = models.BooleanField(default=False, help_text="Feature on homepage")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Testimonial by {self.user.email} - {self.rating} stars"


class ContactMessage(models.Model):
    """Model for contact us messages"""
    SUBJECT_CHOICES = [
        ('general', 'General Inquiry'),
        ('order', 'Order Issue'),
        ('product', 'Product Question'),
        ('shipping', 'Shipping Issue'),
        ('return', 'Return/Refund'),
        ('technical', 'Technical Support'),
        ('other', 'Other')
    ]
    
    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=15, blank=True, null=True)
    subject = models.CharField(max_length=20, choices=SUBJECT_CHOICES, default='general')
    message = models.TextField()
    is_resolved = models.BooleanField(default=False)
    resolved_by = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, blank=True, related_name='resolved_contacts')
    created_at = models.DateTimeField(auto_now_add=True)
    resolved_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Contact from {self.name} - {self.subject}"


class ProductVariant(models.Model):
    """Model for product variants (color, size, etc.)"""
    SIZE_CHOICES = (
        ('xs', 'XS'),
        ('s', 'S'),
        ('m', 'M'),
        ('l', 'L'),
        ('xl', 'XL'),
        ('xxl', 'XXL'),
        ('xxxl', 'XXXL'),
    )
    
    product = models.ForeignKey(Product, related_name='variants', on_delete=models.CASCADE)
    size = models.CharField(max_length=10, choices=SIZE_CHOICES, blank=True)
    color_hex = models.CharField(max_length=7, blank=True, null=True,
                               help_text="Hex color code (e.g., #37821B)")
    color_name = models.CharField(max_length=50, blank=True,
                                help_text="Display name for the color (e.g., Forest Green)")
    sku = models.CharField(max_length=50, unique=True, help_text="Stock Keeping Unit")
    price_modifier = models.DecimalField(max_digits=8, decimal_places=2, default=0, help_text="Price difference from base product")
    stock = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['product', 'size', 'color_hex']
        
    def __str__(self):
        size_part = f"Size {self.size.upper()}" if self.size else ""
        color_part = f"Color {self.color_name}" if self.color_name else (f"Color {self.color_hex}" if self.color_hex else "")
        parts = [part for part in [size_part, color_part] if part]
        return f"{self.product.name} - {', '.join(parts)}" if parts else f"{self.product.name} - Variant"

    @property
    def final_price(self):
        return self.product.price + self.price_modifier

    @property
    def name(self):
        """Generate a name based on size and color for backward compatibility"""
        size_part = self.get_size_display() if self.size else ""
        color_part = self.color_name if self.color_name else (self.color_hex if self.color_hex else "")
        parts = [part for part in [size_part, color_part] if part]
        return ", ".join(parts) if parts else "Default"

    def clean(self):
        from django.core.exceptions import ValidationError
        import re
        super().clean()

        # Validate hex color format
        if self.color_hex and not re.match(r'^#[0-9A-Fa-f]{6}$', self.color_hex):
            raise ValidationError({'color_hex': 'Color must be a valid hex code (e.g., #37821B)'})

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)


class ProductImage(models.Model):
    """Model for multiple product images"""
    product = models.ForeignKey(Product, related_name='images', on_delete=models.CASCADE)
    variant = models.ForeignKey(ProductVariant, related_name='images', on_delete=models.CASCADE, null=True, blank=True)
    image = models.ImageField(upload_to='products/gallery/')
    alt_text = models.CharField(max_length=200, blank=True)
    is_primary = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)
    
    class Meta:
        ordering = ['order', 'id']
        
    def __str__(self):
        return f"Image for {self.product.name}" + (f" - {self.variant.name}" if self.variant else "")


class Review(models.Model):
    """Model for product reviews"""
    product = models.ForeignKey(Product, related_name='reviews', on_delete=models.CASCADE)
    user = models.ForeignKey(CustomUser, related_name='reviews', on_delete=models.CASCADE)
    rating = models.PositiveSmallIntegerField(choices=[(i, i) for i in range(1, 6)])
    title = models.CharField(max_length=200, blank=True)
    comment = models.TextField()
    is_verified_purchase = models.BooleanField(default=False)
    is_approved = models.BooleanField(default=True)
    helpful_count = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['product', 'user']
        ordering = ['-created_at']
        
    def __str__(self):
        return f"Review by {self.user.email} for {self.product.name} - {self.rating} stars"


class RewardPoints(models.Model):
    """Model for user reward points"""
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='reward_points')
    total_points = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Rewards for {self.user.email}: {self.total_points} points"


class RewardTransaction(models.Model):
    """Model to track reward point transactions"""
    TRANSACTION_TYPES = [
        ('earn', 'Earned Points'),
        ('redeem', 'Redeemed Points'),
        ('expire', 'Expired Points'),
        ('bonus', 'Bonus Points'),
    ]
    
    user = models.ForeignKey(CustomUser, related_name='reward_transactions', on_delete=models.CASCADE)
    transaction_type = models.CharField(max_length=10, choices=TRANSACTION_TYPES)
    points = models.IntegerField(help_text="Positive for earning, negative for spending")
    description = models.CharField(max_length=200)
    order = models.ForeignKey(Order, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
        
    def __str__(self):
        return f"{self.user.email} - {self.transaction_type}: {self.points} points"


class Banner(models.Model):
    """Model for homepage banners"""
    BANNER_TYPES = [
        ('hero', 'Hero Banner'),
        ('promotion', 'Promotional Banner'),
        ('category', 'Category Banner'),
    ]

    GENDER_CHOICES = [
        ('male', 'Male'),
        ('female', 'Female'),
        ('unisex', 'Unisex'),
    ]

    title = models.CharField(max_length=200)
    subtitle = models.CharField(max_length=300, blank=True)
    image = models.ImageField(upload_to='banners/')
    banner_type = models.CharField(max_length=20, choices=BANNER_TYPES, default='promotion')
    target_gender = models.CharField(max_length=10, choices=GENDER_CHOICES, default='unisex',
                                   help_text="Target audience gender for this banner")
    link_url = models.URLField(blank=True, help_text="Optional link for banner")
    link_text = models.CharField(max_length=50, blank=True, help_text="Button text")
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)
    start_date = models.DateTimeField(null=True, blank=True)
    end_date = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', '-created_at']

    def __str__(self):
        return f"{self.banner_type.title()} Banner: {self.title} ({self.get_target_gender_display()})"


class Spotlight(models.Model):
    """Model for spotlight products/categories"""
    SPOTLIGHT_TYPES = [
        ('product', 'Product'),
        ('category', 'Category'),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    spotlight_type = models.CharField(max_length=20, choices=SPOTLIGHT_TYPES)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, null=True, blank=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, null=True, blank=True)
    image = models.ImageField(upload_to='spotlight/', blank=True)
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', '-created_at']

    def clean(self):
        from django.core.exceptions import ValidationError
        super().clean()

        if self.spotlight_type == 'product' and not self.product:
            raise ValidationError({'product': 'Product is required when spotlight type is "product".'})

        if self.spotlight_type == 'category' and not self.category:
            raise ValidationError({'category': 'Category is required when spotlight type is "category".'})

        if self.spotlight_type == 'product' and self.category:
            raise ValidationError({'category': 'Category should not be set when spotlight type is "product".'})

        if self.spotlight_type == 'category' and self.product:
            raise ValidationError({'product': 'Product should not be set when spotlight type is "category".'})

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

    def __str__(self):
        if self.spotlight_type == 'product' and self.product:
            return f"Spotlight: {self.title} (Product: {self.product.name})"
        elif self.spotlight_type == 'category' and self.category:
            return f"Spotlight: {self.title} (Category: {self.category.name})"
        return f"Spotlight: {self.title}"


# ==============================================================================
# ADVANCED ROLE AND PERMISSION SYSTEM
# ==============================================================================

class Permission(models.Model):
    """Model for granular permissions"""
    PERMISSION_TYPES = [
        ('read', 'Read Access'),
        ('write', 'Write Access'),
        ('delete', 'Delete Access'),
        ('manage', 'Full Management Access'),
    ]
    
    RESOURCE_TYPES = [
        ('users', 'User Management'),
        ('products', 'Product Management'),
        ('orders', 'Order Management'),
        ('coupons', 'Coupon Management'),
        ('reviews', 'Review Management'),
        ('testimonials', 'Testimonial Management'),
        ('contacts', 'Contact Management'),
        ('banners', 'Banner Management'),
        ('spotlights', 'Spotlight Management'),
        ('rewards', 'Reward Points Management'),
        ('analytics', 'Analytics & Reports'),
    ]
    
    name = models.CharField(max_length=100, unique=True)
    codename = models.CharField(max_length=50, unique=True)
    permission_type = models.CharField(max_length=10, choices=PERMISSION_TYPES)
    resource_type = models.CharField(max_length=20, choices=RESOURCE_TYPES)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['permission_type', 'resource_type']
        ordering = ['resource_type', 'permission_type']
    
    def __str__(self):
        return f"{self.name} ({self.permission_type} {self.resource_type})"


class Role(models.Model):
    """Enhanced role model with granular permissions"""
    name = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True)
    permissions = models.ManyToManyField(Permission, blank=True, related_name='roles')
    is_active = models.BooleanField(default=True)
    is_system_role = models.BooleanField(default=False, help_text="System roles cannot be deleted")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name
    
    def has_permission(self, permission_codename):
        """Check if role has specific permission"""
        return self.permissions.filter(
            codename=permission_codename,
            is_active=True
        ).exists()


class UserRole(models.Model):
    """Model to assign roles to users with additional context"""
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='user_roles')
    role = models.ForeignKey(Role, on_delete=models.CASCADE, related_name='user_assignments')
    assigned_by = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, related_name='role_assignments_made')
    assigned_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        unique_together = ['user', 'role']
    
    def __str__(self):
        return f"{self.user.email} - {self.role.name}"


# Update the CustomUser model to work with new role system
def get_user_permissions(user):
    """Get all permissions for a user based on their roles"""
    if not user.is_authenticated:
        return Permission.objects.none()
    
    return Permission.objects.filter(
        roles__user_assignments__user=user,
        roles__user_assignments__is_active=True,
        roles__is_active=True,
        is_active=True
    ).distinct()


def user_has_permission(user, permission_codename):
    """Check if user has specific permission"""
    return get_user_permissions(user).filter(codename=permission_codename).exists()


# Add method to CustomUser model
CustomUser.add_to_class('get_permissions', lambda self: get_user_permissions(self))
CustomUser.add_to_class('has_permission', lambda self, perm: user_has_permission(self, perm))
