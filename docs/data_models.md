# Data Models

This document describes the database models used in the Groovystreetz backend.

## Core Models

### `CustomUser`

Stores user account information.

*   `username`: `CharField` - The user's username.
*   `email`: `EmailField` - The user's email address (used for login).
*   `role`: `CharField` - The user's role with three tiers:
    *   `customer` - Default role for regular users
    *   `admin` - Limited admin access for operations management
    *   `superadmin` - Full system access for complete administration
*   `is_active`: `BooleanField` - Designates whether the user's account is active.

### `Category`

Represents a product category.

*   `name`: `CharField` - The name of the category.
*   `slug`: `SlugField` - A URL-friendly version of the category name.

### `Product`

Represents a product for sale.

*   `category`: `ForeignKey` to `Category` - The category the product belongs to.
*   `name`: `CharField` - The name of the product.
*   `description`: `TextField` - A description of the product.
*   `price`: `DecimalField` - The price of the product.
*   `image`: `ImageField` - An uploaded image file for the product.
*   `stock`: `PositiveIntegerField` - The number of items in stock.

### `Design`

Represents a user-uploaded design.

*   `user`: `ForeignKey` to `CustomUser` - The user who uploaded the design.
*   `image_url`: `URLField` - A URL to the design image.

### `Order`

Represents a customer's order.

*   `user`: `ForeignKey` to `CustomUser` - The user who placed the order.
*   `status`: `CharField` - The status of the order (`pending`, `shipped`, `delivered`, `cancelled`).
*   `original_price`: `DecimalField` - The price before any discounts are applied.
*   `discount_amount`: `DecimalField` - The total discount amount applied from coupons.
*   `total_price`: `DecimalField` - The final price after discounts.
*   `applied_coupon`: `ForeignKey` to `Coupon` - The coupon used for this order (if any).
*   `no_return_allowed`: `BooleanField` - Whether returns are allowed (policy from coupon).
*   `shipping_address`: `TextField` - The shipping address for the order.
*   `tracking_number`: `CharField` - The tracking number for the shipment.

### `OrderItem`

Represents a single item within an order.

*   `order`: `ForeignKey` to `Order` - The order this item belongs to.
*   `product`: `ForeignKey` to `Product` - The product that was ordered.
*   `quantity`: `PositiveIntegerField` - The quantity of the product that was ordered.
*   `price`: `DecimalField` - The price of the product at the time of purchase.

## User Profile Models

### `Address`

Represents a user's shipping address.

*   `user`: `ForeignKey` to `CustomUser` - The user this address belongs to.
*   `address_line_1`: `CharField`
*   `address_line_2`: `CharField`
*   `city`: `CharField`
*   `state`: `CharField`
*   `postal_code`: `CharField`
*   `country`: `CharField`
*   `is_default`: `BooleanField` - Whether this is the user's default address.

### `Wishlist`

Represents a user's wishlist.

*   `user`: `OneToOneField` to `CustomUser` - The user this wishlist belongs to.
*   `products`: `ManyToManyField` to `Product` - The products in the user's wishlist.

## Coupon System Models

### `Coupon`

Represents a discount coupon with flexible pricing and policy controls.

*   `code`: `CharField` - Unique coupon code (e.g., "SAVE20", "WELCOME10").
*   `name`: `CharField` - Display name for the coupon.
*   `description`: `TextField` - Detailed description of the offer.
*   `discount_type`: `CharField` - Type of discount:
    *   `percentage` - Percentage off (e.g., 20% off)
    *   `fixed` - Fixed amount off (e.g., $10 off)
    *   `free_shipping` - Free shipping offer
    *   `buy_x_get_y` - Buy X get Y free offers
*   `discount_value`: `DecimalField` - The discount amount or percentage value.
*   `minimum_order_value`: `DecimalField` - Minimum order total required to use coupon.
*   `max_uses_total`: `IntegerField` - Total usage limit across all users (optional).
*   `max_uses_per_user`: `IntegerField` - Usage limit per individual user.
*   `valid_from`: `DateTimeField` - When the coupon becomes active.
*   `valid_until`: `DateTimeField` - When the coupon expires.
*   `is_active`: `BooleanField` - Enable/disable the coupon.
*   `no_return_policy`: `BooleanField` - If true, orders with this coupon cannot be returned.
*   `allow_stacking`: `BooleanField` - Whether multiple coupons can be used together.
*   `categories`: `ManyToManyField` to `Category` - Restrict to specific categories (optional).
*   `products`: `ManyToManyField` to `Product` - Restrict to specific products (optional).
*   `user_restrictions`: `ManyToManyField` to `CustomUser` - Restrict to specific users (optional).
*   `created_by`: `ForeignKey` to `CustomUser` - Admin who created the coupon.

### `CouponUsage`

Tracks coupon usage for analytics and enforcement.

*   `coupon`: `ForeignKey` to `Coupon` - The coupon that was used.
*   `user`: `ForeignKey` to `CustomUser` - The user who used the coupon.
*   `order`: `ForeignKey` to `Order` - The order where the coupon was applied.
*   `used_at`: `DateTimeField` - When the coupon was used.
*   `discount_amount`: `DecimalField` - The actual discount amount applied.
*   `original_order_value`: `DecimalField` - The order value before discount.
