import React, { useEffect } from 'react';
import { Check, Sparkles } from 'lucide-react';
import { onboardingData } from '../data/mock';

const CompletionPage = ({ currentLanguage = 'es', onComplete }) => {
  const translations = onboardingData.translations[currentLanguage];

  // Auto redirect after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onComplete) {
        onComplete();
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

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
            <Check className="w-10 h-10 text-white" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-white mb-6">
          {translations.completion.title}
        </h1>

        {/* Message */}
        <p className="text-xl text-white/80 mb-8 leading-relaxed">
          {translations.completion.message}
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

        {/* Processing Text */}
        <p className="text-lg text-green-400 font-medium animate-pulse">
          {translations.completion.processing}
        </p>

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