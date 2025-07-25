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

You can test the API endpoints using `curl` from your terminal.

> **Note:** These commands assume you have just started the servers and have no active session. The `-c cookie.txt` flag saves the session cookie, and `-b cookie.txt` sends it with the next request.

**1. Register a New User**
```bash
curl -X POST http://127.0.0.1:8000/api/register/ \
-H "Content-Type: application/json" \
-d '{"username": "testuser", "email": "test@example.com", "password": "some_strong_password123"}'
```

**2. Log In**```bash
curl -X POST http://127.0.0.1:8000/api/login/ \
-H "Content-Type: application/json" \
-d '{"username": "testuser", "password": "some_strong_password123"}' \
-c cookie.txt
```

**3. Get Current User (Protected Route)**
```bash
curl -X GET http://127.0.0.1:8000/api/user/ -b cookie.txt```

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
