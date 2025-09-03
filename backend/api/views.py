# backend/api/views.py

from django.contrib.auth import login, logout, get_user_model
from rest_framework import generics, views, response, status, permissions, viewsets, serializers
from django.utils import timezone
from django.db import models
from .serializers import (
    RegisterSerializer, LoginSerializer, CustomUserDetailsSerializer,
    CategorySerializer, ProductSerializer, OrderSerializer, DesignSerializer,
    AddressSerializer, WishlistSerializer, AdminProductSerializer,
    CouponSerializer, AdminCouponSerializer, CouponUsageSerializer,
    CouponValidationSerializer, ApplyCouponSerializer, AdminUserSerializer,
    TestimonialSerializer, AdminTestimonialSerializer, ContactMessageSerializer,
    AdminContactMessageSerializer, ProductVariantSerializer, ProductImageSerializer,
    ReviewSerializer, AdminReviewSerializer, RewardPointsSerializer, RewardTransactionSerializer,
    BannerSerializer, SpotlightSerializer, EnhancedProductSerializer, EnhancedAddressSerializer,
    PermissionSerializer, RoleSerializer, AdminRoleSerializer, UserRoleSerializer,
    UserRoleAssignmentSerializer, EnhancedUserSerializer
)
from .models import (
    Category, Product, Design, Order, Address, Wishlist, Coupon, CouponUsage,
    Testimonial, ContactMessage, ProductVariant, ProductImage, Review, 
    RewardPoints, RewardTransaction, Banner, Spotlight, Permission, Role, UserRole
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


class UserProfileEditView(views.APIView):
    """
    API view for users to edit their profile information.
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def patch(self, request):
        user = request.user
        data = request.data
        
        # Update allowed fields
        allowed_fields = ['first_name', 'last_name', 'phone']
        updated_fields = []
        
        for field in allowed_fields:
            if field in data:
                setattr(user, field, data[field])
                updated_fields.append(field)
        
        # Special handling for email change (requires additional verification)
        if 'email' in data:
            new_email = data['email']
            if User.objects.filter(email=new_email).exclude(id=user.id).exists():
                return response.Response({
                    'error': 'Email already exists'
                }, status=status.HTTP_400_BAD_REQUEST)
            user.email = new_email
            updated_fields.append('email')
        
        user.save()
        
        serializer = CustomUserDetailsSerializer(user)
        return response.Response({
            'message': f'Profile updated successfully. Updated fields: {", ".join(updated_fields)}',
            'user': serializer.data
        }, status=status.HTTP_200_OK)


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


class CategoryDetailView(generics.RetrieveAPIView):
    """
    Read-only endpoint for a single category.
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


class OrderStatusUpdateView(views.APIView):
    """
    Admin endpoint for updating order status.
    """
    permission_classes = [permissions.IsAuthenticated, IsAdminOrSuperAdmin]

    def patch(self, request, order_id):
        try:
            order = Order.objects.get(id=order_id)
            new_status = request.data.get('status')
            tracking_number = request.data.get('tracking_number')
            
            if new_status not in ['pending', 'shipped', 'delivered', 'cancelled']:
                return response.Response({
                    'error': 'Invalid status. Must be one of: pending, shipped, delivered, cancelled'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            order.status = new_status
            if tracking_number:
                order.tracking_number = tracking_number
            order.save()
            
            return response.Response({
                'message': 'Order status updated successfully',
                'order_id': order_id,
                'status': new_status,
                'tracking_number': order.tracking_number
            }, status=status.HTTP_200_OK)
            
        except Order.DoesNotExist:
            return response.Response({
                'error': 'Order not found'
            }, status=status.HTTP_404_NOT_FOUND)


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


class WishlistToggleView(views.APIView):
    """
    Endpoint for toggling a product in the user's wishlist.
    If product exists in wishlist, remove it. If not, add it.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, product_id):
        wishlist, created = Wishlist.objects.get_or_create(user=request.user)
        try:
            product = Product.objects.get(id=product_id)
            if wishlist.products.filter(id=product_id).exists():
                wishlist.products.remove(product)
                return response.Response({
                    "message": "Product removed from wishlist",
                    "action": "removed",
                    "product_id": product_id
                }, status=status.HTTP_200_OK)
            else:
                wishlist.products.add(product)
                return response.Response({
                    "message": "Product added to wishlist",
                    "action": "added",
                    "product_id": product_id
                }, status=status.HTTP_200_OK)
        except Product.DoesNotExist:
            return response.Response({
                "error": "Product not found"
            }, status=status.HTTP_404_NOT_FOUND)


class WishlistAddView(views.APIView):
    """
    Endpoint for adding a product to the user's wishlist.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, product_id):
        wishlist, created = Wishlist.objects.get_or_create(user=request.user)
        try:
            product = Product.objects.get(id=product_id)
            if wishlist.products.filter(id=product_id).exists():
                return response.Response({
                    "message": "Product already in wishlist",
                    "product_id": product_id
                }, status=status.HTTP_200_OK)
            
            wishlist.products.add(product)
            return response.Response({
                "message": "Product added to wishlist",
                "product_id": product_id
            }, status=status.HTTP_200_OK)
        except Product.DoesNotExist:
            return response.Response({
                "error": "Product not found"
            }, status=status.HTTP_404_NOT_FOUND)


class WishlistRemoveView(views.APIView):
    """
    Endpoint for removing a product from the user's wishlist.
    """
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, product_id):
        wishlist, created = Wishlist.objects.get_or_create(user=request.user)
        try:
            product = Product.objects.get(id=product_id)
            if not wishlist.products.filter(id=product_id).exists():
                return response.Response({
                    "message": "Product not in wishlist",
                    "product_id": product_id
                }, status=status.HTTP_200_OK)
                
            wishlist.products.remove(product)
            return response.Response({
                "message": "Product removed from wishlist",
                "product_id": product_id
            }, status=status.HTTP_200_OK)
        except Product.DoesNotExist:
            return response.Response({
                "error": "Product not found"
            }, status=status.HTTP_404_NOT_FOUND)


class WishlistClearView(views.APIView):
    """
    Endpoint for clearing all products from the user's wishlist.
    """
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request):
        wishlist, created = Wishlist.objects.get_or_create(user=request.user)
        product_count = wishlist.products.count()
        wishlist.products.clear()
        return response.Response({
            "message": f"Cleared {product_count} products from wishlist"
        }, status=status.HTTP_200_OK)


class WishlistStatsView(views.APIView):
    """
    Endpoint for getting wishlist statistics.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        wishlist, created = Wishlist.objects.get_or_create(user=request.user)
        total_items = wishlist.products.count()
        total_value = sum(product.price for product in wishlist.products.all())
        
        return response.Response({
            "total_items": total_items,
            "total_value": total_value,
            "is_empty": total_items == 0
        }, status=status.HTTP_200_OK)


class WishlistCheckView(views.APIView):
    """
    Endpoint for checking if a product is in the user's wishlist.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, product_id):
        wishlist, created = Wishlist.objects.get_or_create(user=request.user)
        try:
            product = Product.objects.get(id=product_id)
            is_in_wishlist = wishlist.products.filter(id=product_id).exists()
            return response.Response({
                "product_id": product_id,
                "in_wishlist": is_in_wishlist,
                "product_name": product.name
            }, status=status.HTTP_200_OK)
        except Product.DoesNotExist:
            return response.Response({
                "error": "Product not found"
            }, status=status.HTTP_404_NOT_FOUND)


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
    serializer_class = AdminUserSerializer
    permission_classes = [permissions.IsAuthenticated, IsSuperAdminUser]


class AdminUserDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    SuperAdmin endpoint for retrieving, updating, and deleting users.
    Only superadmin can manage users, change roles, and remove users.
    """
    queryset = User.objects.all()
    serializer_class = AdminUserSerializer
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


# ==============================================================================
# COMPREHENSIVE NEW FEATURE VIEWS
# ==============================================================================

# Testimonials Views
class TestimonialListView(generics.ListCreateAPIView):
    serializer_class = TestimonialSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        queryset = Testimonial.objects.filter(is_approved=True)
        featured = self.request.query_params.get('featured')
        if featured == 'true':
            queryset = queryset.filter(is_featured=True)
        return queryset.order_by('-created_at')
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class AdminTestimonialViewSet(viewsets.ModelViewSet):
    queryset = Testimonial.objects.all()
    serializer_class = AdminTestimonialSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminOrSuperAdmin]


# Contact Views
class ContactMessageCreateView(generics.CreateAPIView):
    serializer_class = ContactMessageSerializer
    permission_classes = [permissions.AllowAny]


class AdminContactMessageViewSet(viewsets.ModelViewSet):
    queryset = ContactMessage.objects.all()
    serializer_class = AdminContactMessageSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminOrSuperAdmin]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        resolved = self.request.query_params.get('resolved')
        if resolved is not None:
            queryset = queryset.filter(is_resolved=resolved.lower() == 'true')
        return queryset


class ContactMessageResolveView(views.APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdminOrSuperAdmin]
    
    def patch(self, request, message_id):
        try:
            message = ContactMessage.objects.get(id=message_id)
            message.is_resolved = True
            message.resolved_by = request.user
            message.resolved_at = timezone.now()
            message.save()
            
            return response.Response({
                'message': 'Contact message marked as resolved',
                'resolved_by': request.user.get_full_name(),
                'resolved_at': message.resolved_at
            }, status=status.HTTP_200_OK)
            
        except ContactMessage.DoesNotExist:
            return response.Response({
                'error': 'Contact message not found'
            }, status=status.HTTP_404_NOT_FOUND)


# Enhanced Product Views with variants and images
class EnhancedProductListView(generics.ListAPIView):
    serializer_class = EnhancedProductSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        queryset = Product.objects.prefetch_related('variants', 'images', 'reviews')
        
        # Category filter (multiple categories)
        categories = self.request.query_params.get('categories')
        if categories:
            category_list = categories.split(',')
            queryset = queryset.filter(category__slug__in=category_list)
        
        # Search
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(name__icontains=search)
        
        # Price range
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')
        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)
        
        # New arrivals (last 30 days)
        new_arrivals = self.request.query_params.get('new_arrivals')
        if new_arrivals == 'true':
            from datetime import timedelta
            thirty_days_ago = timezone.now() - timedelta(days=30)
            queryset = queryset.filter(created_at__gte=thirty_days_ago)
        
        return queryset.order_by('-created_at')


class EnhancedProductDetailView(generics.RetrieveAPIView):
    queryset = Product.objects.prefetch_related('variants', 'images', 'reviews')
    serializer_class = EnhancedProductSerializer
    permission_classes = [permissions.AllowAny]


# Product Variant Views
class ProductVariantViewSet(viewsets.ModelViewSet):
    serializer_class = ProductVariantSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminOrSuperAdmin]
    
    def get_queryset(self):
        product_id = self.request.query_params.get('product')
        if product_id:
            return ProductVariant.objects.filter(product_id=product_id)
        return ProductVariant.objects.all()


# Product Images Views
class ProductImageViewSet(viewsets.ModelViewSet):
    serializer_class = ProductImageSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminOrSuperAdmin]
    
    def get_queryset(self):
        product_id = self.request.query_params.get('product')
        if product_id:
            return ProductImage.objects.filter(product_id=product_id)
        return ProductImage.objects.all()


# Review Views
class ReviewListCreateView(generics.ListCreateAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        product_id = self.request.query_params.get('product')
        queryset = Review.objects.filter(is_approved=True)
        if product_id:
            queryset = queryset.filter(product_id=product_id)
        return queryset.order_by('-created_at')
    
    def perform_create(self, serializer):
        # Check if user has purchased the product
        product = serializer.validated_data['product']
        user = self.request.user
        
        # Check if user has ordered this product
        has_purchased = Order.objects.filter(
            user=user,
            items__product=product
        ).exists()
        
        serializer.save(
            user=user,
            is_verified_purchase=has_purchased
        )


class AdminReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = AdminReviewSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminOrSuperAdmin]


class ReviewHelpfulView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, review_id):
        try:
            review = Review.objects.get(id=review_id)
            review.helpful_count += 1
            review.save()
            
            return response.Response({
                'message': 'Review marked as helpful',
                'helpful_count': review.helpful_count
            }, status=status.HTTP_200_OK)
            
        except Review.DoesNotExist:
            return response.Response({
                'error': 'Review not found'
            }, status=status.HTTP_404_NOT_FOUND)


# Reward Points Views
class RewardPointsView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        reward_points, created = RewardPoints.objects.get_or_create(user=request.user)
        serializer = RewardPointsSerializer(reward_points)
        
        # Get recent transactions
        transactions = RewardTransaction.objects.filter(user=request.user)[:10]
        transaction_serializer = RewardTransactionSerializer(transactions, many=True)
        
        return response.Response({
            'reward_points': serializer.data,
            'recent_transactions': transaction_serializer.data
        }, status=status.HTTP_200_OK)


class RedeemRewardPointsView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        points_to_redeem = request.data.get('points', 0)
        
        if points_to_redeem < 1000:
            return response.Response({
                'error': 'Minimum 1000 points required for redemption'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        reward_points, created = RewardPoints.objects.get_or_create(user=request.user)
        
        if reward_points.total_points < points_to_redeem:
            return response.Response({
                'error': 'Insufficient points'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Create coupon worth points/1000 in rupees
        coupon_value = points_to_redeem // 1000
        coupon_code = f"REWARD{request.user.id}{timezone.now().strftime('%Y%m%d%H%M')}"
        
        # Create the coupon
        coupon = Coupon.objects.create(
            code=coupon_code,
            name=f"Reward Redemption - ₹{coupon_value}",
            description=f"Redeemed from {points_to_redeem} reward points",
            discount_type='fixed',
            discount_value=coupon_value,
            valid_from=timezone.now(),
            valid_until=timezone.now() + timezone.timedelta(days=30),
            max_uses_per_user=1,
            is_active=True,
            created_by=request.user
        )
        
        # Add user restriction
        coupon.user_restrictions.add(request.user)
        
        # Deduct points
        reward_points.total_points -= points_to_redeem
        reward_points.save()
        
        # Record transaction
        RewardTransaction.objects.create(
            user=request.user,
            transaction_type='redeem',
            points=-points_to_redeem,
            description=f"Redeemed for coupon {coupon_code}"
        )
        
        return response.Response({
            'message': f'Successfully redeemed {points_to_redeem} points',
            'coupon_code': coupon_code,
            'coupon_value': coupon_value,
            'remaining_points': reward_points.total_points
        }, status=status.HTTP_200_OK)


# Banner Views
class BannerListView(generics.ListAPIView):
    serializer_class = BannerSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        queryset = Banner.objects.filter(is_active=True)
        now = timezone.now()
        
        # Filter by date range
        queryset = queryset.filter(
            models.Q(start_date__isnull=True) | models.Q(start_date__lte=now),
            models.Q(end_date__isnull=True) | models.Q(end_date__gte=now)
        )
        
        banner_type = self.request.query_params.get('type')
        if banner_type:
            queryset = queryset.filter(banner_type=banner_type)
        
        return queryset.order_by('order', '-created_at')


class AdminBannerViewSet(viewsets.ModelViewSet):
    queryset = Banner.objects.all()
    serializer_class = BannerSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminOrSuperAdmin]


# Spotlight Views
class SpotlightListView(generics.ListAPIView):
    queryset = Spotlight.objects.filter(is_active=True).order_by('order', '-created_at')
    serializer_class = SpotlightSerializer
    permission_classes = [permissions.AllowAny]


class AdminSpotlightViewSet(viewsets.ModelViewSet):
    queryset = Spotlight.objects.all()
    serializer_class = SpotlightSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminOrSuperAdmin]


# Enhanced Address Views
class EnhancedAddressViewSet(viewsets.ModelViewSet):
    serializer_class = EnhancedAddressSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class AddressDeleteView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def delete(self, request, address_id):
        try:
            address = Address.objects.get(id=address_id, user=request.user)
            address.delete()
            
            return response.Response({
                'message': 'Address deleted successfully'
            }, status=status.HTTP_200_OK)
            
        except Address.DoesNotExist:
            return response.Response({
                'error': 'Address not found'
            }, status=status.HTTP_404_NOT_FOUND)


# User Delete View
class UserDeleteView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def delete(self, request):
        user = request.user
        user.is_active = False
        user.save()
        
        return response.Response({
            'message': 'Account deactivated successfully'
        }, status=status.HTTP_200_OK)


# Admin Phone/Email Change View
class AdminUserContactUpdateView(views.APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdminOrSuperAdmin]
    
    def patch(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
            data = request.data
            updated_fields = []
            
            if 'phone' in data:
                user.phone = data['phone']
                updated_fields.append('phone')
            
            if 'email' in data:
                new_email = data['email']
                if User.objects.filter(email=new_email).exclude(id=user.id).exists():
                    return response.Response({
                        'error': 'Email already exists'
                    }, status=status.HTTP_400_BAD_REQUEST)
                user.email = new_email
                updated_fields.append('email')
            
            user.save()
            
            return response.Response({
                'message': f'Updated {", ".join(updated_fields)} for user {user.get_full_name()}',
                'user': AdminUserSerializer(user).data
            }, status=status.HTTP_200_OK)
            
        except User.DoesNotExist:
            return response.Response({
                'error': 'User not found'
            }, status=status.HTTP_404_NOT_FOUND)


# Enhanced Order Views with address details
class EnhancedOrderSerializer(OrderSerializer):
    user_details = serializers.SerializerMethodField()
    
    def get_user_details(self, obj):
        if obj.user:
            return {
                'name': obj.user.get_full_name(),
                'email': obj.user.email,
                'phone': obj.user.phone,
            }
        return None
    
    class Meta(OrderSerializer.Meta):
        fields = OrderSerializer.Meta.fields + ['user_details']


# New Arrival Products View
class NewArrivalProductsView(generics.ListAPIView):
    serializer_class = EnhancedProductSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        from datetime import timedelta
        thirty_days_ago = timezone.now() - timedelta(days=30)
        return Product.objects.filter(
            created_at__gte=thirty_days_ago
        ).prefetch_related('variants', 'images', 'reviews').order_by('-created_at')[:20]


# Reward Point Utility Function
def award_reward_points(user, points, description, order=None):
    """Utility function to award points to user"""
    reward_points, created = RewardPoints.objects.get_or_create(user=user)
    reward_points.total_points += points
    reward_points.save()
    
    RewardTransaction.objects.create(
        user=user,
        transaction_type='earn',
        points=points,
        description=description,
        order=order
    )


# ==============================================================================
# ROLE AND PERMISSION SYSTEM VIEWS
# ==============================================================================

class PermissionListView(generics.ListAPIView):
    """List all available permissions"""
    queryset = Permission.objects.filter(is_active=True)
    serializer_class = PermissionSerializer
    permission_classes = [permissions.IsAuthenticated, IsSuperAdminUser]


class RoleViewSet(viewsets.ModelViewSet):
    """CRUD operations for roles (SuperAdmin only)"""
    queryset = Role.objects.all()
    serializer_class = AdminRoleSerializer
    permission_classes = [permissions.IsAuthenticated, IsSuperAdminUser]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        is_active = self.request.query_params.get('is_active')
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == 'true')
        return queryset
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.is_system_role:
            return response.Response({
                'error': 'System roles cannot be deleted'
            }, status=status.HTTP_400_BAD_REQUEST)
        return super().destroy(request, *args, **kwargs)


class UserRoleViewSet(viewsets.ModelViewSet):
    """CRUD operations for user role assignments"""
    queryset = UserRole.objects.all()
    serializer_class = UserRoleSerializer
    permission_classes = [permissions.IsAuthenticated, IsSuperAdminUser]
    
    def perform_create(self, serializer):
        serializer.save(assigned_by=self.request.user)


class AssignUserRolesView(views.APIView):
    """Assign multiple roles to a user"""
    permission_classes = [permissions.IsAuthenticated, IsSuperAdminUser]
    
    def post(self, request):
        serializer = UserRoleAssignmentSerializer(data=request.data)
        if serializer.is_valid():
            user_id = serializer.validated_data['user_id']
            role_ids = serializer.validated_data['role_ids']
            
            user = User.objects.get(id=user_id)
            roles = Role.objects.filter(id__in=role_ids)
            
            # Remove existing role assignments
            UserRole.objects.filter(user=user).update(is_active=False)
            
            # Create new role assignments
            for role in roles:
                UserRole.objects.update_or_create(
                    user=user,
                    role=role,
                    defaults={
                        'assigned_by': request.user,
                        'is_active': True
                    }
                )
            
            return response.Response({
                'message': f'Successfully assigned {len(roles)} roles to {user.get_full_name()}',
                'user': EnhancedUserSerializer(user).data
            }, status=status.HTTP_200_OK)
        
        return response.Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserPermissionsView(views.APIView):
    """Get current user's permissions"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        user = request.user
        permissions = user.get_permissions()
        
        # Group permissions by resource type
        grouped_permissions = {}
        for permission in permissions:
            resource = permission.resource_type
            if resource not in grouped_permissions:
                grouped_permissions[resource] = []
            grouped_permissions[resource].append({
                'id': permission.id,
                'name': permission.name,
                'codename': permission.codename,
                'permission_type': permission.permission_type
            })
        
        return response.Response({
            'user': user.email,
            'role': user.role,
            'permissions': grouped_permissions,
            'permission_count': permissions.count()
        }, status=status.HTTP_200_OK)


class CheckPermissionView(views.APIView):
    """Check if current user has specific permission"""
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        permission_codename = request.data.get('permission')
        if not permission_codename:
            return response.Response({
                'error': 'Permission codename required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        has_permission = request.user.has_permission(permission_codename)
        
        return response.Response({
            'user': request.user.email,
            'permission': permission_codename,
            'has_permission': has_permission
        }, status=status.HTTP_200_OK)


class InitializePermissionsView(views.APIView):
    """Initialize default permissions and roles (SuperAdmin only)"""
    permission_classes = [permissions.IsAuthenticated, IsSuperAdminUser]
    
    def post(self, request):
        # Define default permissions
        default_permissions = []
        
        permission_types = ['read', 'write', 'delete', 'manage']
        resource_types = [
            'users', 'products', 'orders', 'coupons', 'reviews',
            'testimonials', 'contacts', 'banners', 'spotlights', 'rewards', 'analytics'
        ]
        
        for resource in resource_types:
            for perm_type in permission_types:
                codename = f"{perm_type}_{resource}"
                name = f"{perm_type.title()} {resource.title()}"
                
                permission, created = Permission.objects.get_or_create(
                    codename=codename,
                    defaults={
                        'name': name,
                        'permission_type': perm_type,
                        'resource_type': resource,
                        'description': f"Permission to {perm_type} {resource}",
                        'is_active': True
                    }
                )
                if created:
                    default_permissions.append(permission)
        
        # Create default roles
        # Customer role (basic permissions)
        customer_role, created = Role.objects.get_or_create(
            name='Customer',
            defaults={
                'description': 'Basic customer role with limited permissions',
                'is_system_role': True,
                'is_active': True
            }
        )
        
        # Admin role (most permissions except user management)
        admin_role, created = Role.objects.get_or_create(
            name='Admin',
            defaults={
                'description': 'Administrative role with product and order management',
                'is_system_role': True,
                'is_active': True
            }
        )
        
        if created:
            admin_permissions = Permission.objects.filter(
                resource_type__in=['products', 'orders', 'coupons', 'reviews', 'analytics']
            )
            admin_role.permissions.set(admin_permissions)
        
        # SuperAdmin role (all permissions)
        superadmin_role, created = Role.objects.get_or_create(
            name='SuperAdmin',
            defaults={
                'description': 'Full system access with all permissions',
                'is_system_role': True,
                'is_active': True
            }
        )
        
        if created:
            superadmin_role.permissions.set(Permission.objects.all())
        
        return response.Response({
            'message': 'Permissions and roles initialized successfully',
            'permissions_created': len(default_permissions),
            'total_permissions': Permission.objects.count(),
            'total_roles': Role.objects.count()
        }, status=status.HTTP_200_OK)