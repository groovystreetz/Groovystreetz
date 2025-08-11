# API Endpoints

This document details the main API endpoints for the Groovystreetz application.

---

## Public Endpoints

These endpoints are publicly accessible and do not require authentication.

### Get All Categories

*   **Endpoint:** `GET /api/categories/`
*   **Example Request:**
    ```bash
    curl http://127.0.0.1:8000/api/categories/
    ```
*   **Success Response:** `200 OK`
    ```json
    [
        {
            "id": 1,
            "name": "T-Shirts",
            "slug": "t-shirts"
        },
        {
            "id": 2,
            "name": "Hoodies",
            "slug": "hoodies"
        }
    ]
    ```

### Get All Products

*   **Endpoint:** `GET /api/products/`
*   **Example Request:**
    ```bash
    curl http://127.0.0.1:8000/api/products/
    ```
*   **Success Response:** `200 OK`
    ```json
    [
        {
            "id": 1,
            "name": "Groovy T-Shirt",
            "description": "A cool t-shirt",
            "price": "25.00",
            "image": "/media/products/t-shirt.jpg",
            "category": "T-Shirts",
            "stock": 100
        },
        {
            "id": 2,
            "name": "Cozy Hoodie",
            "description": "A warm hoodie",
            "price": "50.00",
            "image": "/media/products/hoodie.jpg",
            "category": "Hoodies",
            "stock": 50
        }
    ]
    ```

---

## User Profile Endpoints

These endpoints require authentication.

### Create a New Order

*   **Endpoint:** `POST /api/orders/create/`
*   **Example Request:**
    ```bash
    curl -b cookies.txt -X POST http://127.0.0.1:8000/api/orders/create/ \
    -H "Content-Type: application/json" \
    -H "X-CSRFToken: <your_csrf_token>" \
    -d '{
        "shipping_address": "123 Main St, Anytown, USA",
        "total_price": "75.00",
        "items": [
            {"product": 1, "quantity": 1, "price": "25.00"},
            {"product": 2, "quantity": 1, "price": "50.00"}
        ]
    }'
    ```
*   **Success Response:** `201 Created`
    ```json
    {
        "id": 1,
        "items": [
            {"product": 1, "quantity": 1, "price": "25.00"},
            {"product": 2, "quantity": 1, "price": "50.00"}
        ],
        "total_price": "75.00",
        "shipping_address": "123 Main St, Anytown, USA",
        "created_at": "2025-07-28T05:10:48.610360Z",
        "status": "pending"
    }
    ```

### Get User's Order History

*   **Endpoint:** `GET /api/orders/`
*   **Example Request:**
    ```bash
    curl -b cookies.txt -X GET http://127.0.0.1:8000/api/orders/ \
    -H "X-CSRFToken: <your_csrf_token>"
    ```
*   **Success Response:** `200 OK`
    ```json
    [
        {
            "id": 1,
            "items": [
                {"product": 1, "quantity": 1, "price": "25.00"},
                {"product": 2, "quantity": 1, "price": "50.00"}
            ],
            "total_price": "75.00",
            "shipping_address": "123 Main St, Anytown, USA",
            "created_at": "2025-07-28T05:10:48.610360Z",
            "status": "pending"
        }
    ]
    ```

---

## Role-Based Access Control

The API implements a three-tier role system:

*   **`customer`** - Access to public endpoints + own data (orders, wishlist, designs)
*   **`admin`** - Limited admin access for operations (orders, sales reports, product management)
*   **`superadmin`** - Full system access (everything admin can do + user management + role changes)

---

## Admin Endpoints (Limited Access)

These endpoints are accessible to users with `admin` or `superadmin` roles.

### Get All Orders

*   **Endpoint:** `GET /api/admin/orders/`
*   **Required Role:** `admin` or `superadmin`
*   **Description:** List all orders in the system for management and fulfillment.

---

## SuperAdmin Endpoints (Full Access)

These endpoints are restricted to users with the `superadmin` role only.

### Get All Users

*   **Endpoint:** `GET /api/admin/users/`
*   **Required Role:** `superadmin`
*   **Description:** View all users in the system for user management.
*   **Example Request:**
    ```bash
    curl -b superadmin_cookies.txt -X GET http://127.0.0.1:8000/api/admin/users/ \
    -H "X-CSRFToken: <your_superadmin_csrf_token>"
    ```
