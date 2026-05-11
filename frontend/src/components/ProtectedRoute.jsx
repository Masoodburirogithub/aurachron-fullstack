// frontend/src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  console.log('ProtectedRoute check:', { isAuthenticated, isAdmin, loading }); // Debug log

  // REMOVED the loading spinner - now returns null while loading
  // Let LoadingScreen component handle all loading displays
  if (loading) {
    return null; // Don't render anything, LoadingScreen will show
  }

  if (!isAuthenticated || !isAdmin) {
    console.log('Redirecting to login - not authenticated or not admin');
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default ProtectedRoute;