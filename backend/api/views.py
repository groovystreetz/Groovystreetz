# backend/api/views.py

from django.contrib.auth import login, logout, get_user_model
from rest_framework import generics, views, response, status, permissions
from .serializers import (
    RegisterSerializer, LoginSerializer, CustomUserDetailsSerializer,
    CategorySerializer, ProductSerializer, OrderSerializer, DesignSerializer,
    AddressSerializer, WishlistSerializer, AdminProductSerializer
)
from .models import (
    Category, Product, Design, Order, Address, Wishlist
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