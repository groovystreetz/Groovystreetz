# backend/api/serializers.py

from django.contrib.auth import authenticate, get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from dj_rest_auth.serializers import UserDetailsSerializer
from dj_rest_auth.registration.serializers import RegisterSerializer as DefaultRegisterSerializer


User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'password2')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
        )
        user.set_password(validated_data['password'])
        user.save()
        return user


class LoginSerializer(serializers.Serializer):
    """
    Serializer for user login. It authenticates using email and password.
    """
    # We now expect an 'email' field for login, not a 'username'.
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, data):
        # The authenticate function needs the request context to work properly
        request = self.context.get('request')
        
        # Since our CustomUser model has USERNAME_FIELD = 'email', Django's
        # authenticate function knows to treat the 'username' parameter as an email.
        user = authenticate(request=request, username=data.get('email'), password=data.get('password'))

        if user and user.is_active:
            return user
        raise serializers.ValidationError("Unable to log in with provided credentials.")


class CustomUserDetailsSerializer(UserDetailsSerializer):
    """
    Custom serializer for the user details endpoint.
    This controls the data returned when fetching user info (e.g., after login).
    """
    class Meta(UserDetailsSerializer.Meta):
        model = User
        # Define the specific fields to include in the API response.
        # This gives us full control over what user data is exposed.
        fields = ('pk', 'email', 'username', 'first_name', 'last_name', 'role', 'phone')
        # Added 'role' and 'phone' field to expose the user's role and phone in API responses


class AdminUserSerializer(serializers.ModelSerializer):
    """
    Admin serializer for user management with role update capability.
    """
    class Meta:
        model = User
        fields = ('pk', 'email', 'username', 'first_name', 'last_name', 'role', 'phone', 'is_active', 'date_joined', 'last_login')
        read_only_fields = ('date_joined', 'last_login')


# ==============================================================================
# E-COMMERCE SERIALIZERS
# ==============================================================================
from .models import Category, Product

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ('id', 'name', 'slug', 'image')


class ProductSerializer(serializers.ModelSerializer):
    # To display the category name instead of its ID
    category = serializers.StringRelatedField()
    gender_display = serializers.CharField(source='get_gender_display', read_only=True)

    class Meta:
        model = Product
        fields = ('id', 'name', 'description', 'price', 'image', 'category', 'stock', 'gender', 'gender_display')


class AdminProductSerializer(serializers.ModelSerializer):
    gender_display = serializers.CharField(source='get_gender_display', read_only=True)
    
    class Meta:
        model = Product
        fields = ('id', 'name', 'description', 'price', 'image', 'category', 'stock', 'gender', 'gender_display')




from .models import Design

class DesignSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Design
        fields = ('id', 'user', 'image_url', 'created_at')
        read_only_fields = ('created_at',)


from .models import Order, OrderItem

class OrderItemSerializer(serializers.ModelSerializer):
    final_price = serializers.ReadOnlyField()
    variant_name = serializers.CharField(source='variant.name', read_only=True, allow_null=True)
    product_name = serializers.CharField(source='product.name', read_only=True)

    class Meta:
        model = OrderItem
        fields = ('product', 'product_name', 'variant', 'variant_name', 'quantity', 'price', 'final_price')


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    coupon_code = serializers.CharField(source='applied_coupon.code', read_only=True)
    discount_percentage = serializers.ReadOnlyField()
    has_discount = serializers.ReadOnlyField()
    
    # ShipRocket related fields
    is_shipped_via_shiprocket = serializers.ReadOnlyField()
    can_be_tracked = serializers.ReadOnlyField()
    shiprocket_tracking_url = serializers.ReadOnlyField()
    shiprocket_status_display = serializers.CharField(source='get_shiprocket_status_display', read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'user', 'items', 'original_price', 'discount_amount', 'total_price',
            'shipping_address', 'created_at', 'updated_at', 'status', 'applied_coupon', 'coupon_code',
            'no_return_allowed', 'discount_percentage', 'has_discount', 'tracking_number',
            # ShipRocket fields
            'shiprocket_order_id', 'awb_code', 'courier_company_id', 'courier_company_name',
            'shipment_id', 'shiprocket_status', 'shiprocket_status_display', 'estimated_delivery_date',
            'shipped_date', 'delivered_date', 'shipping_charges', 'is_shiprocket_enabled',
            'is_shipped_via_shiprocket', 'can_be_tracked', 'shiprocket_tracking_url'
        ]
        read_only_fields = [
            'created_at', 'updated_at', 'status', 'discount_percentage', 'has_discount',
            'shiprocket_order_id', 'awb_code', 'courier_company_id', 'courier_company_name',
            'shipment_id', 'shiprocket_status', 'shiprocket_status_display', 'estimated_delivery_date',
            'shipped_date', 'delivered_date', 'shipping_charges', 'tracking_number',
            'is_shipped_via_shiprocket', 'can_be_tracked', 'shiprocket_tracking_url'
        ]

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        
        # Set original_price equal to total_price if not provided (for backward compatibility)
        if 'original_price' not in validated_data:
            validated_data['original_price'] = validated_data['total_price']
        
        order = Order.objects.create(**validated_data)
        for item_data in items_data:
            OrderItem.objects.create(order=order, **item_data)
        return order


