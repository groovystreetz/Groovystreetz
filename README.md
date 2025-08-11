
---

# ✨ Groovystreetz E-Commerce Project

Welcome to the Groovystreetz E-Commerce project! This is a modern, full-stack web application featuring a decoupled frontend and backend, built with a focus on scalability and clean architecture.

The application is designed to provide a seamless shopping experience, from browsing products to secure checkout. The backend is a robust Django REST API, and the frontend is a dynamic single-page application built with React.

## Documentation

For detailed information about the project, please refer to the documentation in the `docs/` directory:

*   **[Introduction](docs/introduction.md)**: High-level overview of the backend architecture and technologies.
*   **[Authentication API](docs/authentication.md)**: Detailed documentation for all user authentication endpoints.
*   **[API Endpoints](docs/api_endpoints.md)**: A comprehensive guide to all API endpoints.
*   **[Data Models](docs/data_models.md)**: A description of the database models, their fields, and their relationships.

## Technology Stack

This project leverages a modern and powerful set of technologies for both the backend and frontend.

### Backend

*   **Framework:** Django & Django REST Framework
*   **Language:** Python 3
*   **Database:** PostgreSQL
*   **Containerization:** Docker & Docker Compose
*   **Authentication:** Session-based authentication
*   **Utilities:** `python-dotenv` for environment management

### Frontend

*   **Framework:** React (with Vite)
*   **Language:** JavaScript (JSX)
*   **Styling:** Tailwind CSS
*   **API Communication:** Axios
*   **Routing:** React Router DOM

## Project Structure

The repository is organized into two main directories, keeping a clear separation between the frontend and backend code.

```
/
├── backend/        # Contains the Django REST API and database configuration.
│   └── README.md   # Backend-specific documentation.
│
├── frontend/       # Contains the React user interface.
│   └── README.md   # Frontend-specific documentation.
│
└── README.md       # You are here.
```



For detailed setup instructions and API documentation, please refer to the `README.md` file inside the respective `backend` or `frontend` directory.
