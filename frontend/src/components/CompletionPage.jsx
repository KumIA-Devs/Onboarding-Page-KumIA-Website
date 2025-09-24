import React, { useEffect, useState } from 'react';
import { Check, Sparkles, Loader2 } from 'lucide-react';
import { onboardingData } from '../data/mock';

const CompletionPage = ({ currentLanguage = 'es', onComplete, isCompleting = false }) => {
  const translations = onboardingData.translations[currentLanguage];
  const [countdown, setCountdown] = useState(2); // Shorter countdown to match our timeout
  const [hasStartedCompletion, setHasStartedCompletion] = useState(false);

  // Countdown and auto redirect
  useEffect(() => {
    if (isCompleting || hasStartedCompletion) return; // Don't start countdown if already completing

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          setHasStartedCompletion(true);
          if (onComplete) {
            onComplete();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onComplete, isCompleting, hasStartedCompletion]);

  const handleManualComplete = () => {
    if (!isCompleting && !hasStartedCompletion) {
      setHasStartedCompletion(true);
      if (onComplete) {
        onComplete();
      }
    }
  };

  const showLoading = isCompleting || hasStartedCompletion;
  const showCountdown = !showLoading && countdown > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 flex items-center justify-center p-8">
      <div className="max-w-2xl w-full text-center">
        {/* Logo */}
        <div className="mb-12">
          <img
            src="https://customer-assets.emergentagent.com/job_01c2df2f-712f-43dc-b607-91e2afc70fe8/artifacts/wbisp6gb_Logo_Oficial_Solo_Verde-NoBackground.png"
            alt="KumIA Logo"
            className="w-32 h-32 mx-auto mb-6 object-contain"
          />
        </div>

        {/* Success Icon */}
        <div className="mb-8">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            {showLoading ? (
              <Loader2 className="w-10 h-10 text-white animate-spin" />
            ) : (
              <Check className="w-10 h-10 text-white" />
            )}
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-white mb-6">
          {showLoading ?
            (isCompleting ? 'Finalizando configuración...' : 'Accediendo al dashboard...') :
            translations.completion.title
          }
        </h1>

        {/* Message */}
        <p className="text-xl text-white/80 mb-8 leading-relaxed">
          {showLoading ?
            'Configurando tu experiencia personalizada...' :
            translations.completion.message
          }
        </p>

        {/* Loading Animation */}
        <div className="flex items-center justify-center space-x-2 mb-8">
          <Sparkles className="w-6 h-6 text-green-400 animate-pulse" />
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
          <Sparkles className="w-6 h-6 text-green-400 animate-pulse" />
        </div>

        {/* Processing Text with Countdown or Completion Status */}
        <div className="mb-8">
          <p className="text-lg text-green-400 font-medium animate-pulse">
            {showLoading ?
              (isCompleting ? 'Completando onboarding...' : 'Redirigiendo...') :
              translations.completion.processing
            }
          </p>

          {showCountdown && (
            <p className="text-sm text-white/60 mt-2">
              Redirección automática en {countdown} segundo{countdown !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        {/* Manual Complete Button - only show if not loading */}
        {!showLoading && (
          <button
            onClick={handleManualComplete}
            className="bg-[#9ACD32] hover:bg-green-600 text-black font-bold px-8 py-3 rounded-xl text-lg transition-all duration-300 shadow-lg"
          >
            Continuar Ahora
          </button>
        )}

        {/* Background Decoration */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-green-400 rounded-full animate-ping opacity-20"></div>
          <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-green-400 rounded-full animate-ping opacity-30" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-green-400 rounded-full animate-ping opacity-25" style={{ animationDelay: '4s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default CompletionPage;