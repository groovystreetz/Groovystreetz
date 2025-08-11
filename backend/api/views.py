# backend/api/views.py

from django.contrib.auth import login, logout, get_user_model
from rest_framework import generics, views, response, status, permissions, viewsets
from django.utils import timezone
from django.db import models
from .serializers import (
    RegisterSerializer, LoginSerializer, CustomUserDetailsSerializer,
    CategorySerializer, ProductSerializer, OrderSerializer, DesignSerializer,
    AddressSerializer, WishlistSerializer, AdminProductSerializer,
    CouponSerializer, AdminCouponSerializer, CouponUsageSerializer,
    CouponValidationSerializer, ApplyCouponSerializer
)
from .models import (
    Category, Product, Design, Order, Address, Wishlist, Coupon, CouponUsage
)
from .permissions import IsAdminUser, IsSuperAdminUser, IsAdminOrSuperAdmin
import requests
from django.conf import settings
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework import viewsets
from django.db.models import Sum, Count

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    """
    Registers a new user.
    """
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return response.Response(
            {"detail": "Verification e-mail sent."},
            status=status.HTTP_201_CREATED
        )


class LoginView(views.APIView):
    """
    Logs in a user.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            user = serializer.validated_data
            user.backend = 'django.contrib.auth.backends.ModelBackend'
            login(request, user)
            return response.Response(CustomUserDetailsSerializer(user).data, status=status.HTTP_200_OK)
        return response.Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(views.APIView):
    """
    Logs out a user.
    """
    def post(self, request):
        logout(request)
        return response.Response({"detail": "Successfully logged out."}, status=status.HTTP_200_OK)


class UserAccountView(generics.RetrieveUpdateDestroyAPIView):
    """
    API view for authenticated users to retrieve, update, or delete (soft) their account.
    """
    serializer_class = CustomUserDetailsSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

    def perform_destroy(self, instance):
        instance.is_active = False
        instance.save()


# ==============================================================================
# E-COMMERCE VIEWS
# ==============================================================================

class CategoryListView(generics.ListAPIView):
    """
    Read-only endpoint for all categories.
    """
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]


class ProductListView(generics.ListAPIView):
    """
    Read-only endpoint for products.
    Can be filtered by category slug.
    """
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = Product.objects.all()
        category_slug = self.request.query_params.get('category')
        if category_slug:
            queryset = queryset.filter(category__slug=category_slug)
        return queryset


class ProductDetailView(generics.RetrieveAPIView):
    """
    Read-only endpoint for a single product.
    """
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]


class DesignListCreateView(generics.ListCreateAPIView):
    """
    Endpoint for listing a user's designs or creating a new one.
    """
    serializer_class = DesignSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Design.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class OrderCreateView(generics.CreateAPIView):
    """
    Endpoint for creating a new order.
    """
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


# ==============================================================================
# USER PROFILE VIEWS
# ==============================================================================

class OrderListView(generics.ListAPIView):
    """
    Endpoint for listing a user's order history.
    """
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)


class OrderDetailView(generics.RetrieveAPIView):
    """
    Endpoint for retrieving a single order.
    """
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)


class AddressViewSet(viewsets.ModelViewSet):
    """
    A ViewSet for viewing and editing a user's addresses.
    """
    serializer_class = AddressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class WishlistView(generics.RetrieveAPIView):
    """
    Endpoint for retrieving a user's wishlist.
    """
    serializer_class = WishlistSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        wishlist, created = Wishlist.objects.get_or_create(user=self.request.user)
        return wishlist


class WishlistAddView(views.APIView):
    """
    Endpoint for adding a product to the user's wishlist.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, product_id):
        wishlist, created = Wishlist.objects.get_or_create(user=request.user)
        try:
            product = Product.objects.get(id=product_id)
            wishlist.products.add(product)
            return response.Response(status=status.HTTP_200_OK)
        except Product.DoesNotExist:
            return response.Response(status=status.HTTP_404_NOT_FOUND)


class WishlistRemoveView(views.APIView):
    """
    Endpoint for removing a product from the user's wishlist.
    """
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, product_id):
        wishlist, created = Wishlist.objects.get_or_create(user=request.user)
        try:
            product = Product.objects.get(id=product_id)
            wishlist.products.remove(product)
            return response.Response(status=status.HTTP_204_NO_CONTENT)
        except Product.DoesNotExist:
            return response.Response(status=status.HTTP_404_NOT_FOUND)


# ==============================================================================
# ADMIN VIEWS
# ==============================================================================

class AdminProductViewSet(viewsets.ModelViewSet):
    """
    Admin endpoint for managing products.
    Both admin and superadmin can manage products.
    """
    queryset = Product.objects.all()
    serializer_class = AdminProductSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminOrSuperAdmin]


class AdminUserListView(generics.ListAPIView):
    """
    SuperAdmin endpoint for listing all users.
    Only superadmin can view all users.
    """
    queryset = User.objects.all()
    serializer_class = CustomUserDetailsSerializer
    permission_classes = [permissions.IsAuthenticated, IsSuperAdminUser]


class AdminUserDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    SuperAdmin endpoint for retrieving, updating, and deleting users.
    Only superadmin can manage users, change roles, and remove users.
    """
    queryset = User.objects.all()
    serializer_class = CustomUserDetailsSerializer
    permission_classes = [permissions.IsAuthenticated, IsSuperAdminUser]

    def perform_destroy(self, instance):
        """
        Soft delete user by setting is_active to False instead of hard delete.
        This preserves data integrity for orders and other related records.
        """
        instance.is_active = False
        instance.save()


class AdminOrderListView(generics.ListAPIView):
    """
    Admin endpoint for listing all orders.
    Both admin and superadmin can view all orders.
    """
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminOrSuperAdmin]


class AdminSalesReportView(views.APIView):
    """
    Admin endpoint for generating a sales report.
    Both admin and superadmin can view sales reports.
    """
    permission_classes = [permissions.IsAuthenticated, IsAdminOrSuperAdmin]

    def get(self, request):
        total_sales = Order.objects.aggregate(total_sales=Sum('total_price'))['total_sales'] or 0
        total_orders = Order.objects.count()
        report = {
            'total_sales': total_sales,
            'total_orders': total_orders,
        }
        return response.Response(report, status=status.HTTP_200_OK)


# ==============================================================================
# COUPON SYSTEM VIEWS
# ==============================================================================

class CouponValidationView(views.APIView):
    """
    Public endpoint for validating coupon codes before applying to order
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = CouponValidationSerializer(data=request.data)
        if serializer.is_valid():
            from .coupon_utils import CouponValidator
            
            coupon_code = serializer.validated_data['coupon_code']
            order_total = serializer.validated_data['order_total']
            
            # Use anonymous user for public validation
            user = request.user if request.user.is_authenticated else None
            if not user:
                return response.Response(
                    {"error": "Authentication required to validate coupons"}, 
                    status=status.HTTP_401_UNAUTHORIZED
                )

            validator = CouponValidator(coupon_code, user, order_total=order_total)
            is_valid, errors, coupon = validator.validate()

            if is_valid:
                from .coupon_utils import CouponCalculator
                discount_amount, final_total = CouponCalculator.calculate_discount(
                    coupon, order_total
                )
                
                return response.Response({
                    'valid': True,
                    'coupon': {
                        'code': coupon.code,
                        'name': coupon.name,
                        'discount_type': coupon.discount_type,
                        'discount_value': coupon.discount_value,
                        'no_return_policy': coupon.no_return_policy
                    },
                    'discount_amount': discount_amount,
                    'final_total': final_total
                }, status=status.HTTP_200_OK)
            else:
                return response.Response({
                    'valid': False,
                    'errors': errors
                }, status=status.HTTP_400_BAD_REQUEST)
        
        return response.Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ApplyCouponView(views.APIView):
    """
    Apply coupon to user's current order/cart
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = ApplyCouponSerializer(data=request.data)
        if serializer.is_valid():
            # This is a simplified version - in a real app, you'd apply to a cart/session
            # For now, we'll just validate and return the discount info
            coupon_code = serializer.validated_data['coupon_code']
            
            try:
                coupon = Coupon.objects.get(code=coupon_code)
                return response.Response({
                    'message': f'Coupon {coupon_code} is ready to be applied to your order',
                    'coupon': CouponSerializer(coupon).data
                }, status=status.HTTP_200_OK)
            except Coupon.DoesNotExist:
                return response.Response({
                    'error': 'Invalid coupon code'
                }, status=status.HTTP_400_BAD_REQUEST)
        
        return response.Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ==============================================================================
# ADMIN COUPON MANAGEMENT VIEWS
# ==============================================================================

class AdminCouponViewSet(viewsets.ModelViewSet):
    """
    Admin endpoint for managing coupons (CRUD operations)
    Both admin and superadmin can manage coupons
    """
    queryset = Coupon.objects.all()
    serializer_class = AdminCouponSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminOrSuperAdmin]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by active status if requested
        is_active = self.request.query_params.get('is_active')
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == 'true')
        
        # Filter by discount type if requested
        discount_type = self.request.query_params.get('discount_type')
        if discount_type:
            queryset = queryset.filter(discount_type=discount_type)
        
        return queryset


class AdminCouponUsageView(generics.ListAPIView):
    """
    Admin endpoint for viewing coupon usage statistics
    """
    serializer_class = CouponUsageSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminOrSuperAdmin]

    def get_queryset(self):
        coupon_id = self.kwargs.get('coupon_id')
        queryset = CouponUsage.objects.all()
        
        if coupon_id:
            queryset = queryset.filter(coupon_id=coupon_id)
        
        # Filter by date range if provided
        date_from = self.request.query_params.get('date_from')
        date_to = self.request.query_params.get('date_to')
        
        if date_from:
            queryset = queryset.filter(used_at__gte=date_from)
        if date_to:
            queryset = queryset.filter(used_at__lte=date_to)
        
        return queryset


class AdminCouponStatsView(views.APIView):
    """
    Admin endpoint for coupon analytics and statistics
    """
    permission_classes = [permissions.IsAuthenticated, IsAdminOrSuperAdmin]

    def get(self, request):
        # Overall coupon statistics
        total_coupons = Coupon.objects.count()
        active_coupons = Coupon.objects.filter(is_active=True).count()
        expired_coupons = Coupon.objects.filter(
            valid_until__lt=timezone.now()
        ).count()
        
        # Usage statistics
        total_usage = CouponUsage.objects.count()
        total_discount_given = CouponUsage.objects.aggregate(
            total=models.Sum('discount_amount')
        )['total'] or 0
        
        # Top coupons by usage
        from django.db import models
        top_coupons = Coupon.objects.annotate(
            usage_count=models.Count('coupon_usages')
        ).order_by('-usage_count')[:5]
        
        top_coupons_data = [
            {
                'code': coupon.code,
                'name': coupon.name,
                'usage_count': coupon.usage_count,
                'discount_type': coupon.discount_type
            }
            for coupon in top_coupons
        ]

        stats = {
            'total_coupons': total_coupons,
            'active_coupons': active_coupons,
            'expired_coupons': expired_coupons,
            'total_usage': total_usage,
            'total_discount_given': float(total_discount_given),
            'top_coupons': top_coupons_data
        }
        
        return response.Response(stats, status=status.HTTP_200_OK)