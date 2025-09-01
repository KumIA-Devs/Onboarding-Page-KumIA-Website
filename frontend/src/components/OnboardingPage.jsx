import React, { useState } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Checkbox } from './ui/checkbox';
import { Slider } from './ui/slider';
import TopBar from './TopBar';
import ProgressSteps from './ProgressSteps';
import { onboardingData } from '../data/mock';

const OnboardingPage = () => {
  const [currentLanguage, setCurrentLanguage] = useState('es');
  const [currentStep, setCurrentStep] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});

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
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  // Validate if current question is answered
  const isCurrentQuestionAnswered = () => {
    const currentQuestionId = questions[currentQuestion].id;
    const answer = answers[currentQuestionId];
    
    if (answer === undefined || answer === null) return false;
    if (typeof answer === 'string' && answer.trim() === '') return false;
    if (Array.isArray(answer) && answer.length === 0) return false;
    if (typeof answer === 'number' && answer === 0) return false;
    
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

      case 'radio':
        return (
          <div className="space-y-8">
            <Label className="text-xl font-medium text-white">{questionText}</Label>
            <RadioGroup
              value={answers[questionId] || ''}
              onValueChange={(value) => handleAnswer(questionId, value)}
              className="space-y-4"
            >
              {question.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-4 bg-white/10 p-4 rounded-lg border border-white/20 hover:bg-white/15 transition-colors">
                  <RadioGroupItem value={option.value} id={`${questionId}-${index}`} className="border-green-400 text-green-400" />
                  <Label 
                    htmlFor={`${questionId}-${index}`}
                    className="text-white cursor-pointer text-lg flex-1"
                  >
                    {option.label[currentLanguage]}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );

      case 'checkbox':
        return (
          <div className="space-y-8">
            <Label className="text-xl font-medium text-white">{questionText}</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {question.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-4 bg-white/10 p-6 rounded-lg border border-white/20 hover:bg-white/15 transition-colors min-h-[120px]">
                  <Checkbox
                    id={`${questionId}-${index}`}
                    checked={(answers[questionId] || []).includes(option.value)}
                    onCheckedChange={(checked) => {
                      const current = answers[questionId] || [];
                      if (checked) {
                        handleAnswer(questionId, [...current, option.value]);
                      } else {
                        handleAnswer(questionId, current.filter(v => v !== option.value));
                      }
                    }}
                    className="border-green-400 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500 w-5 h-5"
                  />
                  <div className="flex-1">
                    {option.image && (
                      <img 
                        src={option.image} 
                        alt={option.label[currentLanguage]}
                        className="w-16 h-16 object-cover rounded mb-3"
                      />
                    )}
                    <Label 
                      htmlFor={`${questionId}-${index}`}
                      className="text-white cursor-pointer text-lg"
                    >
                      {option.label[currentLanguage]}
                    </Label>
                  </div>
                </div>
              ))}
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
                  disabled={currentQuestion === totalQuestions - 1 || !isCurrentQuestionAnswered()}
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