import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/authService';

const ExistingUserRoute = ({ children }) => {
  const { currentUser, isEmailVerified, loading, isNewUser } = useAuth();
  const [checkingProfile, setCheckingProfile] = useState(true);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    const checkUserProfile = async () => {
      if (!currentUser || !isEmailVerified || loading) {
        setCheckingProfile(false);
        return;
      }

      // IMPORTANT: Don't redirect new users that just signed up with Google
      // They should go through SignInSignUp navigation logic, not this guard
      const storageNewUser = (() => {
        try { return sessionStorage.getItem('kumia_new_user') === '1'; } catch { return false; }
      })();

      if (isNewUser || storageNewUser) {
        console.log('ExistingUserRoute: Detected new user, NOT checking profile - let SignInSignUp handle navigation');
        setCheckingProfile(false);
        return;
      }

      try {
        // Get user profile from Firestore
        const profile = await authService.getUserProfile(currentUser.uid);

        // If onboardingComplete is false, redirect to onboarding
        if (profile && profile.onboardingComplete === false) {
          console.log('ExistingUserRoute: Redirecting to onboarding - onboardingComplete is false for', currentUser.email);
          setShouldRedirect(true);
        } else {
          console.log('ExistingUserRoute: User can stay in coming-soon - onboardingComplete is', profile?.onboardingComplete, 'for', currentUser.email);
        }
      } catch (error) {
        console.error('Error checking user profile:', error);
      }

      setCheckingProfile(false);
    };

    checkUserProfile();
  }, [currentUser, isEmailVerified, loading, isNewUser]);

  // Show loading while checking authentication or profile
  if (loading || checkingProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#9ACD32] border-t-transparent mx-auto mb-4"></div>
          <p className="text-white text-lg">Verificando perfil...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // If email not verified, redirect to verification page
  if (!isEmailVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  // If onboarding not complete, redirect to onboarding
  if (shouldRedirect) {
    return <Navigate to="/onboarding" replace />;
  }

  // User is authenticated, verified, and has completed onboarding
  return children;
};

export default ExistingUserRoute;
