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
*   **Coupon System**: Comprehensive discount management with flexible pricing, policy controls, and usage tracking.
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

## Coupon System

The platform features a sophisticated coupon and discount management system designed for maximum flexibility and control:

### Discount Types
*   **Percentage Discounts** - Apply percentage-based reductions (e.g., 20% off)
*   **Fixed Amount Discounts** - Apply fixed dollar amounts (e.g., $10 off)
*   **Free Shipping** - Waive shipping costs for qualifying orders
*   **Buy X Get Y** - Complex promotional offers (e.g., Buy 2 Get 1 Free)

### Business Logic & Controls
*   **Usage Limits** - Control total uses and per-user limits
*   **Time Constraints** - Set validity periods with start/end dates
*   **Minimum Order Values** - Require minimum purchase amounts
*   **Product/Category Restrictions** - Target specific items or categories
*   **User Restrictions** - Create user-specific or role-based offers

### Policy Management
*   **No Return Policy** - Certain high-discount coupons void return rights
*   **Stacking Controls** - Allow or prevent multiple coupon usage
*   **Real-time Validation** - Comprehensive validation before application
*   **Usage Tracking** - Complete audit trail for analytics and compliance

### Key Features
*   **Flexible Pricing Logic** - Supports complex discount calculations
*   **Admin Management** - Full CRUD operations for coupon management
*   **Analytics Dashboard** - Usage statistics and performance metrics
*   **Policy Enforcement** - Automatic application of business rules
*   **Fraud Prevention** - Usage limits and validation prevent abuse
