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
*   **Role-Based Access Control**: Three-tier role hierarchy (customer, admin, superadmin) with granular permissions.
*   **E-commerce**: Core e-commerce functionality, including product and category management, order processing, and inventory tracking.
*   **User Profiles**: User-specific features such as order history, address book, and wishlists.
*   **Admin Dashboard**: Multi-level admin system with limited admin access for operations and full superadmin access for complete system management.

## Role-Based Access Control System

The API implements a comprehensive three-tier role system designed for scalable permission management:

### Role Hierarchy

| Role | Access Level | Description |
|------|--------------|-------------|
| **Customer** | Basic | Default role for all new users. Access to public content and personal data management. |
| **Admin** | Operations | Limited administrative access focused on business operations like order fulfillment, inventory management, and sales reporting. |
| **SuperAdmin** | System | Complete system access including user management, role assignments, and all administrative functions. |

### Permission Matrix

| Feature Category | Customer | Admin | SuperAdmin |
|-----------------|----------|--------|------------|
| Public Content (Products, Categories) | ✅ | ✅ | ✅ |
| Personal Data (Orders, Wishlist, Profile) | ✅ | ✅ | ✅ |
| Order Management (All Orders) | ❌ | ✅ | ✅ |
| Sales Reports & Analytics | ❌ | ✅ | ✅ |
| Product Catalog Management | ❌ | ✅ | ✅ |
| User Management (View/Edit/Delete) | ❌ | ❌ | ✅ |
| Role Administration (Promote/Demote) | ❌ | ❌ | ✅ |

### Security Features

*   **Role-based endpoint restrictions**: Each API endpoint is protected with appropriate permission classes.
*   **Hierarchical permissions**: Higher-level roles inherit all permissions from lower levels.
*   **Secure role management**: Only SuperAdmins can modify user roles, preventing privilege escalation.
*   **Granular access control**: Separate permission classes for different admin levels ensure precise access control.
