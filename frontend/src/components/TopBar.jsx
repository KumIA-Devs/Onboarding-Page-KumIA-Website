import React, { useState } from 'react';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';

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
          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button 
                  className="text-white hover:bg-white/10 flex items-center space-x-3 h-12 px-4 rounded-md transition-colors"
                >
                  <span className="text-2xl">{currentLang?.flag || '🇪🇸'}</span>
                  <span className="hidden sm:inline text-lg">{currentLang?.name || 'Español'}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                className="bg-black/90 border-white/20 backdrop-blur-sm min-w-[150px] z-50"
                align="end"
                sideOffset={5}
              >
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onSelect={() => {
                      setCurrentLanguage(lang.code);
                    }}
                    className="text-white hover:bg-white/10 focus:bg-white/10 cursor-pointer flex items-center space-x-3 px-4 py-2"
                  >
                    <span className="text-xl">{lang.flag}</span>
                    <span className="text-base">{lang.name}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;