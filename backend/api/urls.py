# backend/api/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    RegisterView, LoginView, LogoutView, UserProfileEditView,
    CategoryListView, CategoryDetailView, ProductListView, ProductDetailView,
    DesignListCreateView, OrderCreateView,
    OrderListView, OrderDetailView, OrderStatusUpdateView, AddressViewSet,
    WishlistView, WishlistAddView, WishlistRemoveView,
    WishlistToggleView, WishlistClearView, WishlistStatsView, WishlistCheckView,
    AdminUserListView, AdminUserDetailView, AdminOrderListView,
    AdminSalesReportView, AdminProductViewSet,
    # ShipRocket views
    ShippingRateCalculationView, PincodeServiceabilityView, ShipmentTrackingView,
    PublicTrackingView, AdminShipmentManagementView,
    # Coupon views
    CouponValidationView, ApplyCouponView, AdminCouponViewSet,
    AdminCouponUsageView, AdminCouponStatsView,
    # New comprehensive views
    TestimonialListView, AdminTestimonialViewSet, ContactMessageCreateView,
    AdminContactMessageViewSet, ContactMessageResolveView,
    EnhancedProductListView, EnhancedProductDetailView,
    ProductVariantViewSet, ProductImageViewSet, ReviewListCreateView,
    AdminReviewViewSet, ReviewHelpfulView, RewardPointsView, RedeemRewardPointsView,
    BannerListView, AdminBannerViewSet, SpotlightListView, AdminSpotlightViewSet,
    EnhancedAddressViewSet, AddressDeleteView, SetDefaultAddressView, UserDeleteView,
    AdminUserContactUpdateView, NewArrivalProductsView,
    # Permission system views
    PermissionListView, RoleViewSet, UserRoleViewSet, AssignUserRolesView,
    UserPermissionsView, CheckPermissionView, InitializePermissionsView
)

# Import webhook views
from .webhooks import ShipRocketWebhookView, ShipRocketWebhookTestView, shiprocket_webhook_legacy

# Create a router and register our viewsets with it.
router = DefaultRouter()
router.register(r'addresses', AddressViewSet, basename='address')
router.register(r'enhanced-addresses', EnhancedAddressViewSet, basename='enhanced-address')
router.register(r'admin/products', AdminProductViewSet, basename='admin-product')
router.register(r'admin/coupons', AdminCouponViewSet, basename='admin-coupon')
router.register(r'admin/testimonials', AdminTestimonialViewSet, basename='admin-testimonial')
router.register(r'admin/contacts', AdminContactMessageViewSet, basename='admin-contact')
router.register(r'admin/reviews', AdminReviewViewSet, basename='admin-review')
router.register(r'admin/banners', AdminBannerViewSet, basename='admin-banner')
router.register(r'admin/spotlights', AdminSpotlightViewSet, basename='admin-spotlight')
router.register(r'product-variants', ProductVariantViewSet, basename='product-variant')
router.register(r'product-images', ProductImageViewSet, basename='product-image')
router.register(r'admin/roles', RoleViewSet, basename='admin-role')
router.register(r'admin/user-roles', UserRoleViewSet, basename='admin-user-role')

