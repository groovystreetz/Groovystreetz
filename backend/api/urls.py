# backend/api/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    RegisterView, LoginView, LogoutView,
    CategoryListView, ProductListView, ProductDetailView,
    DesignListCreateView, OrderCreateView,
    OrderListView, OrderDetailView, AddressViewSet,
    WishlistView, WishlistAddView, WishlistRemoveView,
    AdminUserListView, AdminUserDetailView, AdminOrderListView,
    AdminSalesReportView, AdminProductViewSet
)

# Create a router and register our viewsets with it.
router = DefaultRouter()
router.register(r'addresses', AddressViewSet, basename='address')
router.register(r'admin/products', AdminProductViewSet, basename='admin-product')

urlpatterns = [
    # Auth endpoints
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),

    # Public E-commerce endpoints
    path('categories/', CategoryListView.as_view(), name='category-list'),
    path('products/', ProductListView.as_view(), name='product-list'),
    path('products/<int:pk>/', ProductDetailView.as_view(), name='product-detail'),

    # Protected E-commerce endpoints
    path('designs/', DesignListCreateView.as_view(), name='design-list-create'),
    path('orders/create/', OrderCreateView.as_view(), name='order-create'),
    path('orders/', OrderListView.as_view(), name='order-list'),
    path('orders/<int:pk>/', OrderDetailView.as_view(), name='order-detail'),
    path('wishlist/', WishlistView.as_view(), name='wishlist-detail'),
    path('wishlist/add/<int:product_id>/', WishlistAddView.as_view(), name='wishlist-add'),
    path('wishlist/remove/<int:product_id>/', WishlistRemoveView.as_view(), name='wishlist-remove'),

    # Admin endpoints
    path('admin/users/', AdminUserListView.as_view(), name='admin-user-list'),
    path('admin/users/<int:pk>/', AdminUserDetailView.as_view(), name='admin-user-detail'),
    path('admin/orders/', AdminOrderListView.as_view(), name='admin-order-list'),
    path('admin/sales-report/', AdminSalesReportView.as_view(), name='admin-sales-report'),

    # User Profile endpoints (handled by the router)
    path('', include(router.urls)),
]
