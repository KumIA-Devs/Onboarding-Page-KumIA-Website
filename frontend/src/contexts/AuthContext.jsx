import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/authService';
import { useNavigate } from 'react-router-dom';

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

  const isEmailVerified = Boolean(currentUser?.emailVerified);

  // Auth functions
  const signUp = async (email, password, displayName) => {
    setError(null);
    setLoading(true);

    try {
      const result = await authService.signUpWithEmailAndPassword(email, password, displayName);

      if (result.success) {
        setIsNewUser(true);
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

      let onboardingComplete = false;
      if (result.success) {
        const refreshed = await authService.refreshCurrentUser();
        if (refreshed) setCurrentUser({ ...refreshed });
        // Ensure profile exists and read onboardingComplete
        const profile = await authService.ensureUserProfile(result.user);
        onboardingComplete = Boolean(profile?.onboardingComplete);
        setIsNewUser(!onboardingComplete);
        if (!onboardingComplete) {
          try { sessionStorage.setItem('kumia_new_user', '1'); } catch { }
        } else {
          try { sessionStorage.removeItem('kumia_new_user'); } catch { }
        }
      } else {
        setError(result.message);
      }

      setLoading(false);
      return { ...result, onboardingComplete };
    } catch (err) {
      setError('Error inesperado al iniciar sesión');
      setLoading(false);
      return { success: false, message: 'Error inesperado al iniciar sesión' };
    }
  };

  // --- COMIENZO DE LA SECCIÓN MODIFICADA ---
  // Se ha reescrito esta función para que siga la misma lógica que `signIn`,
  // asegurando que `onboardingComplete` de Firestore sea la única fuente de verdad.
  const signInWithGoogle = async () => {
    setError(null);
    setLoading(true);

    try {
      const result = await authService.signInWithGoogle();

      let onboardingComplete = false;
      if (result.success) {
        const refreshed = await authService.refreshCurrentUser();
        if (refreshed) setCurrentUser({ ...refreshed });

        // CAMBIO CLAVE: Unificamos la lógica consultando el perfil de Firestore.
        const profile = await authService.ensureUserProfile(result.user);
        onboardingComplete = Boolean(profile?.onboardingComplete);

        // Actualizamos el estado isNewUser basado en si el onboarding está completo.
        setIsNewUser(!onboardingComplete);
        console.log(`AuthContext Google: Onboarding Complete is ${onboardingComplete}, setting isNewUser to ${!onboardingComplete}`);

        if (!onboardingComplete) {
          try { sessionStorage.setItem('kumia_new_user', '1'); } catch {}
        } else {
          try { sessionStorage.removeItem('kumia_new_user'); } catch {}
        }
      } else {
        setError(result.message);
      }

      setLoading(false);
      // Devolvemos el estado del onboarding para que la UI pueda redirigir correctamente.
      return { ...result, onboardingComplete };

    } catch (err) {
      setError('Error inesperado al iniciar sesión con Google');
      setLoading(false);
      return { success: false, message: 'Error inesperado al iniciar sesión con Google' };
    }
  };
  // --- FIN DE LA SECCIÓN MODIFICADA ---

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

  const clearError = () => {
    setError(null);
  };

  const clearNewUserFlag = () => {
    setIsNewUser(false);
    try { sessionStorage.removeItem('kumia_new_user'); } catch { }
    console.log('clearNewUserFlag called - isNewUser set to FALSE');
  };

  const verifyAndContinue = async () => {
    const refreshed = await authService.refreshCurrentUser();
    if (refreshed) setCurrentUser({ ...refreshed });
    return Boolean(refreshed?.emailVerified);
  };

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);

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
    isEmailVerified,
    signUp,
    signIn,
    signInWithGoogle,
    resendVerificationEmail,
    verifyAndContinue,
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