urlpatterns = [
    # Auth endpoints
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('profile/edit/', UserProfileEditView.as_view(), name='profile-edit'),

    # Public E-commerce endpoints
    path('categories/', CategoryListView.as_view(), name='category-list'),
    path('categories/<int:pk>/', CategoryDetailView.as_view(), name='category-detail'),
    path('products/', ProductListView.as_view(), name='product-list'),
    path('products/<int:pk>/', ProductDetailView.as_view(), name='product-detail'),
    path('enhanced-products/', EnhancedProductListView.as_view(), name='enhanced-product-list'),
    path('enhanced-products/<int:pk>/', EnhancedProductDetailView.as_view(), name='enhanced-product-detail'),
    path('new-arrivals/', NewArrivalProductsView.as_view(), name='new-arrivals'),

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

    # ShipRocket endpoints
    path('shipping/calculate-rates/', ShippingRateCalculationView.as_view(), name='shipping-calculate-rates'),
    path('shipping/pincode/<str:pincode>/', PincodeServiceabilityView.as_view(), name='pincode-serviceability'),
    path('orders/<int:order_id>/tracking/', ShipmentTrackingView.as_view(), name='shipment-tracking'),
    path('tracking/<str:awb_code>/', PublicTrackingView.as_view(), name='public-tracking'),
    path('admin/orders/<int:order_id>/shipment/', AdminShipmentManagementView.as_view(), name='admin-shipment-management'),

    # ShipRocket Webhooks
    path('webhooks/shiprocket/', ShipRocketWebhookView.as_view(), name='shiprocket-webhook'),
    path('webhooks/shiprocket/test/', ShipRocketWebhookTestView.as_view(), name='shiprocket-webhook-test'),
    path('webhooks/shiprocket/legacy/', shiprocket_webhook_legacy, name='shiprocket-webhook-legacy'),

    # Coupon endpoints
    path('coupons/validate/', CouponValidationView.as_view(), name='coupon-validate'),
    path('coupons/apply/', ApplyCouponView.as_view(), name='coupon-apply'),

    # Testimonials endpoints
    path('testimonials/', TestimonialListView.as_view(), name='testimonial-list'),

    # Contact endpoints
    path('contact/', ContactMessageCreateView.as_view(), name='contact-create'),

    # Reviews endpoints
    path('reviews/', ReviewListCreateView.as_view(), name='review-list-create'),
    path('reviews/<int:review_id>/helpful/', ReviewHelpfulView.as_view(), name='review-helpful'),

    # Reward Points endpoints
    path('reward-points/', RewardPointsView.as_view(), name='reward-points'),
    path('reward-points/redeem/', RedeemRewardPointsView.as_view(), name='redeem-points'),

    # Banner and Spotlight endpoints
    path('banners/', BannerListView.as_view(), name='banner-list'),
    path('spotlights/', SpotlightListView.as_view(), name='spotlight-list'),

    # Address management
    path('addresses/<int:address_id>/delete/', AddressDeleteView.as_view(), name='address-delete'),
    path('addresses/<int:address_id>/set-default/', SetDefaultAddressView.as_view(), name='address-set-default'),
    path('user/delete/', UserDeleteView.as_view(), name='user-delete'),

    # Admin endpoints
    path('admin/users/', AdminUserListView.as_view(), name='admin-user-list'),
    path('admin/users/<int:pk>/', AdminUserDetailView.as_view(), name='admin-user-detail'),
    path('admin/users/<int:user_id>/contact/', AdminUserContactUpdateView.as_view(), name='admin-user-contact-update'),
    path('admin/orders/', AdminOrderListView.as_view(), name='admin-order-list'),
    path('admin/orders/<int:order_id>/status/', OrderStatusUpdateView.as_view(), name='admin-order-status-update'),
    path('admin/sales-report/', AdminSalesReportView.as_view(), name='admin-sales-report'),
    path('admin/coupon-usage/', AdminCouponUsageView.as_view(), name='admin-coupon-usage-list'),
    path('admin/coupon-usage/<int:coupon_id>/', AdminCouponUsageView.as_view(), name='admin-coupon-usage'),
    path('admin/coupon-stats/', AdminCouponStatsView.as_view(), name='admin-coupon-stats'),
    path('admin/contacts/<int:message_id>/resolve/', ContactMessageResolveView.as_view(), name='admin-contact-resolve'),

    # Permission System endpoints
    path('permissions/', PermissionListView.as_view(), name='permission-list'),
    path('admin/assign-roles/', AssignUserRolesView.as_view(), name='admin-assign-roles'),
    path('user/permissions/', UserPermissionsView.as_view(), name='user-permissions'),
    path('user/check-permission/', CheckPermissionView.as_view(), name='check-permission'),
    path('admin/initialize-permissions/', InitializePermissionsView.as_view(), name='initialize-permissions'),

    # User Profile endpoints (handled by the router)
    path('', include(router.urls)),
]
