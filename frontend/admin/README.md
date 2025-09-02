# Groovystreetz Admin Panel

A comprehensive admin panel for managing the Groovystreetz e-commerce platform.

## Features

### 🔐 Authentication
- Secure admin login with CSRF protection
- Role-based access control (admin, superadmin)
- Protected routes for admin-only access

### 👥 User Management
- View all platform users
- Filter users by role (customer, admin, superadmin)
- Search users by name, email, or username
- User statistics and analytics
- Role-based user categorization

### 📊 Dashboard
- Overview of platform metrics
- User statistics
- Order tracking
- Sales analytics

## Getting Started

### Prerequisites
- Node.js 18+ 
- Backend API running on `http://localhost:8000`

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

The admin panel will be available at `http://localhost:5173`

### Building for Production
```bash
npm run build
```

## API Endpoints

### Authentication
- `POST /api/login/` - Admin login
- `GET /api/auth/user/` - Get current user info

### User Management
- `GET /api/admin/users/` - Get all users (admin only)

## Authentication Flow

1. Admin navigates to `/login`
2. Enters admin credentials
3. System validates admin role (admin or superadmin)
4. Redirects to dashboard on success
5. All protected routes check authentication status

## User Roles

- **Customer**: Regular platform users
- **Admin**: Platform administrators with limited access
- **Super Admin**: System administrators with full access

## Security Features

- CSRF token protection
- Credential-based authentication
- Role-based route protection
- Secure cookie handling

## File Structure

```
src/
├── components/
│   ├── Layout/           # Layout components
│   ├── PageComponents/   # Page-specific components
│   │   └── Customers/    # User management
│   └── ui/              # Reusable UI components
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions
├── pages/               # Page components
└── App.jsx             # Main app component
```

## Dependencies

- React 19
- React Router DOM
- Axios for API calls
- Zustand for state management
- TanStack Query for data fetching
- Tailwind CSS for styling
- Lucide React for icons

## Development Notes

- Uses `withCredentials: true` for API calls
- CSRF tokens are automatically included in headers
- Protected routes redirect to login if unauthorized
- Admin authentication is checked on every route change
