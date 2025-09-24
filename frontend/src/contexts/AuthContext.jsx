import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Computed properties - single source of truth
  const isAuthenticated = Boolean(currentUser);
  const isEmailVerified = Boolean(currentUser?.emailVerified);
  const onboardingComplete = Boolean(userProfile?.onboardingComplete);
  const isNewUser = isAuthenticated && isEmailVerified && !onboardingComplete;

  // Helper to load user profile
  const loadUserProfile = async (user) => {
    if (!user) {
      setUserProfile(null);
      return;
    }

    try {
      const profile = await authService.getUserProfile(user.uid);
      setUserProfile(profile);
    } catch (error) {
      console.error('Error loading user profile:', error);
      setUserProfile(null);
    }
  };

  // Auth functions
  const signUp = async (email, password, displayName) => {
    setError(null);
    setLoading(true);

    try {
      const result = await authService.signUpWithEmailAndPassword(email, password, displayName);
      setLoading(false);

      if (!result.success) {
        setError(result.message);
      }

      return result;
    } catch (err) {
      setError('Error inesperado al crear cuenta');
      setLoading(false);
      return { success: false, message: 'Error inesperado al crear cuenta' };
    }
  };

  const signIn = async (email, password) => {
    setError(null);
    setLoading(true);

    try {
      const result = await authService.signInWithEmailAndPassword(email, password);
      setLoading(false);

      if (!result.success) {
        setError(result.message);
      }

      return result;
    } catch (err) {
      setError('Error inesperado al iniciar sesión');
      setLoading(false);
      return { success: false, message: 'Error inesperado al iniciar sesión' };
    }
  };

  const signInWithGoogle = async () => {
    setError(null);
    setLoading(true);

    try {
      const result = await authService.signInWithGoogle();
      setLoading(false);

      if (!result.success) {
        setError(result.message);
      }

      return result;
    } catch (err) {
      setError('Error inesperado al iniciar sesión con Google');
      setLoading(false);
      return { success: false, message: 'Error inesperado al iniciar sesión con Google' };
    }
  };

  const completeOnboarding = async () => {
    if (!currentUser) {
      console.error('No current user when trying to complete onboarding');
      return { success: false };
    }

    try {
      console.log('Completing onboarding for user:', currentUser.uid);

      const result = await authService.updateUserProfile(currentUser.uid, {
        onboardingComplete: true
      });

      if (result.success) {
        console.log('Onboarding marked as complete, reloading profile...');

        // Reload profile to reflect changes - direct call without startTransition
        await loadUserProfile(currentUser);
      }

      return result;
    } catch (error) {
      console.error('Error completing onboarding:', error);
      return { success: false, error: error.message };
    }
  };

  const resendVerificationEmail = async () => {
    return authService.sendVerification();
  };

  const logout = async () => {
    setError(null);
    setLoading(true);

    try {
      const result = await authService.signOut();
      setLoading(false);
      return result;
    } catch (err) {
      setError('Error al cerrar sesión');
      setLoading(false);
      return { success: false, message: 'Error al cerrar sesión' };
    }
  };

  const verifyAndContinue = async () => {
    try {
      const refreshed = await authService.refreshCurrentUser();
      if (refreshed) {
        setCurrentUser(refreshed);
        // Also reload the user profile to ensure we have the latest data
        await loadUserProfile(refreshed);
        console.log('User refreshed - emailVerified:', refreshed.emailVerified);
        return Boolean(refreshed?.emailVerified);
      }
      return false;
    } catch (error) {
      console.error('Error in verifyAndContinue:', error);
      return false;
    }
  };

  const clearError = () => {
    setError(null);
  };

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged(async (user) => {
      setCurrentUser(user);

      if (user) {
        // Load user profile when user is authenticated
        await loadUserProfile(user);
      } else {
        setUserProfile(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    // State
    currentUser,
    userProfile,
    loading,
    error,

    // Computed properties
    isAuthenticated,
    isEmailVerified,
    onboardingComplete,
    isNewUser,

    // Actions
    signUp,
    signIn,
    signInWithGoogle,
    completeOnboarding,
    resendVerificationEmail,
    verifyAndContinue,
    logout,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};