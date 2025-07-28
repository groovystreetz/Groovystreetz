# backend/api/views.py

from django.contrib.auth import login, logout, get_user_model
from rest_framework import generics, views, response, status, permissions
from .serializers import RegisterSerializer, LoginSerializer, CustomUserDetailsSerializer

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        # Log the user in and send verification email
        # This part is handled by allauth signals, so we just return success.
        return response.Response(
            {"detail": "Verification e-mail sent."},
            status=status.HTTP_201_CREATED
        )


class LoginView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        # Pass the request to the serializer's context
        serializer = LoginSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            user = serializer.validated_data
            login(request, user)
            # Use the CustomUserDetailsSerializer here as well for a consistent response
            return response.Response(CustomUserDetailsSerializer(user).data, status=status.HTTP_200_OK)
        return response.Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(views.APIView):
    def post(self, request):
        logout(request)
        return response.Response({"detail": "Successfully logged out."}, status=status.HTTP_200_OK)

# The basic UserView is no longer needed because dj-rest-auth provides
# a more complete one at '/api/auth/user/'.
# If you still want a custom one, you would create it like this:
#
# class UserDetailView(views.APIView):
#     def get(self, request):
#         serializer = CustomUserDetailsSerializer(request.user)
#         return response.Response(serializer.data, status=status.HTTP_200_OK)


class UserAccountView(generics.RetrieveUpdateDestroyAPIView):
    """
    API view for authenticated users to retrieve, update, or delete (soft) their account.
    - GET: Returns the user's details.
    - PUT/PATCH: Updates the user's details.
    - DELETE: Deactivates the user's account (soft delete).
    """
    serializer_class = CustomUserDetailsSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        # Ensures the view always operates on the currently authenticated user.
        return self.request.user

    def perform_destroy(self, instance):
        """
        Instead of deleting the user, this method sets their `is_active`
        flag to False, effectively deactivating their account.
        """
        instance.is_active = False
        instance.save()


# ==============================================================================
# E-COMMERCE VIEWS
# ==============================================================================
from .models import Category, Product
from .serializers import CategorySerializer, ProductSerializer

class CategoryListView(generics.ListAPIView):
    """Read-only endpoint for all categories."""
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny] # Publicly accessible


class ProductListView(generics.ListAPIView):
    """
    Read-only endpoint for products.
    Can be filtered by category slug using a query parameter.
    Example: /api/products/?category=t-shirts
    """
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny] # Publicly accessible

    def get_queryset(self):
        queryset = Product.objects.all()
        category_slug = self.request.query_params.get('category')
        if category_slug:
            queryset = queryset.filter(category__slug=category_slug)
        return queryset


class ProductDetailView(generics.RetrieveAPIView):
    """Read-only endpoint for a single product."""
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny] # Publicly accessible


from .models import Design
from .serializers import DesignSerializer

class DesignListCreateView(generics.ListCreateAPIView):
    """
    Endpoint for listing a user's designs or creating a new one.
    - GET: Returns a list of designs for the currently authenticated user.
    - POST: Creates a new design for the currently authenticated user.
    """
    serializer_class = DesignSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # This ensures that users can only see their own designs.
        return Design.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # This ensures that the design is associated with the current user.
        serializer.save(user=self.request.user)


from .serializers import OrderSerializer

class OrderCreateView(generics.CreateAPIView):
    """
    Endpoint for creating a new order.
    """
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        # The logic for submitting the order to Printful will be added here later.
        # For now, we just save the order to our local database.
        serializer.save(user=self.request.user)


from .models import Order
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt

@method_decorator(csrf_exempt, name='dispatch')
class PrintfulWebhookView(views.APIView):
    """
    Handles incoming webhooks from Printful to update order statuses.
    This view is exempt from CSRF protection because Printful won't have a CSRF token.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        webhook_data = request.data
        event_type = webhook_data.get('type')
        order_data = webhook_data.get('data', {})

        if event_type == 'order_shipped':
            printful_order_id = order_data.get('order', {}).get('id')
            tracking_number = order_data.get('shipment', {}).get('tracking_number')

            try:
                order = Order.objects.get(printful_order_id=printful_order_id)
                order.status = 'shipped'
                order.tracking_number = tracking_number
                order.save()
                return response.Response(status=status.HTTP_200_OK)
            except Order.DoesNotExist:
                return response.Response(status=status.HTTP_404_NOT_FOUND)

        return response.Response(status=status.HTTP_200_OK)


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
        # Users can only see their own orders.
        return Order.objects.filter(user=self.request.user)


class OrderDetailView(generics.RetrieveAPIView):
    """
    Endpoint for retrieving a single order.
    """
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Users can only see their own orders.
        return Order.objects.filter(user=self.request.user)


from rest_framework import viewsets
from .models import Address
from .serializers import AddressSerializer

class AddressViewSet(viewsets.ModelViewSet):
    """
    A ViewSet for viewing and editing a user's addresses.
    Provides full CRUD functionality.
    """
    serializer_class = AddressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Users can only manage their own addresses.
        return Address.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


from .models import Wishlist
from .serializers import WishlistSerializer

class WishlistView(generics.RetrieveAPIView):
    """
    Endpoint for retrieving a user's wishlist.
    """
    serializer_class = WishlistSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        # Get or create a wishlist for the current user.
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
from .permissions import IsAdminUser

class AdminUserListView(generics.ListAPIView):
    """
    Admin endpoint for listing all users.
    """
    queryset = User.objects.all()
    serializer_class = CustomUserDetailsSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]


class AdminUserDetailView(generics.RetrieveUpdateAPIView):
    """
    Admin endpoint for retrieving and updating a single user.
    """
    queryset = User.objects.all()
    serializer_class = CustomUserDetailsSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]


class AdminOrderListView(generics.ListAPIView):
    """
    Admin endpoint for listing all orders.
    """
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]


from django.db.models import Sum, Count

class AdminSalesReportView(views.APIView):
    """
    Admin endpoint for generating a sales report.
    """
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]

    def get(self, request):
        total_sales = Order.objects.aggregate(total_sales=Sum('total_price'))['total_sales'] or 0
        total_orders = Order.objects.count()
        
        report = {
            'total_sales': total_sales,
            'total_orders': total_orders,
        }
        return response.Response(report, status=status.HTTP_200_OK)