*   **Success Response:** `200 OK`
    ```json
    [
        {
            "pk": 1,
            "email": "customer@example.com",
            "username": "customer",
            "first_name": "",
            "last_name": "",
            "role": "customer"
        },
        {
            "pk": 2,
            "email": "admin@example.com",
            "username": "adminuser",
            "first_name": "",
            "last_name": "",
            "role": "admin"
        },
        {
            "pk": 3,
            "email": "superadmin@example.com",
            "username": "superuser",
            "first_name": "",
            "last_name": "",
            "role": "superadmin"
        }
    ]
    ```

### Update User Details & Roles

*   **Endpoint:** `PUT /api/admin/users/{id}/` or `PATCH /api/admin/users/{id}/`
*   **Required Role:** `superadmin`
*   **Description:** Update user information including role changes.
*   **Example: Promote user to admin:**
    ```bash
    curl -b superadmin_cookies.txt -X PATCH http://127.0.0.1:8000/api/admin/users/2/ \
    -H "Content-Type: application/json" \
    -H "X-CSRFToken: <your_superadmin_csrf_token>" \
    -d '{"role": "admin"}'
    ```

### Remove User (Soft Delete)

*   **Endpoint:** `DELETE /api/admin/users/{id}/`
*   **Required Role:** `superadmin`
*   **Description:** Deactivate a user account (soft delete - preserves data integrity).
*   **Example Request:**
    ```bash
    curl -b superadmin_cookies.txt -X DELETE http://127.0.0.1:8000/api/admin/users/2/ \
    -H "X-CSRFToken: <your_superadmin_csrf_token>"
    ```
*   **Success Response:** `204 No Content`

---

## Shared Admin Endpoints

These endpoints are accessible to both `admin` and `superadmin` roles.

### Get Sales Report

*   **Endpoint:** `GET /api/admin/sales-report/`
*   **Required Role:** `admin` or `superadmin`
*   **Example Request:**
    ```bash
    curl -b admin_cookies.txt -X GET http://127.0.0.1:8000/api/admin/sales-report/ \
    -H "X-CSRFToken: <your_admin_csrf_token>"
    ```
*   **Success Response:** `200 OK`
    ```json
    {
        "total_sales": 150.00,
        "total_orders": 2
    }
    ```

### Manage Products

This endpoint provides full CRUD (Create, Read, Update, Delete) functionality for products.

*   **Required Role:** `admin` or `superadmin`
*   **List All Products:** `GET /api/admin/products/`
*   **Create a Product:** `POST /api/admin/products/`
*   **Retrieve a Product:** `GET /api/admin/products/{id}/`
*   **Update a Product:** `PUT /api/admin/products/{id}/` or `PATCH /api/admin/products/{id}/`
*   **Delete a Product:** `DELETE /api/admin/products/{id}/`

*   **Example: Create a Product**
    Since this is a `multipart/form-data` request (for the image upload), it's best to use a tool like `curl` with the `-F` flag.

    ```bash
    curl -b admin_cookies.txt -X POST http://127.0.0.1:8000/api/admin/products/ \
    -H "X-CSRFToken: <your_admin_csrf_token>" \
    -F "name=New Awesome T-Shirt" \
    -F "description=This is the best t-shirt ever." \
    -F "price=29.99" \
    -F "category=1" \
    -F "stock=150" \
    -F "image=@/path/to/your/image.jpg"
    ```

*   **Success Response:** `201 Created`
    ```json
    {
        "id": 3,
        "name": "New Awesome T-Shirt",
        "description": "This is the best t-shirt ever.",
        "price": "29.99",
        "image": "/media/products/image.jpg",
        "category": 1,
        "stock": 150
    }
    ```

---

## Coupon System Endpoints

### Validate Coupon Code

*   **Endpoint:** `POST /api/coupons/validate/`
*   **Required Role:** Authenticated user
*   **Description:** Validate a coupon code and calculate potential discount before applying to order
*   **Request Body:**
    ```json
    {
        "coupon_code": "SAVE20",
        "order_total": "100.00"
    }
    ```
