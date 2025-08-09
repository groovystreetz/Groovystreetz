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

## Admin Endpoints

These endpoints are restricted to users with the `admin` role.

### Get All Users

*   **Endpoint:** `GET /api/admin/users/`
*   **Example Request:**
    ```bash
    curl -b admin_cookies.txt -X GET http://127.0.0.1:8000/api/admin/users/ \
    -H "X-CSRFToken: <your_admin_csrf_token>"
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
        }
    ]
    ```

### Get Sales Report

*   **Endpoint:** `GET /api/admin/sales-report/`
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