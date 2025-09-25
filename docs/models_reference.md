# Database Models Reference

## Enhanced User Management

### CustomUser Model
Extended Django user model with additional fields and role support.

```python
class CustomUser(AbstractUser):
    username = CharField(max_length=150, unique=True)
    email = EmailField(unique=True)  
    phone = CharField(max_length=15, blank=True, null=True)  # NEW
    role = CharField(max_length=15, choices=ROLE_CHOICES, default='customer')
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    
    # New methods
    def get_permissions(self) -> QuerySet[Permission]
    def has_permission(self, permission_codename: str) -> bool
```

**Key Features:**
- Email-based authentication
- Phone number support for contact
- Role-based access control integration
- Auto-generated usernames for social login

## Enhanced E-commerce Models

### Category Model (Enhanced)
```python
class Category(models.Model):
    name = CharField(max_length=255, unique=True)
    slug = SlugField(max_length=255, unique=True)
    image = ImageField(upload_to='categories/', blank=True, null=True)  # NEW
```

**New Features:**
- Category images for better visual representation
- Image upload handling with proper directory structure

### Product Model (Enhanced)
```python
class Product(models.Model):
    GENDER_CHOICES = (
        ('male', 'Male'),
        ('female', 'Female'),
        ('unisex', 'Unisex'),
    )

    category = ForeignKey(Category, related_name='products', on_delete=CASCADE)
    name = CharField(max_length=255)
    description = TextField(blank=True)
    price = DecimalField(max_digits=10, decimal_places=2)
    image = ImageField(upload_to='products/', blank=True, null=True)
    stock = PositiveIntegerField(default=0)
    gender = CharField(max_length=10, choices=GENDER_CHOICES, default='unisex')  # NEW
    created_at = DateTimeField(auto_now_add=True)
    updated_at = DateTimeField(auto_now=True)

    # New related models: variants, images, reviews
```

**Enhanced Capabilities:**
- **Gender-based filtering**: Male, Female, Unisex categories
- Product variants with separate color and size fields
- Multiple images per product/variant
- Customer reviews and ratings
- Advanced filtering and search support

## New Advanced Models

### ProductVariant Model (Updated - Hexadecimal Colors)
```python
class ProductVariant(models.Model):
    SIZE_CHOICES = (
        ('xs', 'XS'), ('s', 'S'), ('m', 'M'), ('l', 'L'),
        ('xl', 'XL'), ('xxl', 'XXL'), ('xxxl', 'XXXL'),
    )

    product = ForeignKey(Product, related_name='variants', on_delete=CASCADE)
    size = CharField(max_length=10, choices=SIZE_CHOICES, blank=True)
    color_hex = CharField(max_length=7, blank=True, null=True,
                         help_text="Hex color code (e.g., #37821B)")  # NEW: Hex colors
    color_name = CharField(max_length=50, blank=True,
                          help_text="Display name for the color (e.g., Forest Green)")  # NEW
    sku = CharField(max_length=50, unique=True)
    price_modifier = DecimalField(max_digits=8, decimal_places=2, default=0)
    stock = PositiveIntegerField(default=0)
    is_active = BooleanField(default=True)
    created_at = DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['product', 'size', 'color_hex']  # Updated constraint

    def clean(self):
        # Validates hex color format (#37821B)
        if self.color_hex and not re.match(r'^#[0-9A-Fa-f]{6}$', self.color_hex):
            raise ValidationError({'color_hex': 'Color must be a valid hex code'})

    @property
    def final_price(self):
        return self.product.price + self.price_modifier

    @property
    def name(self):
        """Generate name based on size and color for backward compatibility"""
        size_part = self.get_size_display() if self.size else ""
        color_part = self.get_color_display() if self.color else ""
        parts = [part for part in [size_part, color_part] if part]
        return ", ".join(parts) if parts else "Default"
```

