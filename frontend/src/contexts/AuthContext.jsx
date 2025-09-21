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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isNewUser, setIsNewUser] = useState(false);

  // Auth functions
  const signUp = async (email, password, displayName) => {
    setError(null);
    setLoading(true);

    try {
      const result = await authService.signUpWithEmailAndPassword(email, password, displayName);

      if (result.success) {
        setIsNewUser(true); // Mark as new user when signing up
        try { sessionStorage.setItem('kumia_new_user', '1'); } catch { }
        console.log('Sign Up successful - isNewUser set to TRUE');
      } else {
        setError(result.message);
      }

      setLoading(false);
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

      if (result.success) {
        // Clear new user flag since this is a sign in (not sign up)
        setIsNewUser(false);
        try { sessionStorage.removeItem('kumia_new_user'); } catch { }
        console.log('Sign In successful - isNewUser set to FALSE');
      } else {
        setError(result.message);
      }

      setLoading(false);
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

      if (result.success) {
        // Set new user flag if this is a new Google user, otherwise clear it
        if (result.isNewUser) {
          setIsNewUser(true);
          try { sessionStorage.setItem('kumia_new_user', '1'); } catch { }
          console.log('Google Sign In - NEW USER - isNewUser set to TRUE');
        } else {
          setIsNewUser(false);
          try { sessionStorage.removeItem('kumia_new_user'); } catch { }
          console.log('Google Sign In - EXISTING USER - isNewUser set to FALSE');
        }
      } else {
        setError(result.message);
      }

      setLoading(false);
      return result;
    } catch (err) {
      setError('Error inesperado al iniciar sesión con Google');
      setLoading(false);
      return { success: false, message: 'Error inesperado al iniciar sesión con Google' };
    }
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

  const clearError = () => {
    setError(null);
  };

  const clearNewUserFlag = () => {
    setIsNewUser(false);
    try { sessionStorage.removeItem('kumia_new_user'); } catch { }
    console.log('clearNewUserFlag called - isNewUser set to FALSE');
  };

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);

      // If user logs out, reset the new user flag
      if (!user) {
        setIsNewUser(false);
        try { sessionStorage.removeItem('kumia_new_user'); } catch { }
      }
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading,
    error,
    isNewUser,
    signUp,
    signIn,
    signInWithGoogle,
    logout,
    clearError,
    clearNewUserFlag
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
