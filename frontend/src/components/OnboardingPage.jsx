import React, { useState, useEffect } from 'react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import TopBar from './TopBar';
import ProgressSteps from './ProgressSteps';
import CompletionPage from './CompletionPage';
import { onboardingData } from '../data/mock';

const OnboardingPage = () => {
  const navigate = useNavigate();
  const { logout, clearNewUserFlag, isNewUser, currentUser } = useAuth();

  console.log('OnboardingPage rendering - isNewUser:', isNewUser);

  // Check if user should be here (new user verification)
  const storageNewUser = (() => {
    try { return sessionStorage.getItem('kumia_new_user') === '1'; } catch { return false; }
  })();

  console.log('OnboardingPage - User verification:', {
    isNewUser,
    storageNewUser,
    shouldAllowAccess: isNewUser || storageNewUser
  });

  // If not a new user, redirect to coming-soon after a brief delay to avoid conflicts
  if (!isNewUser && !storageNewUser) {
    console.log('OnboardingPage - Not a new user, redirecting to coming-soon');
    setTimeout(() => navigate('/coming-soon', { replace: true }), 100);
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#9ACD32] border-t-transparent mx-auto mb-4"></div>
          <p className="text-white text-lg">Verificando acceso...</p>
        </div>
      </div>
    );
  }

  const [currentLanguage, setCurrentLanguage] = useState('es');
  const [currentStep, setCurrentStep] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);

  const translations = onboardingData.translations[currentLanguage];
  const questions = onboardingData.questions;
  const totalQuestions = questions.length;

  // Calculate current step based on question
  const questionsPerStep = Math.ceil(totalQuestions / 5);
  const calculatedStep = Math.floor(currentQuestion / questionsPerStep);

  const handleAnswer = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      // Last question - complete onboarding and redirect to coming soon
      clearNewUserFlag(); // Clear the new user flag
      setIsCompleted(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  // Validate if current question is answered
  const isCurrentQuestionAnswered = () => {
    const currentQuestionObj = questions[currentQuestion];
    const currentQuestionId = currentQuestionObj.id;
    const answer = answers[currentQuestionId];

    // If question is optional, always allow to continue
    if (currentQuestionObj.optional) return true;

    if (answer === undefined || answer === null) return false;
    if (typeof answer === 'string' && answer.trim() === '') return false;
    if (Array.isArray(answer) && answer.length === 0) return false;

    // For number questions, require value > 0
    if (currentQuestionObj.type === 'number' && (answer === 0 || answer === '')) return false;
    if (currentQuestionObj.type === 'slider' && answer === currentQuestionObj.min) return true; // Slider always has a value

    // For location type, check if all required fields are filled
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
        // Determine if this question supports multiple selections
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
                      <img src={opt.image} alt={opt.label[currentLanguage]} className="w-full h-24 object-cover rounded-lg mb-3" />
                    )}
                    {opt.logo && (
                      <img src={opt.logo} alt={opt.label[currentLanguage]} className="h-6 mb-3" />
                    )}
                    <p className="text-white font-semibold">{opt.label[currentLanguage]}</p>
                  </button>
                );
              })}
            </div>
            {question.options?.find((o) => (!isMulti && o.value === currentValue) || (isMulti && Array.isArray(currentValue) && currentValue.includes(o.value)) && o.showInput) && (
              <Input
                value={answers[`${questionId}_other`] || ''}
                onChange={(e) => handleAnswer(`${questionId}_other`, e.target.value)}
                className="bg-white/10 border-white/30 text-white placeholder:text-white/60 h-12 text-lg"
                placeholder={onboardingData.translations[currentLanguage].specify}
              />
            )}
          </div>
        );
      case 'location':
        const labelsLoc = {
          country: { es: 'País', en: 'Country', pt: 'País' }[currentLanguage],
          selectCountry: { es: 'Selecciona un país', en: 'Select a country', pt: 'Selecione um país' }[currentLanguage],
          city: { es: 'Ciudad', en: 'City', pt: 'Cidade' }[currentLanguage],
          cityPlaceholder: { es: 'Ciudad', en: 'City', pt: 'Cidade' }[currentLanguage],
        };
        const SOUTH_AMERICA2 = ['AR', 'BO', 'BR', 'CL', 'CO', 'EC', 'GY', 'PE', 'PY', 'UY', 'VE'];
        const countryOptions2 = (onboardingData.countries[currentLanguage] || []).filter((c) => SOUTH_AMERICA2.includes(c.value));
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
                  {countryOptions2.map((c) => (
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

  // Handle completion and redirect to coming soon page
  const handleOnboardingComplete = async () => {
    try {
      if (currentUser) {
        // Update onboardingComplete to true in Firestore
        await authService.updateUserProfile(currentUser.uid, { onboardingComplete: true });
        console.log('Onboarding marked as complete for user:', currentUser.uid);
      }
      navigate('/coming-soon');
    } catch (error) {
      console.error('Error updating onboarding completion:', error);
      // Still navigate even if the update fails
      navigate('/coming-soon');
    }
  };

  if (isCompleted) {
    return <CompletionPage currentLanguage={currentLanguage} onComplete={handleOnboardingComplete} />;
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