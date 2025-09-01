import React from 'react';
import { Check } from 'lucide-react';

const ProgressSteps = ({ currentStep, translations }) => {
  const steps = [
    { 
      id: 1, 
      title: translations.steps.basics,
      description: translations.steps.basicsDesc
    },
    { 
      id: 2, 
      title: translations.steps.operations,
      description: translations.steps.operationsDesc
    },
    { 
      id: 3, 
      title: translations.steps.feedback,
      description: translations.steps.feedbackDesc
    },
    { 
      id: 4, 
      title: translations.steps.experience,
      description: translations.steps.experienceDesc
    },
    { 
      id: 5, 
      title: translations.steps.goals,
      description: translations.steps.goalsDesc
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white text-center mb-8">
        {translations.onboardingProgress}
      </h2>
      
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;
        
        return (
          <div key={step.id} className="flex items-start space-x-4">
            <div className={`
              flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300
              ${isCompleted 
                ? 'bg-green-500 border-green-500' 
                : isCurrent 
                ? 'border-green-400 bg-green-400/20' 
                : 'border-white/30'
              }
            `}>
              {isCompleted ? (
                <Check className="w-5 h-5 text-white" />
              ) : (
                <span className={`text-sm font-semibold ${
                  isCurrent ? 'text-green-400' : 'text-white/60'
                }`}>
                  {step.id}
                </span>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className={`text-lg font-semibold ${
                isCurrent ? 'text-green-400' : isCompleted ? 'text-white' : 'text-white/60'
              }`}>
                {step.title}
              </h3>
              <p className={`text-sm mt-1 ${
                isCurrent ? 'text-white/90' : 'text-white/60'
              }`}>
                {step.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProgressSteps;