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

    class Meta:
        model = Order
        fields = ('id', 'user', 'items', 'total_price', 'shipping_address', 'created_at', 'status')
        read_only_fields = ('created_at', 'status')

    def create(self, validated_data):
        items_data = validated_data.pop('items')
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

    class Meta:
        model = Wishlist
        fields = ('user', 'products')
