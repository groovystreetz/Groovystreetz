# Groovystreetz E-Commerce - Backend API

This directory contains the Django backend for the Groovystreetz project. It provides a RESTful API for handling user authentication, product management, and orders.

---

## 🚀 Setup and Installation

Follow these steps to get the development server running on your local machine.

### 1. Prerequisites

*   Python 3.8+
*   Docker and Docker Compose (for running the PostgreSQL database)

### 2. Initial Setup

```bash
# 1. Navigate into the backend directory
cd backend/

# 2. Create a local environment file
cp .env.example .env

# 3. Create and activate a Python virtual environment
python3 -m venv .venv
source .venv/bin/activate

# 4. Install dependencies
pip install -r requirements.txt

# 5. Start the PostgreSQL database container
docker-compose up -d

# 6. Apply database migrations
python manage.py migrate

# 7. Create a superuser to access the admin panel
python manage.py createsuperuser
```

### 3. Running the Development Server

```bash
python manage.py runserver
```

The API will be available at `http://127.0.0.1:8000/`.

---

##  API Reference

For more detailed documentation, see the `docs/` directory in the project root.

### Authentication

#### `POST /api/register/`
Registers a new user.

*   **Example Request:**
    ```bash
    curl -X POST http://127.0.0.1:8000/api/register/ \
    -H "Content-Type: application/json" \
    -d '{
        "username": "testuser",
        "email": "test@example.com",
        "password": "TestPassword123",
        "password2": "TestPassword123"
    }'
    ```
*   **Success Response:** `201 Created`
    ```json
    {
        "detail": "Verification e-mail sent."
    }
    ```

#### `POST /api/login/`
Authenticates a user and returns a session cookie.

*   **Example Request:**
    ```bash
    curl -c cookies.txt -X POST http://127.0.0.1:8000/api/login/ \
    -H "Content-Type: application/json" \
    -d '{
        "email": "test@example.com",
        "password": "TestPassword123"
    }'
    ```
*   **Success Response:** `200 OK`
    ```json
    {
        "pk": 1,
        "email": "test@example.com",
        "username": "testuser",
        "role": "customer"
    }
    ```

### Products & Categories

#### `GET /api/categories/`
Get a list of all product categories.

*   **Example Request:**
    ```bash
    curl http://127.0.0.1:8000/api/categories/
    ```
*   **Success Response:** `200 OK`
    ```json
    [
        {"id": 1, "name": "T-Shirts", "slug": "t-shirts"},
        {"id": 2, "name": "Hoodies", "slug": "hoodies"}
    ]
    ```

#### `GET /api/products/`
Get a list of all products.

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
            "price": "25.00",
            "category": "T-Shirts"
        }
    ]
    ```

### Orders

#### `POST /api/orders/create/`
Create a new order. (Authentication required)

*   **Example Request:**
    ```bash
    curl -b cookies.txt -X POST http://127.0.0.1:8000/api/orders/create/ \
    -H "Content-Type: application/json" \
    -H "X-CSRFToken: <your_csrf_token>" \
    -d '{
        "shipping_address": "123 Main St",
        "total_price": "25.00",
        "items": [{"product": 1, "quantity": 1, "price": "25.00"}]
    }'
    ```
*   **Success Response:** `201 Created`
    ```json
    {
        "id": 1,
        "items": [{"product": 1, "quantity": 1, "price": "25.00"}],
        "total_price": "25.00",
        "shipping_address": "123 Main St",
        "status": "pending"
    }
    ```