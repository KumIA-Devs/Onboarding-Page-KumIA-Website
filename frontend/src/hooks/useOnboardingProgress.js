import { useState, useEffect, useRef, useCallback } from 'react';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';

const ONBOARDING_PROGRESS_KEY = 'kumia_onboarding_progress';
const AUTO_SAVE_DELAY = 1000; // 1 segundo después del último cambio

export const useOnboardingProgress = () => {
  const { currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const saveTimeoutRef = useRef(null);
  const lastSavedRef = useRef(null);

  // Función para obtener la clave única del usuario
  const getUserProgressKey = () => {
    return currentUser?.uid ? `${ONBOARDING_PROGRESS_KEY}_${currentUser.uid}` : ONBOARDING_PROGRESS_KEY;
  };

  // Cargar progreso desde localStorage (instantáneo)
  const loadProgressFromLocal = () => {
    try {
      const saved = localStorage.getItem(getUserProgressKey());
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error('Error loading progress from localStorage:', error);
      return null;
    }
  };

  // Guardar progreso en localStorage
  const saveProgressToLocal = (progress) => {
    try {
      localStorage.setItem(getUserProgressKey(), JSON.stringify(progress));
    } catch (error) {
      console.error('Error saving progress to localStorage:', error);
    }
  };

  // Cargar progreso desde Firebase
  const loadProgressFromFirebase = async () => {
    if (!currentUser?.uid) return null;

    try {
      const docRef = doc(db, 'onboardingProgress', currentUser.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data();
      }
      return null;
    } catch (error) {
      console.error('Error loading progress from Firebase:', error);
      return null;
    }
  };

  // Guardar progreso en Firebase
  const saveProgressToFirebase = async (progress) => {
    if (!currentUser?.uid) return;

    try {
      const docRef = doc(db, 'onboardingProgress', currentUser.uid);
      const progressData = {
        ...progress,
        userId: currentUser.uid,
        lastUpdated: new Date().toISOString(),
        userEmail: currentUser.email
      };

      await setDoc(docRef, progressData, { merge: true });
      console.log('✅ Onboarding progress saved to Firebase');
    } catch (error) {
      console.error('Error saving progress to Firebase:', error);
    }
  };

  // Limpiar progreso (cuando se completa el onboarding)
  const clearProgress = async () => {
    try {
      // Limpiar localStorage
      localStorage.removeItem(getUserProgressKey());

      // Limpiar Firebase
      if (currentUser?.uid) {
        const docRef = doc(db, 'onboardingProgress', currentUser.uid);
        await setDoc(docRef, {
          completed: true,
          completedAt: new Date().toISOString(),
          userId: currentUser.uid
        });
      }

      console.log('✅ Onboarding progress cleared');
    } catch (error) {
      console.error('Error clearing progress:', error);
    }
  };

  // Cargar progreso inicial
  const loadInitialProgress = useCallback(async () => {
    setIsLoading(true);

    try {
      // 1. Primero cargar desde localStorage (instantáneo)
      let localProgress = loadProgressFromLocal();

      // 2. Solo intentar Firebase si tenemos usuario
      let firebaseProgress = null;
      if (currentUser?.uid) {
        try {
          firebaseProgress = await loadProgressFromFirebase();
        } catch (firebaseError) {
          console.warn('Firebase error, using localStorage only:', firebaseError);
        }
      }

      // 3. Usar el más reciente o combinar
      let finalProgress = null;

      if (firebaseProgress && localProgress) {
        // Comparar timestamps y usar el más reciente
        const firebaseTime = new Date(firebaseProgress.lastUpdated || 0);
        const localTime = new Date(localProgress.lastUpdated || 0);

        finalProgress = firebaseTime > localTime ? firebaseProgress : localProgress;

        // Sync el más reciente a ambos lugares
        try {
          if (firebaseTime > localTime) {
            saveProgressToLocal(firebaseProgress);
          } else if (localTime > firebaseTime) {
            await saveProgressToFirebase(localProgress);
          }
        } catch (syncError) {
          console.warn('Sync error:', syncError);
        }
      } else {
        finalProgress = firebaseProgress || localProgress;
      }

      return finalProgress;
    } catch (error) {
      console.error('Error loading initial progress:', error);
      return loadProgressFromLocal(); // Fallback a localStorage
    } finally {
      setIsLoading(false);
    }
  }, [currentUser?.uid]); // Solo depende del UID del usuario

  // Guardar progreso con debounce
  const saveProgress = (progress) => {
    // Guardar inmediatamente en localStorage
    saveProgressToLocal(progress);

    // Debounce para Firebase
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    const progressString = JSON.stringify(progress);
    if (lastSavedRef.current === progressString) {
      return; // No ha cambiado, no guardar
    }

    setIsSaving(true);
    saveTimeoutRef.current = setTimeout(async () => {
      await saveProgressToFirebase(progress);
      lastSavedRef.current = progressString;
      setIsSaving(false);
    }, AUTO_SAVE_DELAY);
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return {
    loadInitialProgress,
    saveProgress,
    clearProgress,
    isLoading,
    isSaving
  };
};

export default useOnboardingProgress;
