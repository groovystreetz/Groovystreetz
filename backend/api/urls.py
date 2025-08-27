# backend/api/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    RegisterView, LoginView, LogoutView,
    CategoryListView, ProductListView, ProductDetailView,
    DesignListCreateView, OrderCreateView,
    OrderListView, OrderDetailView, AddressViewSet,
    WishlistView, WishlistAddView, WishlistRemoveView,
    WishlistToggleView, WishlistClearView, WishlistStatsView, WishlistCheckView,
    AdminUserListView, AdminUserDetailView, AdminOrderListView,
    AdminSalesReportView, AdminProductViewSet,
    # Coupon views
    CouponValidationView, ApplyCouponView, AdminCouponViewSet,
    AdminCouponUsageView, AdminCouponStatsView
)

# Create a router and register our viewsets with it.
router = DefaultRouter()
router.register(r'addresses', AddressViewSet, basename='address')
router.register(r'admin/products', AdminProductViewSet, basename='admin-product')
router.register(r'admin/coupons', AdminCouponViewSet, basename='admin-coupon')

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
    # Wishlist endpoints
    path('wishlist/', WishlistView.as_view(), name='wishlist-detail'),
    path('wishlist/add/<int:product_id>/', WishlistAddView.as_view(), name='wishlist-add'),
    path('wishlist/remove/<int:product_id>/', WishlistRemoveView.as_view(), name='wishlist-remove'),
    path('wishlist/toggle/<int:product_id>/', WishlistToggleView.as_view(), name='wishlist-toggle'),
    path('wishlist/clear/', WishlistClearView.as_view(), name='wishlist-clear'),
    path('wishlist/stats/', WishlistStatsView.as_view(), name='wishlist-stats'),
    path('wishlist/check/<int:product_id>/', WishlistCheckView.as_view(), name='wishlist-check'),

    # Coupon endpoints
    path('coupons/validate/', CouponValidationView.as_view(), name='coupon-validate'),
    path('coupons/apply/', ApplyCouponView.as_view(), name='coupon-apply'),

    # Admin endpoints
    path('admin/users/', AdminUserListView.as_view(), name='admin-user-list'),
    path('admin/users/<int:pk>/', AdminUserDetailView.as_view(), name='admin-user-detail'),
    path('admin/orders/', AdminOrderListView.as_view(), name='admin-order-list'),
    path('admin/sales-report/', AdminSalesReportView.as_view(), name='admin-sales-report'),
    path('admin/coupon-usage/', AdminCouponUsageView.as_view(), name='admin-coupon-usage-list'),
    path('admin/coupon-usage/<int:coupon_id>/', AdminCouponUsageView.as_view(), name='admin-coupon-usage'),
    path('admin/coupon-stats/', AdminCouponStatsView.as_view(), name='admin-coupon-stats'),

    # User Profile endpoints (handled by the router)
    path('', include(router.urls)),
]
