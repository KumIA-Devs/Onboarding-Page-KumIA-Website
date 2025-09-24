import { useState, useEffect, useCallback } from 'react';

const ONBOARDING_PROGRESS_KEY = 'kumia_onboarding_progress';

export const useSimpleOnboardingState = (initialLanguage = 'es') => {
  const [currentLanguage, setCurrentLanguage] = useState(initialLanguage);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [isRestored, setIsRestored] = useState(false);
  const [isLoadingProgress, setIsLoadingProgress] = useState(true);
  // Removed isSaving state since we don't show visual indicators

  // Función para cargar desde localStorage
  const loadFromLocalStorage = useCallback(() => {
    try {
      const saved = localStorage.getItem(ONBOARDING_PROGRESS_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      return null;
    }
  }, []);

  // Función para guardar en localStorage
  const saveToLocalStorage = useCallback((data) => {
    try {
      localStorage.setItem(ONBOARDING_PROGRESS_KEY, JSON.stringify(data));
      console.log('✅ Progress saved to localStorage');
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, []);

  // Cargar progreso al inicializar
  useEffect(() => {
    const loadProgress = () => {
      setIsLoadingProgress(true);

      try {
        const savedProgress = loadFromLocalStorage();

        if (savedProgress && !savedProgress.completed) {
          setCurrentLanguage(savedProgress.currentLanguage || initialLanguage);
          setCurrentQuestion(savedProgress.currentQuestion || 0);
          setAnswers(savedProgress.answers || {});
          setIsCompleted(savedProgress.isCompleted || false);

          console.log(`🔄 Progress restored: Question ${savedProgress.currentQuestion + 1}`);
        }
      } catch (error) {
        console.error('Error loading progress:', error);
      } finally {
        setIsLoadingProgress(false);
        setIsRestored(true);
      }
    };

    // Pequeño delay para simular carga
    setTimeout(loadProgress, 100);
  }, [loadFromLocalStorage, initialLanguage]);

  // Auto-guardar cuando cambian los estados
  useEffect(() => {
    if (!isRestored) return;

    const progressData = {
      currentLanguage,
      currentQuestion,
      answers,
      isCompleted,
      lastUpdated: new Date().toISOString()
    };

    if (currentQuestion > 0 || Object.keys(answers).length > 0) {
      // Debounce de 500ms para evitar demasiadas escrituras
      const timer = setTimeout(() => {
        saveToLocalStorage(progressData);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [currentLanguage, currentQuestion, answers, isCompleted, isRestored, saveToLocalStorage]);

  // Funciones de navegación
  const handleAnswer = useCallback((questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentQuestion(prev => prev + 1);
  }, []);

  const handlePrevious = useCallback(() => {
    setCurrentQuestion(prev => Math.max(0, prev - 1));
  }, []);

  const goToQuestion = useCallback((questionIndex) => {
    setCurrentQuestion(Math.max(0, questionIndex));
  }, []);

  const completeOnboarding = useCallback(() => {
    setIsCompleted(true);
    // Limpiar localStorage cuando se completa
    try {
      localStorage.removeItem(ONBOARDING_PROGRESS_KEY);
      console.log('✅ Progress cleared after completion');
    } catch (error) {
      console.error('Error clearing progress:', error);
    }
  }, []);

  const resetOnboarding = useCallback(() => {
    setCurrentLanguage(initialLanguage);
    setCurrentQuestion(0);
    setAnswers({});
    setIsCompleted(false);
    try {
      localStorage.removeItem(ONBOARDING_PROGRESS_KEY);
      console.log('🔄 Onboarding reset');
    } catch (error) {
      console.error('Error resetting:', error);
    }
  }, [initialLanguage]);

  const getProgressPercentage = useCallback((totalQuestions) => {
    if (!totalQuestions) return 0;
    return Math.round(((currentQuestion + 1) / totalQuestions) * 100);
  }, [currentQuestion]);

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

export default useSimpleOnboardingState;