*   **Success Response:** `200 OK`
    ```json
    {
        "valid": true,
        "coupon": {
            "code": "SAVE20",
            "name": "20% Off Everything",
            "discount_type": "percentage",
            "discount_value": "20.00",
            "no_return_policy": false
        },
        "discount_amount": "20.00",
        "final_total": "80.00"
    }
    ```
*   **Error Response:** `400 Bad Request`
    ```json
    {
        "valid": false,
        "errors": ["This coupon has expired", "Minimum order value of $50.00 required"]
    }
    ```

### Apply Coupon to Order

*   **Endpoint:** `POST /api/coupons/apply/`
*   **Required Role:** Authenticated user
*   **Description:** Apply a coupon code to user's order/cart
*   **Request Body:**
    ```json
    {
        "coupon_code": "SAVE20"
    }
    ```
*   **Success Response:** `200 OK`
    ```json
    {
        "message": "Coupon SAVE20 is ready to be applied to your order",
        "coupon": {
            "id": 1,
            "code": "SAVE20",
            "name": "20% Off Everything",
            "discount_type": "percentage",
            "discount_value": "20.00",
            "no_return_policy": false
        }
    }
    ```

---

## Admin Coupon Management

### Manage Coupons (CRUD)

*   **Required Role:** `admin` or `superadmin`
*   **Base Endpoint:** `/api/admin/coupons/`
*   **Operations:**
    *   **List All Coupons:** `GET /api/admin/coupons/`
    *   **Create Coupon:** `POST /api/admin/coupons/`
    *   **Get Coupon:** `GET /api/admin/coupons/{id}/`
    *   **Update Coupon:** `PUT/PATCH /api/admin/coupons/{id}/`
    *   **Delete Coupon:** `DELETE /api/admin/coupons/{id}/`

*   **Example: Create Percentage Coupon**
    ```bash
    curl -b admin_cookies.txt -X POST http://127.0.0.1:8000/api/admin/coupons/ \
    -H "Content-Type: application/json" \
    -H "X-CSRFToken: <your_admin_csrf_token>" \
    -d '{
        "code": "SAVE20",
        "name": "20% Off Everything",
        "description": "Get 20% off your entire order",
        "discount_type": "percentage",
        "discount_value": "20.00",
        "minimum_order_value": "50.00",
        "max_uses_total": 1000,
        "max_uses_per_user": 1,
        "valid_from": "2025-01-01T00:00:00Z",
        "valid_until": "2025-12-31T23:59:59Z",
        "is_active": true,
        "no_return_policy": false
    }'
    ```

*   **Example: Create No-Return Policy Coupon**
    ```bash
    curl -b admin_cookies.txt -X POST http://127.0.0.1:8000/api/admin/coupons/ \
    -H "Content-Type: application/json" \
    -H "X-CSRFToken: <your_admin_csrf_token>" \
    -d '{
        "code": "FINAL50",
        "name": "50% Off Final Sale",
        "description": "Massive discount but no returns allowed",
        "discount_type": "percentage",
        "discount_value": "50.00",
        "minimum_order_value": "100.00",
        "max_uses_total": 500,
        "max_uses_per_user": 1,
        "valid_from": "2025-01-01T00:00:00Z",
        "valid_until": "2025-01-31T23:59:59Z",
        "is_active": true,
        "no_return_policy": true
    }'
    ```

### Coupon Usage Analytics

*   **Endpoint:** `GET /api/admin/coupon-usage/`
*   **Required Role:** `admin` or `superadmin`
*   **Description:** View all coupon usage records
*   **Optional Filters:**
    *   `?date_from=2025-01-01`
    *   `?date_to=2025-01-31`
    *   `/api/admin/coupon-usage/{coupon_id}/` - Usage for specific coupon

### Coupon Statistics

*   **Endpoint:** `GET /api/admin/coupon-stats/`
*   **Required Role:** `admin` or `superadmin`
*   **Description:** Get comprehensive coupon system analytics
*   **Response Example:**
    ```json
    {
        "total_coupons": 25,
        "active_coupons": 18,
        "expired_coupons": 3,
        "total_usage": 1250,
        "total_discount_given": 15750.00,
        "top_coupons": [
            {
                "code": "SAVE20",
                "name": "20% Off Everything",
                "usage_count": 450,
                "discount_type": "percentage"
            }
        ]
    }
    ```