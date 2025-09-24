import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Loading Component
const LoadingScreen = ({ message = "Verificando autenticación..." }) => (
  <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#9ACD32] border-t-transparent mx-auto mb-4"></div>
      <p className="text-white text-lg">{message}</p>
    </div>
  </div>
);

// Main Route Guard
export const RouteGuard = ({ 
  children, 
  requireAuth = false, 
  requireVerified = false, 
  requireOnboarding = false,
  blockIfAuth = false 
}) => {
  const { 
    isAuthenticated, 
    isEmailVerified, 
    onboardingComplete, 
    isNewUser, 
    loading 
  } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  // Block authenticated users (for login/register pages)
  if (blockIfAuth && isAuthenticated) {
    if (!isEmailVerified) {
      return <Navigate to="/verify-email" replace />;
    }
    if (isNewUser) {
      return <Navigate to="/onboarding" replace />;
    }
    return <Navigate to="/coming-soon" replace />;
  }

  // Require authentication
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Require email verification
  if (requireVerified && !isEmailVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  // Require completed onboarding
  if (requireOnboarding && !onboardingComplete) {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
};

// Convenience components for specific use cases
export const PublicRoute = ({ children }) => (
  <RouteGuard blockIfAuth={true}>
    {children}
  </RouteGuard>
);

export const ProtectedRoute = ({ children, requireVerified = false }) => (
  <RouteGuard requireAuth={true} requireVerified={requireVerified}>
    {children}
  </RouteGuard>
);

export const OnboardingRoute = ({ children }) => (
  <RouteGuard requireAuth={true} requireVerified={true}>
    {children}
  </RouteGuard>
);

export const DashboardRoute = ({ children }) => (
  <RouteGuard requireAuth={true} requireVerified={true} requireOnboarding={true}>
    {children}
  </RouteGuard>
);