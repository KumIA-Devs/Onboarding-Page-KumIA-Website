import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AuthRedirect = ({ children }) => {
  const { currentUser, loading, isNewUser, isEmailVerified } = useAuth();

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
    const storageNewUser = (() => {
      try { return typeof window !== 'undefined' && sessionStorage.getItem('kumia_new_user') === '1'; } catch { return false; }
    })();
    const effectiveNewUser = isNewUser || storageNewUser;

    // If it's a new user, redirect to onboarding first
    if (effectiveNewUser) {
      return <Navigate to="/onboarding" replace />;
    }

    // If email is verified, redirect to main area
    if (isEmailVerified) {
      return <Navigate to="/coming-soon" replace />;
    }

    // If NOT verified, allow login page to be visible (so user can see instructions or switch accounts)
    return children;
  }

  // If not authenticated, show login page
  return children;
};

export default AuthRedirect;