**Enhanced Features:**
- **Separate size and color fields**: Better data structure for filtering
- **Predefined choices**: 7 sizes (XS-XXXL) and 15 colors
- **Unique constraint**: Prevents duplicate size/color combinations per product
- **Backward compatibility**: Name property maintains existing functionality
- **Database integrity**: Proper normalization for filtering and inventory

### ProductImage Model
```python
class ProductImage(models.Model):
    product = ForeignKey(Product, related_name='images', on_delete=CASCADE)
    variant = ForeignKey(ProductVariant, related_name='images', null=True, blank=True)
    image = ImageField(upload_to='products/gallery/')
    alt_text = CharField(max_length=200, blank=True)
    is_primary = BooleanField(default=False)
    order = PositiveIntegerField(default=0)
```

**Features:**
- Multiple images per product
- Variant-specific images (red shirt shows red images)
- Image ordering for galleries
- Accessibility support with alt text
- Primary image designation

## Review System

### Review Model
```python
class Review(models.Model):
    product = ForeignKey(Product, related_name='reviews', on_delete=CASCADE)
    user = ForeignKey(CustomUser, related_name='reviews', on_delete=CASCADE)
    rating = PositiveSmallIntegerField(choices=[(i, i) for i in range(1, 6)])
    title = CharField(max_length=200, blank=True)
    comment = TextField()
    is_verified_purchase = BooleanField(default=False)
    is_approved = BooleanField(default=True)
    helpful_count = PositiveIntegerField(default=0)
    created_at = DateTimeField(auto_now_add=True)
    updated_at = DateTimeField(auto_now=True)
```

**Features:**
- 5-star rating system
- Verified purchase detection
- Admin moderation capability
- Helpful voting system
- One review per user per product

## Reward Points System

### RewardPoints Model
```python
class RewardPoints(models.Model):
    user = OneToOneField(CustomUser, on_delete=CASCADE, related_name='reward_points')
    total_points = PositiveIntegerField(default=0)
    created_at = DateTimeField(auto_now_add=True)
    updated_at = DateTimeField(auto_now=True)
```

### RewardTransaction Model
```python
class RewardTransaction(models.Model):
    TRANSACTION_TYPES = [
        ('earn', 'Earned Points'),
        ('redeem', 'Redeemed Points'),
        ('expire', 'Expired Points'),
        ('bonus', 'Bonus Points'),
    ]
    
    user = ForeignKey(CustomUser, related_name='reward_transactions', on_delete=CASCADE)
    transaction_type = CharField(max_length=10, choices=TRANSACTION_TYPES)
    points = IntegerField()  # Positive for earning, negative for spending
    description = CharField(max_length=200)
    order = ForeignKey(Order, on_delete=SET_NULL, null=True, blank=True)
    created_at = DateTimeField(auto_now_add=True)
```

**Business Logic:**
- Points earned: 5-10 per product purchase
- Redemption rate: 1000 points = ₹1000 coupon
- Complete transaction history
- Order association for purchase-based points

## Content Management Models

### Testimonial Model (Enhanced)
```python
class Testimonial(models.Model):
    user = ForeignKey(CustomUser, on_delete=CASCADE, related_name='testimonials')
    content = TextField(help_text="Testimonial content")
    rating = PositiveSmallIntegerField(choices=[(i, i) for i in range(1, 6)])
    user_image = ImageField(upload_to='testimonials/users/', blank=True, null=True,
                           help_text="User profile image for testimonial display")  # NEW
    is_approved = BooleanField(default=False, help_text="Admin approval status")
    is_featured = BooleanField(default=False, help_text="Feature on homepage")
    created_at = DateTimeField(auto_now_add=True)
    updated_at = DateTimeField(auto_now=True)
```

**New Features:**
- **User profile images**: Display user photos alongside testimonials
- Enhanced admin controls for approval and featuring

