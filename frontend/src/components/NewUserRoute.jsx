import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const NewUserRoute = ({ children }) => {
  const { currentUser, loading, isNewUser, isEmailVerified } = useAuth();
  const location = useLocation();
  const navNewUser = Boolean(location.state && location.state.newUser);

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

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Require email verification before allowing onboarding
  if (!isEmailVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  if (!isNewUser && !navNewUser) {
    return <Navigate to="/coming-soon" replace />;
  }

  return children;
};

export default NewUserRoute;