# ==============================================================================
# USER PROFILE SERIALIZERS
# ==============================================================================
from .models import Address

class AddressSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Address
        fields = '__all__'


from .models import Wishlist

class WishlistSerializer(serializers.ModelSerializer):
    products = ProductSerializer(many=True, read_only=True)
    total_items = serializers.SerializerMethodField()
    total_value = serializers.SerializerMethodField()
    
    class Meta:
        model = Wishlist
        fields = ('user', 'products', 'total_items', 'total_value')
    
    def get_total_items(self, obj):
        return obj.products.count()
    
    def get_total_value(self, obj):
        return sum(product.price for product in obj.products.all())


class WishlistProductSerializer(serializers.ModelSerializer):
    """Simplified product serializer for wishlist operations"""
    class Meta:
        model = Product
        fields = ('id', 'name', 'price', 'image', 'stock')


# ==============================================================================
# COUPON SERIALIZERS
# ==============================================================================
from .models import Coupon, CouponUsage, Category, Product

class CouponSerializer(serializers.ModelSerializer):
    total_uses = serializers.ReadOnlyField()
    is_valid_date_range = serializers.ReadOnlyField()
    created_by_email = serializers.CharField(source='created_by.email', read_only=True)

    class Meta:
        model = Coupon
        fields = [
            'id', 'code', 'name', 'description', 'discount_type', 'discount_value',
            'minimum_order_value', 'max_uses_total', 'max_uses_per_user',
            'valid_from', 'valid_until', 'is_active', 'no_return_policy',
            'allow_stacking', 'total_uses', 'is_valid_date_range',
            'created_by_email', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at', 'total_uses']

    def validate_code(self, value):
        """Ensure coupon code is uppercase and unique"""
        value = value.upper().strip()
        if Coupon.objects.filter(code=value).exclude(id=self.instance.id if self.instance else None).exists():
            raise serializers.ValidationError("A coupon with this code already exists.")
        return value

    def validate(self, data):
        """Validate date range and discount value"""
        if data.get('valid_from') and data.get('valid_until'):
            if data['valid_from'] >= data['valid_until']:
                raise serializers.ValidationError("Valid from date must be before valid until date.")

        discount_type = data.get('discount_type')
        discount_value = data.get('discount_value')

        if discount_type == 'percentage' and (discount_value <= 0 or discount_value > 100):
            raise serializers.ValidationError("Percentage discount must be between 1 and 100.")
        
        if discount_type in ['fixed', 'free_shipping'] and discount_value <= 0:
            raise serializers.ValidationError("Fixed discount amount must be greater than 0.")

        return data


class AdminCouponSerializer(CouponSerializer):
    """Extended coupon serializer for admin operations"""
    categories = serializers.PrimaryKeyRelatedField(
        many=True, 
        queryset=Category.objects.all(),
        required=False
    )
    products = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Product.objects.all(),
        required=False
    )
    user_restrictions = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=User.objects.all(),
        required=False
    )

    class Meta(CouponSerializer.Meta):
        fields = CouponSerializer.Meta.fields + ['categories', 'products', 'user_restrictions']


