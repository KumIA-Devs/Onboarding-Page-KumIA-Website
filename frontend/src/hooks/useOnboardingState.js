import { useState, useEffect, useCallback } from 'react';
import { useOnboardingProgress } from './useOnboardingProgress';

export const useOnboardingState = (initialLanguage = 'es') => {
  const [currentLanguage, setCurrentLanguage] = useState(initialLanguage);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [isRestored, setIsRestored] = useState(false);

  const {
    loadInitialProgress,
    saveProgress,
    clearProgress,
    isLoading: isLoadingProgress,
    isSaving
  } = useOnboardingProgress();

  // Cargar progreso guardado al inicializar (solo una vez)
  useEffect(() => {
    let timeoutId;

    const restoreProgress = async () => {
      try {
        // Timeout de seguridad - máximo 5 segundos
        const timeoutPromise = new Promise((_, reject) => {
          timeoutId = setTimeout(() => reject(new Error('Timeout loading progress')), 5000);
        });

        const progressPromise = loadInitialProgress();

        const savedProgress = await Promise.race([progressPromise, timeoutPromise]);

        if (savedProgress && !savedProgress.completed) {
          setCurrentLanguage(savedProgress.currentLanguage || initialLanguage);
          setCurrentQuestion(savedProgress.currentQuestion || 0);
          setAnswers(savedProgress.answers || {});
          setIsCompleted(savedProgress.isCompleted || false);

          console.log(`🔄 Onboarding progress restored: Question ${savedProgress.currentQuestion + 1}, ${Object.keys(savedProgress.answers || {}).length} answers`);
        }
      } catch (error) {
        console.error('Error restoring progress:', error);
        // En caso de error, continuar sin progreso restaurado
      } finally {
        if (timeoutId) clearTimeout(timeoutId);
        setIsRestored(true);
      }
    };

    restoreProgress();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []); // Solo ejecutar una vez al montar

  // Auto-guardar cuando cambien los estados relevantes
  useEffect(() => {
    if (!isRestored) return; // No guardar durante la restauración inicial

    const progressData = {
      currentLanguage,
      currentQuestion,
      answers,
      isCompleted,
      lastUpdated: new Date().toISOString()
    };

    // Solo guardar si hay progreso real (no en el estado inicial vacío)
    if (currentQuestion > 0 || Object.keys(answers).length > 0) {
      saveProgress(progressData);
    }
  }, [currentLanguage, currentQuestion, answers, isCompleted, isRestored, saveProgress]);

  // Función para manejar respuestas con auto-guardado
  const handleAnswer = useCallback((questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  }, []);

  // Función para avanzar pregunta
  const handleNext = useCallback(() => {
    setCurrentQuestion(prev => prev + 1);
  }, []);

  // Función para retroceder pregunta
  const handlePrevious = useCallback(() => {
    setCurrentQuestion(prev => Math.max(0, prev - 1));
  }, []);

  // Función para saltar a una pregunta específica
  const goToQuestion = useCallback((questionIndex) => {
    setCurrentQuestion(Math.max(0, questionIndex));
  }, []);

  // Función para completar onboarding
  const completeOnboarding = useCallback(async () => {
    setIsCompleted(true);
    await clearProgress(); // Limpiar progreso guardado
    console.log('✅ Onboarding completed and progress cleared');
  }, [clearProgress]);

  // Función para reiniciar onboarding (útil para testing)
  const resetOnboarding = useCallback(async () => {
    setCurrentLanguage(initialLanguage);
    setCurrentQuestion(0);
    setAnswers({});
    setIsCompleted(false);
    await clearProgress();
    console.log('🔄 Onboarding reset');
  }, [initialLanguage, clearProgress]);

  // Función para obtener el progreso actual como porcentaje
  const getProgressPercentage = useCallback((totalQuestions) => {
    if (!totalQuestions) return 0;
    return Math.round(((currentQuestion + 1) / totalQuestions) * 100);
  }, [currentQuestion]);

  // Función para obtener resumen del progreso
  const getProgressSummary = useCallback((totalQuestions) => {
    return {
      currentQuestion: currentQuestion + 1,
      totalQuestions,
      answeredQuestions: Object.keys(answers).length,
      progressPercentage: getProgressPercentage(totalQuestions),
      isCompleted,
      hasProgress: currentQuestion > 0 || Object.keys(answers).length > 0
    };
  }, [currentQuestion, answers, isCompleted, getProgressPercentage]);

  return {
    // Estados
    currentLanguage,
    currentQuestion,
    answers,
    isCompleted,
    isRestored,
    isLoadingProgress,
    isSaving,

    // Setters
    setCurrentLanguage,
    setCurrentQuestion,
    setAnswers,
    setIsCompleted,

    // Funciones de navegación
    handleNext,
    handlePrevious,
    goToQuestion,

    // Funciones de datos
    handleAnswer,

    // Funciones de control
    completeOnboarding,
    resetOnboarding,

    // Funciones de información
    getProgressPercentage,
    getProgressSummary
  };
};

export default useOnboardingState;
