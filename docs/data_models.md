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
*   `total_price`: `DecimalField` - The total price of the order.
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