class CouponUsageSerializer(serializers.ModelSerializer):
    coupon_code = serializers.CharField(source='coupon.code', read_only=True)
    coupon_name = serializers.CharField(source='coupon.name', read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)

    class Meta:
        model = CouponUsage
        fields = [
            'id', 'coupon_code', 'coupon_name', 'user_email', 
            'used_at', 'discount_amount', 'original_order_value'
        ]


class CouponValidationSerializer(serializers.Serializer):
    """Serializer for coupon validation requests"""
    coupon_code = serializers.CharField(max_length=50)
    order_total = serializers.DecimalField(max_digits=10, decimal_places=2, min_value=0)
    
    def validate_coupon_code(self, value):
        return value.upper().strip()


class ApplyCouponSerializer(serializers.Serializer):
    """Serializer for applying coupon to order"""
    coupon_code = serializers.CharField(max_length=50)
    
    def validate_coupon_code(self, value):
        return value.upper().strip()


# ==============================================================================
# NEW SERIALIZERS FOR ENHANCED FEATURES
# ==============================================================================

from .models import (
    Testimonial, ContactMessage, ProductVariant, ProductImage, Review, 
    RewardPoints, RewardTransaction, Banner, Spotlight, Permission, Role, UserRole
)


class TestimonialSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)
    
    class Meta:
        model = Testimonial
        fields = ['id', 'user', 'user_name', 'user_email', 'content', 'rating', 
                 'is_approved', 'is_featured', 'created_at', 'updated_at']
        read_only_fields = ['user', 'created_at', 'updated_at']


class AdminTestimonialSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)
    
    class Meta:
        model = Testimonial
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ['id', 'name', 'email', 'phone', 'subject', 'message', 
                 'is_resolved', 'created_at']
        read_only_fields = ['created_at']


class AdminContactMessageSerializer(serializers.ModelSerializer):
    resolved_by_name = serializers.CharField(source='resolved_by.get_full_name', read_only=True)
    
    class Meta:
        model = ContactMessage
        fields = '__all__'
        read_only_fields = ['created_at']


class ProductVariantSerializer(serializers.ModelSerializer):
    final_price = serializers.ReadOnlyField()
    size_display = serializers.CharField(source='get_size_display', read_only=True)
    color_display = serializers.CharField(source='get_color_display', read_only=True)
    
    class Meta:
        model = ProductVariant
        fields = ['id', 'size', 'color', 'size_display', 'color_display', 'sku', 'price_modifier', 'final_price', 
                 'stock', 'is_active', 'created_at']
        read_only_fields = ['created_at']


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'alt_text', 'is_primary', 'order', 'variant']


class ReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)
    
    class Meta:
        model = Review
        fields = ['id', 'product', 'user', 'user_name', 'user_email', 'rating', 
                 'title', 'comment', 'is_verified_purchase', 'is_approved', 
                 'helpful_count', 'created_at', 'updated_at']
        read_only_fields = ['user', 'is_verified_purchase', 'helpful_count', 
                           'created_at', 'updated_at']


class AdminReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)
    product_name = serializers.CharField(source='product.name', read_only=True)
    
    class Meta:
        model = Review
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


