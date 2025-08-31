import React from 'react';
import { Navigate } from 'react-router-dom';
import { useIsAdmin } from '../hooks/useAdmin';

const ProtectedRoute = ({ children }) => {
  const { isAdmin, isLoading } = useIsAdmin();

  console.log('ProtectedRoute - isAdmin:', isAdmin, 'isLoading:', isLoading);

  if (isLoading) {
    console.log('ProtectedRoute - Loading...');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    console.log('ProtectedRoute - Not admin, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  console.log('ProtectedRoute - Admin authenticated, rendering children');
  return children;
};

export default ProtectedRoute;
