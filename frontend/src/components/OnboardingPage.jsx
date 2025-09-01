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

  const renderQuestion = () => {
    const question = questions[currentQuestion];
    const questionText = question.text[currentLanguage];
    const questionId = question.id;

    switch (question.type) {
      case 'text':
        return (
          <div className="space-y-4">
            <Label className="text-lg font-medium text-white">{questionText}</Label>
            <Input
              value={answers[questionId] || ''}
              onChange={(e) => handleAnswer(questionId, e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
              placeholder={question.placeholder?.[currentLanguage] || ''}
            />
          </div>
        );

      case 'textarea':
        return (
          <div className="space-y-4">
            <Label className="text-lg font-medium text-white">{questionText}</Label>
            <Textarea
              value={answers[questionId] || ''}
              onChange={(e) => handleAnswer(questionId, e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
              placeholder={question.placeholder?.[currentLanguage] || ''}
            />
          </div>
        );

      case 'radio':
        return (
          <div className="space-y-6">
            <Label className="text-lg font-medium text-white">{questionText}</Label>
            <RadioGroup
              value={answers[questionId] || ''}
              onValueChange={(value) => handleAnswer(questionId, value)}
              className="space-y-3"
            >
              {question.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <RadioGroupItem value={option.value} id={`${questionId}-${index}`} />
                  <Label 
                    htmlFor={`${questionId}-${index}`}
                    className="text-white cursor-pointer"
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
          <div className="space-y-6">
            <Label className="text-lg font-medium text-white">{questionText}</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {question.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-3 bg-white/5 p-4 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
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
                  />
                  <div className="flex-1">
                    {option.image && (
                      <img 
                        src={option.image} 
                        alt={option.label[currentLanguage]}
                        className="w-12 h-12 object-cover rounded mb-2"
                      />
                    )}
                    <Label 
                      htmlFor={`${questionId}-${index}`}
                      className="text-white cursor-pointer text-sm"
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
          <div className="space-y-6">
            <Label className="text-lg font-medium text-white">{questionText}</Label>
            <div className="space-y-4">
              <Slider
                value={[answers[questionId] || question.min]}
                onValueChange={(value) => handleAnswer(questionId, value[0])}
                max={question.max}
                min={question.min}
                step={question.step}
                className="w-full"
              />
              <div className="flex justify-between text-white/70 text-sm">
                <span>${question.min}</span>
                <span className="text-green-400 font-semibold">
                  ${answers[questionId] || question.min}
                </span>
                <span>${question.max}</span>
              </div>
            </div>
          </div>
        );

      case 'number':
        return (
          <div className="space-y-4">
            <Label className="text-lg font-medium text-white">{questionText}</Label>
            <Input
              type="number"
              value={answers[questionId] || ''}
              onChange={(e) => handleAnswer(questionId, parseInt(e.target.value) || 0)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
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
        <div className="lg:w-1/2 p-8 flex flex-col justify-center items-center bg-black/30">
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
        <div className="lg:w-1/2 p-8 flex flex-col justify-center relative">
          {/* Comet Animation */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="comet-orbit">
              <div className="comet">
                <div className="comet-head"></div>
                <div className="comet-tail"></div>
              </div>
            </div>
          </div>

          <Card className="bg-black/40 border-white/10 backdrop-blur-sm relative z-10">
            <div className="p-8">
              <div className="mb-6">
                <div className="flex justify-end items-center mb-4">
                  <div className="w-32 bg-white/20 rounded-full h-2">
                    <div 
                      className="bg-green-400 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                {renderQuestion()}
              </div>

              <div className="flex justify-between">
                <Button
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0}
                  variant="outline"
                  className="bg-transparent border-white/20 text-white hover:bg-white/10"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  {translations.previous}
                </Button>

                <Button
                  onClick={handleNext}
                  disabled={currentQuestion === totalQuestions - 1}
                  className="bg-green-500 hover:bg-green-600 text-white"
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