### ContactMessage Model
```python
class ContactMessage(models.Model):
    SUBJECT_CHOICES = [
        ('general', 'General Inquiry'),
        ('order', 'Order Issue'),
        ('product', 'Product Question'),
        ('shipping', 'Shipping Issue'),
        ('return', 'Return/Refund'),
        ('technical', 'Technical Support'),
        ('other', 'Other')
    ]
    
    name = CharField(max_length=100)
    email = EmailField()
    phone = CharField(max_length=15, blank=True, null=True)
    subject = CharField(max_length=20, choices=SUBJECT_CHOICES)
    message = TextField()
    is_resolved = BooleanField(default=False)
    resolved_by = ForeignKey(CustomUser, on_delete=SET_NULL, null=True, blank=True)
    created_at = DateTimeField(auto_now_add=True)
    resolved_at = DateTimeField(null=True, blank=True)
```

### Banner Model (Enhanced - Gender Targeting)
```python
class Banner(models.Model):
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

    title = CharField(max_length=200)
    subtitle = CharField(max_length=300, blank=True)
    image = ImageField(upload_to='banners/')
    banner_type = CharField(max_length=20, choices=BANNER_TYPES)
    target_gender = CharField(max_length=10, choices=GENDER_CHOICES, default='unisex',
                             help_text="Target audience gender for this banner")  # NEW
    link_url = URLField(blank=True)
    link_text = CharField(max_length=50, blank=True)
    is_active = BooleanField(default=True)
    order = PositiveIntegerField(default=0)
    start_date = DateTimeField(null=True, blank=True)
    end_date = DateTimeField(null=True, blank=True)
    created_at = DateTimeField(auto_now_add=True)
```

### Spotlight Model (Enhanced - Real Product/Category Links)
```python
class Spotlight(models.Model):
    SPOTLIGHT_TYPES = [
        ('product', 'Product'),
        ('category', 'Category'),
        # Removed 'collection' - only real products/categories allowed
    ]

    title = CharField(max_length=200)
    description = TextField(blank=True)
    spotlight_type = CharField(max_length=20, choices=SPOTLIGHT_TYPES)
    product = ForeignKey(Product, on_delete=CASCADE, null=True, blank=True)
    category = ForeignKey(Category, on_delete=CASCADE, null=True, blank=True)
    image = ImageField(upload_to='spotlight/', blank=True)
    is_active = BooleanField(default=True)
    order = PositiveIntegerField(default=0)
    created_at = DateTimeField(auto_now_add=True)

    def clean(self):
        # Validation: ensures real product/category references
        if self.spotlight_type == 'product' and not self.product:
            raise ValidationError({'product': 'Product is required when spotlight type is "product".'})
        if self.spotlight_type == 'category' and not self.category:
            raise ValidationError({'category': 'Category is required when spotlight type is "category".'})
        # Prevents cross-linking
        if self.spotlight_type == 'product' and self.category:
            raise ValidationError({'category': 'Category should not be set when spotlight type is "product".'})
        if self.spotlight_type == 'category' and self.product:
            raise ValidationError({'product': 'Product should not be set when spotlight type is "category".'})
```

**Enhanced Features:**
- **Real references only**: Removes generic 'collection' type, requires actual product/category links
- **Validation logic**: Ensures spotlight always points to real content
- **Cross-link prevention**: Prevents conflicting product/category assignments

## Advanced Permission System

### Permission Model
```python
class Permission(models.Model):
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
    
    name = CharField(max_length=100, unique=True)
    codename = CharField(max_length=50, unique=True)
    permission_type = CharField(max_length=10, choices=PERMISSION_TYPES)
    resource_type = CharField(max_length=20, choices=RESOURCE_TYPES)
    description = TextField(blank=True)
    is_active = BooleanField(default=True)
    created_at = DateTimeField(auto_now_add=True)
```

