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
        fields = ('pk', 'email', 'username', 'first_name', 'last_name', 'role')
        # Added 'role' field to expose the user's role in API responses


# ==============================================================================
# E-COMMERCE SERIALIZERS
# ==============================================================================
from .models import Category, Product

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ('id', 'name', 'slug')


class ProductSerializer(serializers.ModelSerializer):
    # To display the category name instead of its ID
    category = serializers.StringRelatedField()

    class Meta:
        model = Product
        fields = ('id', 'name', 'description', 'price', 'image', 'category', 'stock')


class AdminProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ('id', 'name', 'description', 'price', 'image', 'category', 'stock')




from .models import Design

class DesignSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Design
        fields = ('id', 'user', 'image_url', 'created_at')
        read_only_fields = ('created_at',)


from .models import Order, OrderItem

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ('product', 'quantity', 'price')


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    coupon_code = serializers.CharField(source='applied_coupon.code', read_only=True)
    discount_percentage = serializers.ReadOnlyField()
    has_discount = serializers.ReadOnlyField()

    class Meta:
        model = Order
        fields = [
            'id', 'user', 'items', 'original_price', 'discount_amount', 'total_price',
            'shipping_address', 'created_at', 'status', 'applied_coupon', 'coupon_code',
            'no_return_allowed', 'discount_percentage', 'has_discount'
        ]
        read_only_fields = ['created_at', 'status', 'discount_percentage', 'has_discount']

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
