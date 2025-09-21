import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const NewUserRoute = ({ children }) => {
  const { currentUser, loading, isNewUser } = useAuth();
  const location = useLocation();
  const navNewUser = Boolean(location.state && location.state.newUser);

  // Wait for auth to resolve to avoid intermediate flashes
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

  // If not authenticated → login
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated but not a new user (neither context nor nav state) → coming-soon
  if (!isNewUser && !navNewUser) {
    return <Navigate to="/coming-soon" replace />;
  }

  // New user → render onboarding
  return children;
};

export default NewUserRoute;