### Role Model
```python
class Role(models.Model):
    name = CharField(max_length=50, unique=True)
    description = TextField(blank=True)
    permissions = ManyToManyField(Permission, blank=True, related_name='roles')
    is_active = BooleanField(default=True)
    is_system_role = BooleanField(default=False)
    created_at = DateTimeField(auto_now_add=True)
    updated_at = DateTimeField(auto_now=True)
    
    def has_permission(self, permission_codename: str) -> bool
```

### UserRole Model
```python
class UserRole(models.Model):
    user = ForeignKey(CustomUser, on_delete=CASCADE, related_name='user_roles')
    role = ForeignKey(Role, on_delete=CASCADE, related_name='user_assignments')
    assigned_by = ForeignKey(CustomUser, on_delete=SET_NULL, null=True)
    assigned_at = DateTimeField(auto_now_add=True)
    is_active = BooleanField(default=True)
```

## Enhanced Existing Models

### Order Model (Enhanced)
```python
class Order(models.Model):
    # Existing fields...
    user = ForeignKey(CustomUser, related_name='orders', on_delete=SET_NULL)
    status = CharField(max_length=20, choices=STATUS_CHOICES)
    original_price = DecimalField(max_digits=10, decimal_places=2, default=0)
    discount_amount = DecimalField(max_digits=10, decimal_places=2, default=0)
    total_price = DecimalField(max_digits=10, decimal_places=2)
    applied_coupon = ForeignKey('Coupon', on_delete=SET_NULL, null=True)
    no_return_allowed = BooleanField(default=False)
    shipping_address = TextField()
    tracking_number = CharField(max_length=255, blank=True, null=True)  # NEW
    created_at = DateTimeField(auto_now_add=True)
    updated_at = DateTimeField(auto_now=True)
    
    # New properties
    @property
    def has_discount(self) -> bool
    @property  
    def discount_percentage(self) -> float
```

### Address Model (Comprehensive Enhancement)
```python
class Address(models.Model):
    ADDRESS_TYPE_CHOICES = [
        ('Home', 'Home'),
        ('Work', 'Work'),
        ('Other', 'Other'),
    ]

    user = ForeignKey(CustomUser, related_name='addresses', on_delete=CASCADE)
    address_type = CharField(max_length=20, choices=ADDRESS_TYPE_CHOICES, default='Home')  # NEW
    full_name = CharField(max_length=255)  # NEW
    address_line_1 = CharField(max_length=255, verbose_name="Address Line 1")
    address_line_2 = CharField(max_length=255, blank=True, null=True, verbose_name="Address Line 2")
    landmark = CharField(max_length=255, blank=True, null=True,
                        help_text="Nearby landmark for easy location")  # NEW
    city = CharField(max_length=100)
    state_province = CharField(max_length=100, verbose_name="State/Province")  # RENAMED
    zip_postal_code = CharField(max_length=20, verbose_name="ZIP/Postal Code")  # RENAMED
    country = CharField(max_length=100, default="India")
    region = CharField(max_length=100, blank=True, null=True,
                      help_text="Region or territory")  # NEW
    phone_number = CharField(max_length=20)  # NEW
    alternative_phone = CharField(max_length=20, blank=True, null=True,
                                 help_text="Alternative contact number")  # NEW
    delivery_instructions = TextField(blank=True, null=True,
                                    help_text="Special instructions for delivery")  # NEW
    is_default = BooleanField(default=False)

    def save(self, *args, **kwargs):
        # Auto-manages default setting - ensures only one default per user
        if self.is_default:
            Address.objects.filter(user=self.user, is_default=True).exclude(id=self.id).update(is_default=False)
        super().save(*args, **kwargs)
```

