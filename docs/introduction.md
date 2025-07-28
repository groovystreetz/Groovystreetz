# Introduction to the Groovystreetz Backend

Welcome to the documentation for the Groovystreetz backend API. This document provides a high-level overview of the architecture, technologies, and conventions used in this project.

## Technology Stack

The backend is built with a modern and robust technology stack:

*   **Python**: The core programming language.
*   **Django**: A high-level Python web framework that encourages rapid development and clean, pragmatic design.
*   **Django REST Framework (DRF)**: A powerful and flexible toolkit for building Web APIs in Django.
*   **dj-rest-auth & django-allauth**: For handling user registration, authentication (including social auth with Google), and other account management features.
*   **PostgreSQL**: A powerful, open-source object-relational database system.

## Architecture

The API is designed to be RESTful and follows standard conventions. It is organized into several logical components:

*   **`api` app**: This is the core Django app that contains all of the models, views, serializers, and URLs for the API.
*   **`main` app**: This app contains the main project settings, URL configuration, and other project-wide configurations.

## Key Features

The backend provides a comprehensive set of features to support the Groovystreetz application:

*   **User Authentication**: A complete authentication system with support for email/password and Google social login.
*   **E-commerce**: Core e-commerce functionality, including product and category management, order processing, and inventory tracking.
*   **User Profiles**: User-specific features such as order history, address book, and wishlists.
*   **Admin Dashboard**: A set of admin-only endpoints for managing users, orders, and viewing sales reports.
*   **Printful Integration**: A webhook for receiving order status updates from Printful.
