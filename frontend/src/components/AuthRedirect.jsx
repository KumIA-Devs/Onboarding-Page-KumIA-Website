import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AuthRedirect = ({ children }) => {
  const { currentUser, loading, isNewUser } = useAuth();

  // Show loading while checking authentication
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

  // If user is authenticated and tries to access login
  if (currentUser) {
    console.log('AuthRedirect - User:', currentUser.email, 'isNewUser:', isNewUser);

    // If it's a new user, redirect to onboarding first
    if (isNewUser) {
      console.log('Redirecting to onboarding for new user');
      return <Navigate to="/onboarding" replace />;
    }
    // If it's an existing user, redirect to dashboard
    console.log('Redirecting to dashboard for existing user');
    return <Navigate to="/dashboard" replace />;
  }

  // If not authenticated, show login page
  return children;
};

export default AuthRedirect;
