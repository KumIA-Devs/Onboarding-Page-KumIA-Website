import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  sendEmailVerification,
  reload,
} from "firebase/auth";
import { auth } from "../config/firebase";
import app from "../config/firebase";
import { getFunctions, httpsCallable } from "firebase/functions";
import { getFirestore, doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});
googleProvider.addScope('email');
googleProvider.addScope('profile');

const functions = getFunctions(app, 'southamerica-east1');
const db = getFirestore(app);

// Helper to create profile if missing
async function ensureUserProfile(user) {
  if (!user) return null;
  
  const ref = doc(db, 'users', user.uid);
  const snap = await getDoc(ref);
  
  if (!snap.exists()) {
    const provider = (user.providerData && user.providerData[0]?.providerId) || 'password';
    const profile = {
      name: user.displayName || '',
      email: user.email || '',
      status: 'active',
      onboardingComplete: false, // Always false for new users
      authentication: {
        provider,
        uidAuth: user.uid,
      },
      wallet: { stars: 0 },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    await setDoc(ref, profile);
    return profile;
  }
  
  return snap.data();
}

export const authService = {
  signUpWithEmailAndPassword: async (email, password, displayName) => {
    try {
      const createNewUserWithProfile = httpsCallable(functions, 'auth-endpoints-createNewUserWithProfile');
      await createNewUserWithProfile({ email, password, displayName });
      
      const signInRes = await signInWithEmailAndPassword(auth, email, password);
      
      try { 
        await sendEmailVerification(signInRes.user); 
      } catch (e) { 
        console.warn('sendEmailVerification failed', e); 
      }
      
      return {
        success: true,
        user: signInRes.user,
        message: 'Cuenta creada exitosamente, verifica tu correo para continuar'
      };
    } catch (error) {
      return { success: false, error: error.code, message: getErrorMessage(error.code) };
    }
  },

  signInWithEmailAndPassword: async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      // Ensure profile exists
      await ensureUserProfile(result.user);
      
      return { success: true, user: result.user, message: 'Inicio de sesión exitoso' };
    } catch (error) {
      return { success: false, error: error.code, message: getErrorMessage(error.code) };
    }
  },

  signInWithGoogle: async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      
      // Ensure profile exists
      await ensureUserProfile(result.user);
      
      return {
        success: true,
        user: result.user,
        message: 'Autenticación con Google exitosa'
      };
    } catch (error) {
      console.error('Google Auth Error Details:', {
        code: error.code,
        message: error.message,
      });
      return {
        success: false,
        error: error.code,
        message: getErrorMessage(error.code)
      };
    }
  },

  signOut: async () => {
    try {
      await signOut(auth);
      return { success: true, message: 'Sesión cerrada exitosamente' };
    } catch (error) {
      return { success: false, error: error.code, message: 'Error al cerrar sesión' };
    }
  },

  getCurrentUser: () => {
    return auth.currentUser;
  },

  onAuthStateChanged: (callback) => {
    return onAuthStateChanged(auth, callback);
  },

  sendVerification: async () => {
    try {
      if (!auth.currentUser) return { success: false, message: 'No hay usuario autenticado' };
      await sendEmailVerification(auth.currentUser);
      return { success: true, message: 'Correo de verificación enviado' };
    } catch (error) {
      return { success: false, error: error.code, message: 'No se pudo enviar el correo' };
    }
  },

  refreshCurrentUser: async () => {
    try {
      if (!auth.currentUser) return null;
      await reload(auth.currentUser);
      return auth.currentUser;
    } catch {
      return auth.currentUser ?? null;
    }
  },

  getUserProfile: async (uid) => {
    try {
      const ref = doc(db, 'users', uid);
      const snap = await getDoc(ref);
      return snap.exists() ? snap.data() : null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  },

  updateUserProfile: async (uid, updates) => {
    try {
      const userRef = doc(db, 'users', uid);
      await setDoc(userRef, {
        ...updates,
        updatedAt: serverTimestamp()
      }, { merge: true });
      return { success: true };
    } catch (error) {
      console.error('Error updating user profile:', error);
      return { success: false, error: error.message };
    }
  }
};

const getErrorMessage = (errorCode) => {
  switch (errorCode) {
    case 'auth/user-disabled': return 'Esta cuenta ha sido deshabilitada.';
    case 'auth/user-not-found': return 'No se encontró una cuenta con este email.';
    case 'auth/wrong-password': return 'Contraseña incorrecta.';
    case 'auth/email-already-in-use': return 'Ya existe una cuenta con este email.';
    case 'auth/weak-password': return 'La contraseña debe tener al menos 6 caracteres.';
    case 'auth/invalid-email': return 'El formato del email no es válido.';
    case 'auth/invalid-credential': return 'Las credenciales proporcionadas no son válidas.';
    case 'auth/network-request-failed': return 'Error de conexión. Verifica tu internet.';
    case 'auth/too-many-requests': return 'Demasiados intentos fallidos. Intenta más tarde.';
    case 'auth/popup-closed-by-user': return 'Ventana de autenticación cerrada por el usuario.';
    case 'auth/cancelled-popup-request': return 'Solicitud de autenticación cancelada.';
    default: return 'Ha ocurrido un error inesperado. Intenta nuevamente.';
  }
};