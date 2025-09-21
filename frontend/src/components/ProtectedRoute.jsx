import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, requireVerified = false }) => {
  const { currentUser, loading, isEmailVerified } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#9ACD32] border-t-transparent mx-auto mb-4"></div>
          <p className="text-white text-lg">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // If email verification is required and not verified, redirect to verify email page
  if (requireVerified && !isEmailVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  // If authenticated, render the protected component
  return children;
};

export default ProtectedRoute;
