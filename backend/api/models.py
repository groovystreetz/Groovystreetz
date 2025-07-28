# backend/api/models.py

from django.db import models
from django.contrib.auth.models import AbstractUser
from allauth.account.signals import user_signed_up
from django.dispatch import receiver
import uuid

# Define the choices for the new role field
ROLE_CHOICES = (
    ('customer', 'Customer'),
    ('admin', 'Admin'),
)

class CustomUser(AbstractUser):
    """
    Custom User Model with both username and email fields, using email as login.
    """
    # Explicitly define username field with proper max_length
    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(unique=True)

    # --- NEW FIELD ---
    # This field will store the user's role.
    # It defaults to 'customer' for all new users.
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='customer')

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
    category = models.ForeignKey(Category, related_name='products', on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.URLField(blank=True)  # URL to product image from Printful
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
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    shipping_address = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    printful_order_id = models.CharField(max_length=255, blank=True, null=True)
    tracking_number = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f"Order {self.id} by {self.user.email if self.user else 'Guest'}"


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