class RewardPointsSerializer(serializers.ModelSerializer):
    class Meta:
        model = RewardPoints
        fields = ['total_points', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']


class RewardTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = RewardTransaction
        fields = ['id', 'transaction_type', 'points', 'description', 'order', 'created_at']
        read_only_fields = ['created_at']


class BannerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Banner
        fields = ['id', 'title', 'subtitle', 'image', 'banner_type', 'link_url', 
                 'link_text', 'is_active', 'order', 'start_date', 'end_date', 'created_at']
        read_only_fields = ['created_at']


class SpotlightSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    
    class Meta:
        model = Spotlight
        fields = ['id', 'title', 'description', 'spotlight_type', 'product', 
                 'product_name', 'category', 'category_name', 'image', 
                 'is_active', 'order', 'created_at']
        read_only_fields = ['created_at']


# Enhanced Product Serializer with variants and images
class EnhancedProductSerializer(serializers.ModelSerializer):
    category = serializers.StringRelatedField()
    variants = ProductVariantSerializer(many=True, read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    reviews = ReviewSerializer(many=True, read_only=True)
    average_rating = serializers.SerializerMethodField()
    review_count = serializers.SerializerMethodField()
    gender_display = serializers.CharField(source='get_gender_display', read_only=True)
    
    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'price', 'image', 'category', 
                 'stock', 'gender', 'gender_display', 'variants', 'images', 'reviews', 'average_rating', 
                 'review_count', 'created_at', 'updated_at']
    
    def get_average_rating(self, obj):
        reviews = obj.reviews.filter(is_approved=True)
        if reviews.exists():
            return round(sum(r.rating for r in reviews) / reviews.count(), 1)
        return 0
    
    def get_review_count(self, obj):
        return obj.reviews.filter(is_approved=True).count()


# Update Address model to include default functionality
class EnhancedAddressSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    
    class Meta:
        model = Address
        fields = '__all__'
    
    def create(self, validated_data):
        # If this is set as default, remove default from other addresses
        if validated_data.get('is_default', False):
            Address.objects.filter(
                user=validated_data['user'], 
                is_default=True
            ).update(is_default=False)
        
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        # If setting as default, remove default from other addresses
        if validated_data.get('is_default', False):
            Address.objects.filter(
                user=instance.user, 
                is_default=True
            ).exclude(id=instance.id).update(is_default=False)
        
        return super().update(instance, validated_data)


# ==============================================================================
# PERMISSION SYSTEM SERIALIZERS
# ==============================================================================

class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = ['id', 'name', 'codename', 'permission_type', 'resource_type', 
                 'description', 'is_active', 'created_at']
        read_only_fields = ['created_at']


class RoleSerializer(serializers.ModelSerializer):
    permissions = PermissionSerializer(many=True, read_only=True)
    permission_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Role
        fields = ['id', 'name', 'description', 'permissions', 'permission_count',
                 'is_active', 'is_system_role', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']
    
    def get_permission_count(self, obj):
        return obj.permissions.filter(is_active=True).count()


class AdminRoleSerializer(serializers.ModelSerializer):
    permission_ids = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True,
        required=False
    )
    permissions = PermissionSerializer(many=True, read_only=True)
    
    class Meta:
        model = Role
        fields = ['id', 'name', 'description', 'permissions', 'permission_ids',
                 'is_active', 'is_system_role', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']
    
    def create(self, validated_data):
        permission_ids = validated_data.pop('permission_ids', [])
        role = Role.objects.create(**validated_data)
        
        if permission_ids:
            permissions = Permission.objects.filter(id__in=permission_ids)
            role.permissions.set(permissions)
        
        return role
    
    def update(self, instance, validated_data):
        permission_ids = validated_data.pop('permission_ids', None)
        
        # Update role fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Update permissions if provided
        if permission_ids is not None:
            permissions = Permission.objects.filter(id__in=permission_ids)
            instance.permissions.set(permissions)
        
        return instance


class UserRoleSerializer(serializers.ModelSerializer):
    role_name = serializers.CharField(source='role.name', read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)
    assigned_by_name = serializers.CharField(source='assigned_by.get_full_name', read_only=True)
    
    class Meta:
        model = UserRole
        fields = ['id', 'user', 'user_email', 'role', 'role_name', 
                 'assigned_by', 'assigned_by_name', 'assigned_at', 'is_active']
        read_only_fields = ['assigned_by', 'assigned_at']


class UserRoleAssignmentSerializer(serializers.Serializer):
    user_id = serializers.IntegerField()
    role_ids = serializers.ListField(child=serializers.IntegerField())
    
    def validate_user_id(self, value):
        try:
            User.objects.get(id=value)
            return value
        except User.DoesNotExist:
            raise serializers.ValidationError("User not found")
    
    def validate_role_ids(self, value):
        existing_roles = Role.objects.filter(id__in=value, is_active=True)
        if len(existing_roles) != len(value):
            raise serializers.ValidationError("One or more roles not found or inactive")
        return value


class EnhancedUserSerializer(AdminUserSerializer):
    """Enhanced user serializer with role information"""
    user_roles = UserRoleSerializer(many=True, read_only=True)
    permissions = serializers.SerializerMethodField()
    
    class Meta(AdminUserSerializer.Meta):
        fields = list(AdminUserSerializer.Meta.fields) + ['user_roles', 'permissions']
    
    def get_permissions(self, obj):
        permissions = obj.get_permissions()
        return PermissionSerializer(permissions, many=True).data
