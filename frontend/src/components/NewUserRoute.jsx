import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const NewUserRoute = ({ children }) => {
  const { currentUser, loading, isNewUser, isEmailVerified } = useAuth();
  const location = useLocation();
  const navNewUser = Boolean(location.state && location.state.newUser);
  const storageNewUser = (() => {
    try { return sessionStorage.getItem('kumia_new_user') === '1'; } catch { return false; }
  })();

  console.log('NewUserRoute - Debug:', {
    currentUser: currentUser?.email,
    loading,
    isNewUser,
    isEmailVerified,
    navNewUser,
    storageNewUser,
    locationState: location.state
  });

  if (loading) {
    console.log('NewUserRoute - Loading...');
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#9ACD32] border-t-transparent mx-auto mb-4"></div>
          <p className="text-white text-lg">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    console.log('NewUserRoute - No user, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // Require email verification before allowing onboarding
  if (!isEmailVerified) {
    console.log('NewUserRoute - Email not verified, redirecting to verify-email');
    return <Navigate to="/verify-email" replace />;
  }

  // Check if user should access onboarding
  const shouldAllowOnboarding = isNewUser || navNewUser || storageNewUser;

  if (!shouldAllowOnboarding) {
    console.log('NewUserRoute - Not a new user, redirecting to coming-soon');
    return <Navigate to="/coming-soon" replace />;
  }

  console.log('NewUserRoute - Allowing access to onboarding');
  return children;
};

export default NewUserRoute;
