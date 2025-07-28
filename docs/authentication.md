# Authentication API

This document details the endpoints related to user authentication and account management.

---

## User Registration

### `POST /api/register/`

Registers a new user in the system.

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

---

## User Login & Logout

### `POST /api/login/`

Authenticates a user and creates a session. The `sessionid` and `csrftoken` are returned in cookies.

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
        "first_name": "",
        "last_name": "",
        "role": "customer"
    }
    ```

### `POST /api/logout/`

Logs out the currently authenticated user.

*   **Example Request:**
    ```bash
    curl -b cookies.txt -X POST http://127.0.0.1:8000/api/logout/
    ```

*   **Success Response:** `200 OK`
    ```json
    {
        "detail": "Successfully logged out."
    }
    ```

---

## Password Reset

### `POST /api/auth/password/reset/`

Initiates the password reset process for a user.

*   **Example Request:**
    ```bash
    curl -X POST http://127.0.0.1:8000/api/auth/password/reset/ \
    -H "Content-Type: application/json" \
    -d '{"email": "test@example.com"}'
    ```

*   **Success Response:** `200 OK`
    ```json
    {
        "detail": "Password reset e-mail has been sent."
    }
    ```

---

## Account Management

### `GET /api/auth/user/`

Retrieves the details of the currently authenticated user.

*   **Example Request:**
    ```bash
    # Ensure you have a valid CSRF token in the header and session cookie
    curl -b cookies.txt -X GET http://127.0.0.1:8000/api/auth/user/ \
    -H "X-CSRFToken: <your_csrf_token>"
    ```

*   **Success Response:** `200 OK`
    ```json
    {
        "pk": 1,
        "email": "test@example.com",
        "username": "testuser",
        "first_name": "",
        "last_name": "",
        "role": "customer"
    }
    ```

### `DELETE /api/auth/user/`

Deactivates the account of the currently authenticated user (soft delete).

*   **Example Request:**
    ```bash
    curl -b cookies.txt -X DELETE http://127.0.0.1:8000/api/auth/user/ \
    -H "X-CSRFToken: <your_csrf_token>"
    ```

*   **Success Response:** `204 No Content`