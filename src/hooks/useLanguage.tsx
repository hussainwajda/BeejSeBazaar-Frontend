'use client';

import { useState, useEffect, createContext, useContext } from 'react';

// Language context
const LanguageContext = createContext<{
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
}>({
  language: 'en',
  setLanguage: () => {},
  t: () => '',
});

// Hook to use language context
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// Language provider component
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState('en');
  const [translations, setTranslations] = useState<Record<string, any>>({});

  useEffect(() => {
    // Load translations for the current language
    const loadTranslations = async () => {
      try {
        const response = await import(`@/languages/${language}.json`);
        setTranslations(response.default);
      } catch (error) {
        console.error(`Failed to load translations for ${language}:`, error);
        // Fallback to English
        if (language !== 'en') {
          const fallback = await import('@/languages/en.json');
          setTranslations(fallback.default);
        }
      }
    };

    loadTranslations();
  }, [language]);

  // Translation function
  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key; // Return key if translation not found
      }
    }
    
    return typeof value === 'string' ? value : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}