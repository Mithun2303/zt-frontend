import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getAuthToken } from '../services/api';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const token = getAuthToken();
  const location = useLocation();

  if (!token) {
    // Redirect to login page but save the attempted url
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
