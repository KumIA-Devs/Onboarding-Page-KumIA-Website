import React, { useState } from 'react';

const TopBar = ({ currentLanguage, setCurrentLanguage, translations }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const languages = [
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'pt', name: 'Português', flag: '🇧🇷' }
  ];

  const currentLang = languages.find(lang => lang.code === currentLanguage);

  const handleLanguageChange = (langCode) => {
    setCurrentLanguage(langCode);
    setIsDropdownOpen(false);
  };

  return (
    <div className="bg-black border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <img 
              src="https://customer-assets.emergentagent.com/job_01c2df2f-712f-43dc-b607-91e2afc70fe8/artifacts/8zopuovo_Logo%20OFICIAL%20negro.jpg"
              alt="KumIA"
              className="h-18 w-auto"
            />
          </div>

          {/* Slogan */}
          <div className="hidden md:block">
            <h1 className="text-white text-lg font-medium text-center">
              {translations.slogan}
            </h1>
          </div>

          {/* Language Selector */}
          <div className="flex items-center relative">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="text-white hover:bg-white/10 flex items-center space-x-3 h-12 px-4 rounded-md transition-colors"
            >
              <span className="text-2xl">{currentLang?.flag || '🇪🇸'}</span>
              <span className="hidden sm:inline text-lg">{currentLang?.name || 'Español'}</span>
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {isDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 bg-black/90 border border-white/20 backdrop-blur-sm min-w-[150px] rounded-md shadow-lg z-50">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className="w-full text-white hover:bg-white/10 focus:bg-white/10 cursor-pointer flex items-center space-x-3 px-4 py-3 text-left"
                  >
                    <span className="text-xl">{lang.flag}</span>
                    <span className="text-base">{lang.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;