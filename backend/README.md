# Groovystreetz E-Commerce - Backend API

This directory contains the Django backend for the Groovystreetz project. It provides a RESTful API for handling user authentication, product management, and orders. The project is configured to run with a PostgreSQL database managed by Docker.

### Technology Stack

- Python 3
- Django & Django REST Framework
- PostgreSQL (via Docker)
- Docker Compose
- `python-dotenv` for environment management

---

## 🚀 Setup and Installation

Follow these steps to get the development server running on your local machine. **Docker Desktop must be installed and running before you begin.**

### 1. Initial Project Setup

If you are setting this project up for the first time:

```bash
# 1. Navigate into the backend directory
cd backend/

# 2. Create a local environment file by copying the example
# (This file is ignored by Git and stores your secret credentials)
cp .env.example .env

# 3. Create and activate a Python virtual environment
python3 -m venv venv
source venv/bin/activate
# On Windows, use: venv\Scripts\activate

# 4. Install all required Python dependencies
pip install -r requirements.txt
```

*Note: You can modify the credentials in your newly created `.env` file if needed. The default values are already configured to work with the `docker-compose.yml` file.*

### 2. Running the Development Environment

This is the standard workflow you will use every day.

```bash
# 1. Start the PostgreSQL database container in the background
docker-compose up -d

# 2. IMPORTANT: Wait for the database to be ready
# The first time you run this, the database needs 10-15 seconds to initialize.
# If you get a "Connection refused" error, it means you ran the next command too quickly.
# See the Troubleshooting section for more details.

# 3. Apply any new database migrations
python manage.py migrate

# 4. Run the Django development server
python manage.py runserver
```

The backend API will now be available at `http://127.0.0.1:8000/`.

### 3. Stopping the Environment

When you are finished working, you can stop the database container.

```bash
docker-compose down
```
*Your database data is safely stored in a Docker volume and will be available the next time you run `docker-compose up -d`.*

---

## 🧪 Testing API Endpoints

### Local Email/Password Authentication

These endpoints are for traditional username/password login and registration.

**1. Register a New User**
```bash
curl -X POST http://127.0.0.1:8000/api/register/ \
-H "Content-Type: application/json" \
-d '{"username": "localuser", "email": "local@example.com", "password": "a_secure_password"}'
```

**2. Log In and Save Session Cookie**
This command saves the session cookie to `cookie.txt` for use in subsequent requests.
```bash
curl -X POST http://127.0.0.1:8000/api/login/ \
-H "Content-Type: application/json" \
-d '{"email": "local@example.com", "password": "a_secure_password"}' \
-c cookie.txt```

**3. Get Current User Details (Protected)**
This command uses the saved cookie to authenticate. The endpoint is provided by `dj-rest-auth`.
```bash
curl -X GET http://127.0.0.1:8000/api/auth/user/ -b cookie.txt
```

**4. Log Out**
```bash
curl -X POST http://127.0.0.1:8000/api/logout/ -b cookie.txt
```

---

## 🔧 Troubleshooting

### "Connection refused" Error on `migrate`

```
django.db.utils.OperationalError: ... connection refused
```

This is the most common issue. It means the PostgreSQL database inside the Docker container hasn't finished starting up yet when Django tries to connect to it.

**Solution:**
1.  Wait 10-15 seconds after running `docker-compose up -d` before you run `python manage.py migrate`.
2.  You can check if the database is ready by viewing its logs. When you see `database system is ready to accept connections`, it's safe to proceed.
    ```bash
    docker-compose logs -f db
    # Press Ctrl+C to exit the logs when ready.
    ```

### Creating a Superuser

To access the Django Admin site, you'll need a superuser account.

```bash
# Make sure your containers are running
docker-compose up -d

# Create the superuser
python manage.py createsuperuser

# Follow the prompts to set a username, email, and password.
```
You can now log in at `http://127.0.0.1:8000/admin/`.

---

### **How to Use**

You can copy these sections and paste them into your `backend/README.md` file, replacing the older content.

---

### **Updated `README.md` Sections**

#### **(Section 1: Add this new section to your README)**

## 🧪 Testing Social Authentication (Google)

This backend is configured to handle Google social logins. You can test the entire flow without a frontend by using the Google OAuth 2.0 Playground.

**Setup:**
1.  **Google Cloud Console:** Make sure your OAuth 2.0 Client ID has the Playground's redirect URI authorized: `https://developers.google.com/oauthplayground`
2.  **Run Your Server:** Your Django server must be running (`python manage.py runserver`).

### Testing Steps:

**Step 1: Get an Access Token from Google**

1.  Go to the [Google OAuth Playground](https://developers.google.com/oauthplayground/).
2.  Click the gear icon ⚙️, check **"Use your own OAuth credentials"**, and enter your `Client ID` and `Client Secret` from your `.env` file.
3.  In the "Select & authorize APIs" box, enter both of these scopes, separated by a space:
    `https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile`
4.  Click **"Authorize APIs"** and complete the Google login pop-up.
5.  Click **"Exchange authorization code for tokens"**.
6.  A new **`access_token`** will appear. **Copy this entire token string.**

**Step 2: Send the Token to Your Django API**

Open a terminal and use the following `curl` command, pasting the `access_token` you just copied.

```bash
curl -X POST http://127.0.0.1:8000/api/auth/google/ \
-H "Content-Type: application/json" \
-d '{"access_token": "PASTE_YOUR_COPIED_ACCESS_TOKEN_HERE"}'
```

**Expected Result:**
You will get a `200 OK` response with a JSON object containing the newly created or logged-in user's details (e.g., `pk`, `email`, `username`, etc.), as defined by your `CustomUserDetailsSerializer`.

---
