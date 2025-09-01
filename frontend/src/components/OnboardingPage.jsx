import React, { useState } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
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
  const [currentLanguage, setCurrentLanguage] = useState('es');
  const [currentStep, setCurrentStep] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isCompleted, setIsCompleted] = useState(false);

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
      // Last question - show completion page
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
              className="bg-white/10 border-white/30 text-white placeholder:text-white/60 min-h-[100px] text-lg"
              placeholder={question.placeholder?.[currentLanguage] || ''}
            />
          </div>
        );

      case 'location':
        const locationAnswer = answers[questionId] || {};
        const countries = onboardingData.countries[currentLanguage] || onboardingData.countries.es;
        const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
        
        return (
          <div className="space-y-6">
            <Label className="text-xl font-medium text-white">{questionText}</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Label className="text-sm text-white/80 mb-2 block">
                  {currentLanguage === 'es' ? 'País' : currentLanguage === 'en' ? 'Country' : 'País'}
                </Label>
                <button
                  onClick={() => setCountryDropdownOpen(!countryDropdownOpen)}
                  className="w-full bg-white/10 border border-white/30 text-white h-10 px-3 py-2 text-sm rounded-md flex items-center justify-between"
                >
                  <span>
                    {locationAnswer.country 
                      ? countries.find(c => c.value === locationAnswer.country)?.label 
                      : (currentLanguage === 'es' ? 'Selecciona país' : currentLanguage === 'en' ? 'Select country' : 'Selecione país')
                    }
                  </span>
                  <svg className="h-4 w-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {countryDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-black/90 border border-white/20 backdrop-blur-sm rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
                    {countries.map((country) => (
                      <button
                        key={country.value}
                        onClick={() => {
                          handleAnswer(questionId, {...locationAnswer, country: country.value});
                          setCountryDropdownOpen(false);
                        }}
                        className="w-full text-white hover:bg-white/10 px-3 py-2 text-left text-sm"
                      >
                        {country.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <Label className="text-sm text-white/80 mb-2 block">
                  {currentLanguage === 'es' ? 'Estado/Región' : currentLanguage === 'en' ? 'State/Region' : 'Estado/Região'}
                </Label>
                <Input
                  value={locationAnswer.state || ''}
                  onChange={(e) => handleAnswer(questionId, {...locationAnswer, state: e.target.value})}
                  className="bg-white/10 border-white/30 text-white placeholder:text-white/60"
                  placeholder={currentLanguage === 'es' ? 'Estado o región' : currentLanguage === 'en' ? 'State or region' : 'Estado ou região'}
                />
              </div>
              <div className="md:col-span-2">
                <Label className="text-sm text-white/80 mb-2 block">
                  {currentLanguage === 'es' ? 'Ciudad/Localidad' : currentLanguage === 'en' ? 'City/Locality' : 'Cidade/Localidade'}
                </Label>
                <Input
                  value={locationAnswer.city || ''}
                  onChange={(e) => handleAnswer(questionId, {...locationAnswer, city: e.target.value})}
                  className="bg-white/10 border-white/30 text-white placeholder:text-white/60"
                  placeholder={currentLanguage === 'es' ? 'Ciudad o localidad' : currentLanguage === 'en' ? 'City or locality' : 'Cidade ou localidade'}
                />
              </div>
            </div>
          </div>
        );

      case 'radio':
        const hasInputOption = question.options.some(opt => opt.showInput);
        const selectedRadioValue = answers[questionId] || '';
        const selectedOption = question.options.find(opt => opt.value === selectedRadioValue);
        
        return (
          <div className="space-y-8">
            <Label className="text-xl font-medium text-white">{questionText}</Label>
            <RadioGroup
              value={selectedRadioValue}
              onValueChange={(value) => handleAnswer(questionId, value)}
              className="space-y-4"
            >
              {question.options.map((option, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex items-center space-x-4 bg-white/10 p-4 rounded-lg border border-white/20 hover:bg-white/15 transition-colors">
                    <RadioGroupItem value={option.value} id={`${questionId}-${index}`} className="border-green-400 text-green-400" />
                    <Label 
                      htmlFor={`${questionId}-${index}`}
                      className="text-white cursor-pointer text-lg flex-1"
                    >
                      {option.label[currentLanguage]}
                    </Label>
                  </div>
                  {option.showInput && selectedRadioValue === option.value && (
                    <Input
                      value={answers[`${questionId}_specify`] || ''}
                      onChange={(e) => handleAnswer(`${questionId}_specify`, e.target.value)}
                      className="bg-white/10 border-white/30 text-white placeholder:text-white/60 ml-8"
                      placeholder={`${translations.specify} ${option.label[currentLanguage].toLowerCase()}`}
                    />
                  )}
                </div>
              ))}
            </RadioGroup>
          </div>
        );

      case 'card-select':
        const cardAnswers = answers[questionId] || [];
        
        return (
          <div className="space-y-8">
            <Label className="text-xl font-medium text-white">{questionText}</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {question.options.map((option, index) => {
                const isSelected = cardAnswers.includes(option.value);
                
                return (
                  <div key={index} className="space-y-3">
                    <Card 
                      className={`
                        cursor-pointer transition-all duration-300 p-6 border-2 hover:scale-105
                        ${isSelected 
                          ? 'bg-green-500/20 border-green-400' 
                          : 'bg-white/10 border-white/20 hover:bg-white/15'
                        }
                      `}
                      onClick={() => {
                        const newAnswers = isSelected 
                          ? cardAnswers.filter(v => v !== option.value)
                          : [...cardAnswers, option.value];
                        handleAnswer(questionId, newAnswers);
                      }}
                    >
                      <div className="text-center space-y-4">
                        {option.image && (
                          <img 
                            src={option.image} 
                            alt={option.label[currentLanguage]}
                            className="w-20 h-20 object-cover rounded-lg mx-auto"
                          />
                        )}
                        {option.logo && (
                          <img 
                            src={option.logo} 
                            alt={option.label[currentLanguage]}
                            className="w-16 h-16 object-contain mx-auto"
                          />
                        )}
                        <Label className="text-white text-lg font-medium cursor-pointer">
                          {option.label[currentLanguage]}
                        </Label>
                        {isSelected && (
                          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </Card>
                    {option.showInput && isSelected && (
                      <Input
                        value={answers[`${questionId}_other`] || ''}
                        onChange={(e) => handleAnswer(`${questionId}_other`, e.target.value)}
                        className="bg-white/10 border-white/30 text-white placeholder:text-white/60"
                        placeholder={`${translations.specify} ${option.label[currentLanguage].toLowerCase()}`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 'slider':
        return (
          <div className="space-y-8">
            <Label className="text-xl font-medium text-white">{questionText}</Label>
            <div className="space-y-6">
              <Slider
                value={[answers[questionId] || question.min]}
                onValueChange={(value) => handleAnswer(questionId, value[0])}
                max={question.max}
                min={question.min}
                step={question.step}
                className="w-full"
              />
              <div className="flex justify-between text-white/70 text-lg">
                <span>${question.min}</span>
                <span className="text-green-400 font-semibold text-xl">
                  ${answers[questionId] || question.min}
                </span>
                <span>${question.max}</span>
              </div>
            </div>
          </div>
        );

      case 'number':
        return (
          <div className="space-y-6">
            <Label className="text-xl font-medium text-white">{questionText}</Label>
            <Input
              type="number"
              value={answers[questionId] || ''}
              onChange={(e) => handleAnswer(questionId, parseInt(e.target.value) || 0)}
              className="bg-white/10 border-white/30 text-white placeholder:text-white/60 h-12 text-lg"
              placeholder="0"
              min="0"
            />
          </div>
        );

      default:
        return null;
    }
  };

  if (isCompleted) {
    return <CompletionPage currentLanguage={currentLanguage} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800">
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
        <div className="lg:w-1/2 p-8 flex flex-col justify-center bg-gradient-to-br from-black via-gray-900 to-gray-800 relative">
          {/* Green Border Frame */}
          <div className="absolute inset-4 border-2 border-green-400 rounded-lg pointer-events-none opacity-60"></div>
          
          <Card className="bg-black/60 border-white/10 backdrop-blur-sm relative z-10">
            <div className="p-8">
              <div className="mb-8">
                <div className="flex justify-end items-center mb-6">
                  <div className="w-48 bg-white/20 rounded-full h-3">
                    <div 
                      className="bg-green-400 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="mb-10">
                {renderQuestion()}
              </div>

              <div className="flex justify-between">
                <Button
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0}
                  variant="outline"
                  className="bg-transparent border-white/30 text-white hover:bg-white/10 px-6 py-3"
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
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;