**New Features:**
- **Address types**: Home, Work, Other categorization
- **Full contact details**: Full name and dual phone numbers
- **Delivery optimization**: Landmarks and special delivery instructions
- **Enhanced addressing**: Region support and better field naming
- **Smart default management**: Automatic single-default enforcement
```

## Database Relationships

### Product Ecosystem
```
Product (1) -> (M) ProductVariant
Product (1) -> (M) ProductImage  
ProductVariant (1) -> (M) ProductImage
Product (1) -> (M) Review
Product (1) -> (M) OrderItem
```

### User Ecosystem
```  
CustomUser (1) -> (1) RewardPoints
CustomUser (1) -> (M) RewardTransaction
CustomUser (1) -> (M) Address
CustomUser (1) -> (M) Review
CustomUser (1) -> (M) Testimonial
CustomUser (1) -> (M) Order
CustomUser (1) -> (M) UserRole
```

### Permission System
```
Permission (M) -> (M) Role
Role (M) -> (M) UserRole -> (1) CustomUser
```

### Content Management
```
CustomUser (1) -> (M) ContactMessage
Banner (independent)
Spotlight -> Product | Category (optional)
```

### OrderItem Model (Enhanced)
```python
class OrderItem(models.Model):
    order = ForeignKey(Order, related_name='items', on_delete=CASCADE)
    product = ForeignKey(Product, related_name='order_items', on_delete=CASCADE)
    variant = ForeignKey('ProductVariant', related_name='order_items',
                        on_delete=CASCADE, null=True, blank=True)  # NEW
    quantity = PositiveIntegerField(default=1)
    price = DecimalField(max_digits=10, decimal_places=2)  # Price at time of purchase

    @property
    def final_price(self):
        """Get the final price including variant price modifier"""
        from decimal import Decimal
        if self.variant:
            return Decimal(str(self.price)) + Decimal(str(self.variant.price_modifier))
        return self.price
```

**Enhanced Features:**
- **Variant support**: Optional link to specific ProductVariant
- **Backward compatibility**: Existing orders without variants still work
- **Price calculation**: Includes variant modifiers in final price
- **Order tracking**: Know exactly which size/color was ordered

## Migration History

### Recent Migrations (Updated)
1. **0009_category_image.py** - Added image field to Category
2. **0010_customuser_phone.py** - Added phone field to CustomUser
3. **0011_banner_contactmessage_productvariant_...py** - Added all new models
4. **0012_permission_role_userrole.py** - Added permission system
5. **0013_add_shiprocket_fields_to_order.py** - Added ShipRocket integration
6. **0014_add_variant_fields.py** - Added gender to Product, color/size to ProductVariant, variant to OrderItem
7. **0015_add_unique_constraint.py** - Added unique constraint for ProductVariant (product+size+color)

### Migration Commands
```bash
# Create migrations
python manage.py makemigrations

# Apply migrations  
python manage.py migrate

# Show migration status
python manage.py showmigrations api
```

## Database Indexes

### Recommended Indexes
```python
# Product filtering
Product.objects.filter(category__slug__in=categories, price__gte=min_price)
# Index on: category_id, price, created_at

# Review lookups
Review.objects.filter(product_id=X, is_approved=True)  
# Index on: product_id, is_approved

# Permission checks
Permission.objects.filter(roles__user_assignments__user=user, is_active=True)
# Index on: is_active, codename

# Order history
Order.objects.filter(user_id=X).order_by('-created_at')
# Index on: user_id, created_at
```

## Model Validation

### Custom Validators
- **Price validation**: Non-negative prices
- **Rating validation**: 1-5 star range  
- **Phone validation**: Proper phone format
- **SKU uniqueness**: Across all product variants
- **Email uniqueness**: User email addresses
- **Permission validation**: Valid permission/resource combinations

### Business Logic Validation  
- **Default address**: Only one default per user
- **Review uniqueness**: One review per user per product  
- **Coupon usage**: Respect usage limits and restrictions
- **Stock tracking**: Prevent overselling
- **Role assignment**: Only SuperAdmins can assign roles

This comprehensive model reference provides the foundation for understanding the complete data structure and relationships within the GroovyStreetz backend system.