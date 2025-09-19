import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile
} from "firebase/auth";
import { auth } from "../config/firebase";

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Add additional scopes if needed
googleProvider.addScope('email');
googleProvider.addScope('profile');

// Auth Service
export const authService = {
  // Sign up with email and password
  signUpWithEmailAndPassword: async (email, password, displayName) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);

      // Update user profile with display name
      if (displayName) {
        await updateProfile(result.user, {
          displayName: displayName
        });
      }

      return {
        success: true,
        user: result.user,
        message: 'Cuenta creada exitosamente'
      };
    } catch (error) {
      return {
        success: false,
        error: error.code,
        message: getErrorMessage(error.code)
      };
    }
  },

  // Sign in with email and password
  signInWithEmailAndPassword: async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return {
        success: true,
        user: result.user,
        message: 'Inicio de sesión exitoso'
      };
    } catch (error) {
      return {
        success: false,
        error: error.code,
        message: getErrorMessage(error.code)
      };
    }
  },

  // Sign in with Google
  signInWithGoogle: async () => {
    try {
      console.log('Iniciando Google Auth...');
      console.log('Auth Domain:', auth.app.options.authDomain);
      console.log('Project ID:', auth.app.options.projectId);

      const result = await signInWithPopup(auth, googleProvider);

      // Debug logging
      console.log('Google Auth Result:', {
        additionalUserInfo: result.additionalUserInfo,
        isNewUser: result.additionalUserInfo?.isNewUser,
        user: result.user.email
      });

      // Check if this is a new user
      const isNewUser = result.additionalUserInfo?.isNewUser || false;

      return {
        success: true,
        user: result.user,
        isNewUser: isNewUser,
        message: isNewUser
          ? 'Cuenta creada exitosamente con Google'
          : 'Inicio de sesión con Google exitoso'
      };
    } catch (error) {
      console.error('Google Auth Error Details:', {
        code: error.code,
        message: error.message,
        customData: error.customData,
        stack: error.stack
      });

      return {
        success: false,
        error: error.code,
        message: getErrorMessage(error.code)
      };
    }
  },

  // Sign out
  signOut: async () => {
    try {
      await signOut(auth);
      return {
        success: true,
        message: 'Sesión cerrada exitosamente'
      };
    } catch (error) {
      return {
        success: false,
        error: error.code,
        message: 'Error al cerrar sesión'
      };
    }
  },

  // Get current user
  getCurrentUser: () => {
    return auth.currentUser;
  },

  // Listen to auth state changes
  onAuthStateChanged: (callback) => {
    return onAuthStateChanged(auth, callback);
  }
};

// Helper function to get user-friendly error messages
const getErrorMessage = (errorCode) => {
  switch (errorCode) {
    case 'auth/user-disabled':
      return 'Esta cuenta ha sido deshabilitada.';
    case 'auth/user-not-found':
      return 'No se encontró una cuenta con este email.';
    case 'auth/wrong-password':
      return 'Contraseña incorrecta.';
    case 'auth/email-already-in-use':
      return 'Ya existe una cuenta con este email.';
    case 'auth/weak-password':
      return 'La contraseña debe tener al menos 6 caracteres.';
    case 'auth/invalid-email':
      return 'El formato del email no es válido.';
    case 'auth/invalid-credential':
      return 'Las credenciales proporcionadas no son válidas.';
    case 'auth/network-request-failed':
      return 'Error de conexión. Verifica tu internet.';
    case 'auth/too-many-requests':
      return 'Demasiados intentos fallidos. Intenta más tarde.';
    case 'auth/popup-closed-by-user':
      return 'Ventana de autenticación cerrada por el usuario.';
    case 'auth/cancelled-popup-request':
      return 'Solicitud de autenticación cancelada.';
    default:
      return 'Ha ocurrido un error inesperado. Intenta nuevamente.';
  }
};
