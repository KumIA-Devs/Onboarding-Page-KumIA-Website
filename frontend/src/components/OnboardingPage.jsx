import React, { useState, useRef, useEffect } from 'react';
import { ChevronRight, ChevronLeft, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/authService';
import Button from './ui/Button';
import Input from './ui/Input';
import { Card } from './ui/card';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Slider } from './ui/slider';
import OptimizedImage from './ui/OptimizedImage';
import TopBar from './TopBar';
import ProgressSteps from './ProgressSteps';
import CompletionPage from './CompletionPage';
import { onboardingData } from '../data/mock';
import { useSpecialtyImagesPreloader } from '../hooks/useImagePreloader';
import { useSimpleOnboardingState } from '../hooks/useSimpleOnboardingState';

const OnboardingPage = () => {
  const navigate = useNavigate();
  const { logout, currentUser, isNewUser, completeOnboarding } = useAuth();
  const hasNavigated = useRef(false); // Prevent multiple navigations
  const timeoutRef = useRef(null); // Store timeout ID

  // Cleanup navigation timeout on unmount
  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Verify user should be here - but allow for state update delays
  React.useEffect(() => {
    if (!isNewUser && currentUser) {
      // Small delay to avoid race conditions with state updates
      const checkTimeout = setTimeout(() => {
        console.log('OnboardingPage: User should not be here, redirecting to coming-soon');
        navigate('/coming-soon', { replace: true });
      }, 100);

      return () => clearTimeout(checkTimeout);
    }
  }, [isNewUser, currentUser, navigate]);

  const [isCompletingOnboarding, setIsCompletingOnboarding] = useState(false);

  // Estado del onboarding con persistencia silenciosa
  const {
    currentLanguage,
    setCurrentLanguage,
    currentQuestion,
    answers,
    isCompleted,
    isRestored,
    isLoadingProgress,
    handleAnswer,
    handleNext: handleNextQuestion,
    handlePrevious: handlePreviousQuestion,
    completeOnboarding: completeOnboardingState,
    getProgressSummary
  } = useSimpleOnboardingState('es');

  const translations = onboardingData.translations[currentLanguage];
  const questions = onboardingData.questions;
  const totalQuestions = questions.length;

  // Preload specialty images for faster loading (silent background process)
  const { isImagePreloaded } = useSpecialtyImagesPreloader(
    currentQuestion,
    questions
  );


  // Calculate current step based on question
  const questionsPerStep = Math.ceil(totalQuestions / 5);
  const calculatedStep = Math.floor(currentQuestion / questionsPerStep);

  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      handleNextQuestion();
    } else {
      // Complete onboarding
      completeOnboardingState();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      handlePreviousQuestion();
    }
  };

  // Validate if current question is answered
  const isCurrentQuestionAnswered = () => {
    const currentQuestionObj = questions[currentQuestion];
    const currentQuestionId = currentQuestionObj.id;
    const answer = answers[currentQuestionId];

    if (currentQuestionObj.optional) return true;
    if (answer === undefined || answer === null) return false;
    if (typeof answer === 'string' && answer.trim() === '') return false;
    if (Array.isArray(answer) && answer.length === 0) return false;
    if (currentQuestionObj.type === 'number' && (answer === 0 || answer === '')) return false;
    if (currentQuestionObj.type === 'slider' && answer === currentQuestionObj.min) return true;
    if (currentQuestionObj.type === 'location') {
      return answer && answer.country && answer.city;
    }
    return true;
  };

  const renderQuestion = () => {
    const question = questions[currentQuestion];
    const questionText = question.text[currentLanguage];
    const questionId = question.id;

    switch (question.type) {
      case 'text':
        return (
          <div className="space-y-6">
            <Label className="text-xl font-medium text-white">{questionText}</Label>
            <Input
              value={answers[questionId] || ''}
              onChange={(e) => handleAnswer(questionId, e.target.value)}
              className="bg-white/10 border-white/30 text-white placeholder:text-white/60 h-12 text-lg"
              placeholder={question.placeholder?.[currentLanguage] || ''}
            />
          </div>
        );
      case 'textarea':
        return (
          <div className="space-y-6">
            <Label className="text-xl font-medium text-white">{questionText}</Label>
            <Textarea
              value={answers[questionId] || ''}
              onChange={(e) => handleAnswer(questionId, e.target.value)}
              className="bg-white/10 border-white/30 text-white placeholder:text-white/60 min-h-[120px]"
              placeholder={question.placeholder?.[currentLanguage] || ''}
            />
          </div>
        );
      case 'number':
        return (
          <div className="space-y-6">
            <Label className="text-xl font-medium text-white">{questionText}</Label>
            <Input
              type="number"
              value={answers[questionId] ?? ''}
              onChange={(e) => handleAnswer(questionId, e.target.value === '' ? '' : Number(e.target.value))}
              className="bg-white/10 border-white/30 text-white placeholder:text-white/60 h-12 text-lg"
              placeholder={question.placeholder?.[currentLanguage] || ''}
            />
          </div>
        );
      case 'radio':
        return (
          <div className="space-y-6">
            <Label className="text-xl font-medium text-white">{questionText}</Label>
            <RadioGroup
              value={answers[questionId] || ''}
              onValueChange={(val) => handleAnswer(questionId, val)}
              className="grid grid-cols-2 gap-3"
            >
              {question.options?.map((opt) => (
                <Label key={opt.value} className="flex items-center space-x-3 bg-white/10 border border-white/20 p-3 rounded-lg text-white">
                  <RadioGroupItem value={opt.value} />
                  <span>{opt.label[currentLanguage]}</span>
                </Label>
              ))}
            </RadioGroup>
            {question.options?.find((o) => o.value === answers[questionId] && o.showInput) && (
              <Input
                value={answers[`${questionId}_other`] || ''}
                onChange={(e) => handleAnswer(`${questionId}_other`, e.target.value)}
                className="bg-white/10 border-white/30 text-white placeholder:text-white/60 h-12 text-lg"
                placeholder={onboardingData.translations[currentLanguage].specify}
              />
            )}
          </div>
        );
      case 'card-select':
        const isMulti = question.multiple || ['food_specialty', 'review_platforms'].includes(questionId);
        const currentValue = answers[questionId];
        const isSelected = (val) => Array.isArray(currentValue) ? currentValue.includes(val) : currentValue === val;
        const toggleValue = (val) => {
          if (isMulti) {
            const arr = Array.isArray(currentValue) ? [...currentValue] : [];
            const idx = arr.indexOf(val);
            if (idx >= 0) arr.splice(idx, 1); else arr.push(val);
            handleAnswer(questionId, arr);
          } else {
            handleAnswer(questionId, val);
          }
        };
        return (
          <div className="space-y-6">
            <Label className="text-xl font-medium text-white">{questionText}</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {question.options?.map((opt) => {
                const selected = isSelected(opt.value);
                return (
                  <button
                    type="button"
                    key={opt.value}
                    onClick={() => toggleValue(opt.value)}
                    className={`text-left bg-white/10 border ${selected ? 'border-[#9ACD32] shadow-lg' : 'border-white/20'} rounded-xl p-4 hover:bg-white/20 transition`}
                  >
                    {opt.image && (
                      <OptimizedImage
                        src={opt.image}
                        alt={opt.label[currentLanguage]}
                        className="w-full h-24 object-cover rounded-lg mb-3"
                        lazy={!isImagePreloaded(opt.image)}
                        placeholder={true}
                      />
                    )}
                    {opt.logo && (
                      <OptimizedImage
                        src={opt.logo}
                        alt={opt.label[currentLanguage]}
                        className="h-24 mb-3"
                        lazy={false}
                        placeholder={true}
                      />
                    )}
                    <p className="text-white font-semibold">{opt.label[currentLanguage]}</p>
                  </button>
                );
              })}
            </div>
          </div>
        );
      case 'location':
        const labelsLoc = {
          country: { es: 'País', en: 'Country', pt: 'País' }[currentLanguage],
          selectCountry: { es: 'Selecciona un país', en: 'Select a country', pt: 'Selecione um país' }[currentLanguage],
          city: { es: 'Ciudad', en: 'City', pt: 'Cidade' }[currentLanguage],
          cityPlaceholder: { es: 'Ciudad', en: 'City', pt: 'Cidade' }[currentLanguage],
        };
        const SOUTH_AMERICA = ['AR', 'BO', 'BR', 'CL', 'CO', 'EC', 'GY', 'PE', 'PY', 'UY', 'VE'];
        const countryOptions = (onboardingData.countries[currentLanguage] || []).filter((c) => SOUTH_AMERICA.includes(c.value));
        return (
          <div className="space-y-6">
            <Label className="text-xl font-medium text-white">{questionText}</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-white/80 mb-2 block">{labelsLoc.country}</Label>
                <select
                  value={answers[questionId]?.country || ''}
                  onChange={(e) => handleAnswer(questionId, { ...(answers[questionId] || {}), country: e.target.value })}
                  className="w-full h-12 bg-white/10 border border-white/30 text-white text-lg rounded-md px-3"
                >
                  <option value="" disabled>{labelsLoc.selectCountry}</option>
                  {countryOptions.map((c) => (
                    <option key={c.value} value={c.value} className="bg-gray-900 text-white">{c.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label className="text-white/80 mb-2 block">{labelsLoc.city}</Label>
                <Input
                  value={answers[questionId]?.city || ''}
                  onChange={(e) => handleAnswer(questionId, { ...(answers[questionId] || {}), city: e.target.value })}
                  className="bg-white/10 border-white/30 text-white placeholder:text-white/60 h-12 text-lg"
                  placeholder={labelsLoc.cityPlaceholder}
                />
              </div>
            </div>
          </div>
        );
      case 'slider':
        return (
          <div className="space-y-6">
            <Label className="text-xl font-medium text-white">{questionText}</Label>
            <div className="px-2">
              <Slider
                value={[Number(answers[questionId] ?? question.min)]}
                onValueChange={(val) => handleAnswer(questionId, val[0])}
                min={question.min}
                max={question.max}
                step={question.step || 1}
              />
              <div className="mt-3 text-white/90">${Number(answers[questionId] ?? question.min)}</div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Use the completeOnboarding function from AuthContext to properly sync state
  const handleOnboardingComplete = async () => {
    // Prevent multiple executions
    if (hasNavigated.current) return;
    hasNavigated.current = true;

    setIsCompletingOnboarding(true);

    try {
      if (!currentUser?.uid) {
        console.error('No current user UID');
        navigate('/coming-soon', { replace: true });
        return;
      }

      console.log('Completing onboarding for user:', currentUser.uid);

      // First update with onboarding answers
      await authService.updateUserProfile(currentUser.uid, {
        onboardingAnswers: answers,
        onboardingCompletedAt: new Date().toISOString()
      });

      // Then use the context function to complete onboarding and update local state
      const result = await completeOnboarding();

      if (result.success) {
        console.log('Onboarding completed successfully');

        // Clear the onboarding progress (important!)
        await completeOnboardingState();

        // Wait a moment for state to propagate, then navigate
        timeoutRef.current = setTimeout(() => {
          console.log('Navigating to coming-soon page...');
          navigate('/coming-soon', { replace: true });
        }, 800);
      } else {
        throw new Error(result.error || 'Failed to complete onboarding');
      }

    } catch (error) {
      console.error('Error completing onboarding:', error);
      // Clear progress anyway and navigate to prevent user from being stuck
      await completeOnboardingState();
      navigate('/coming-soon', { replace: true });
    }
  };

  // Mostrar loading mientras se carga el progreso
  if (isLoadingProgress) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <img
            src="https://customer-assets.emergentagent.com/job_01c2df2f-712f-43dc-b607-91e2afc70fe8/artifacts/wbisp6gb_Logo_Oficial_Solo_Verde-NoBackground.png"
            alt="KumIA Logo"
            className="w-24 h-24 mx-auto mb-8 object-contain animate-pulse"
          />
          <div className="text-white/80 text-lg">Cargando...</div>
          <div className="mt-4 w-32 h-1 bg-white/20 rounded-full mx-auto">
            <div className="h-1 bg-[#9ACD32] rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <CompletionPage
        currentLanguage={currentLanguage}
        onComplete={handleOnboardingComplete}
        isCompleting={isCompletingOnboarding}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 relative">

      {/* Logout Button */}
      <button
        onClick={() => logout().then(() => navigate('/login'))}
        className="absolute top-6 right-6 z-50 flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl transition-colors duration-300 shadow-lg"
      >
        <LogOut className="w-4 h-4" />
        <span className="hidden sm:inline">Cerrar Sesión</span>
      </button>

      <TopBar
        currentLanguage={currentLanguage}
        setCurrentLanguage={setCurrentLanguage}
        translations={translations}
      />

      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-80px)]">
        {/* Left Side - Progress */}
        <div className="lg:w-1/2 p-8 flex flex-col justify-center items-center bg-black/40">
          <div className="max-w-md w-full">
            <img
              src="https://customer-assets.emergentagent.com/job_01c2df2f-712f-43dc-b607-91e2afc70fe8/artifacts/wbisp6gb_Logo_Oficial_Solo_Verde-NoBackground.png"
              alt="KumIA Logo"
              className="w-24 h-24 mx-auto mb-8 object-contain"
            />
            <ProgressSteps
              currentStep={calculatedStep}
              translations={translations}
            />
          </div>
        </div>

        {/* Right Side - Questions */}
        <div className="lg:w-1/2 p-8 flex flex-col justify-center">
          <Card className="bg-white/10 border-white/20 text-white p-6">
            {renderQuestion()}

            {/* Navigation Buttons */}
            <div className="mt-8 flex justify-between">
              <Button
                variant="secondary"
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                {translations.previous}
              </Button>

              <Button
                onClick={handleNext}
                disabled={!isCurrentQuestionAnswered()}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {currentQuestion === totalQuestions - 1 ? translations.finish : translations.continue}
                {currentQuestion !== totalQuestions - 1 && <ChevronRight className="w-4 h-4 ml-2" />}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;