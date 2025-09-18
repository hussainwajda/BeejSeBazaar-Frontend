'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';

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
  const [language, setLanguageState] = useState('en');
  const [translations, setTranslations] = useState<Record<string, any>>({});

  // Hydrate language from localStorage once on mount. Prefer entry page key 'selectedLanguage'.
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const savedEntry = localStorage.getItem('selectedLanguage');
        const savedLegacy = localStorage.getItem('language');
        const initial = savedEntry || savedLegacy;
        if (initial) {
          setLanguageState(initial);
        }
      }
    } catch {}
  }, []);

  // Wrap setter to keep both localStorage keys in sync
  const setLanguage = (lang: string) => {
    setLanguageState(lang);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('language', lang);
        localStorage.setItem('selectedLanguage', lang);
      }
    } catch {}
  };

  useEffect(() => {
    const loadTranslations = async () => {
      try {
        // Always start from English base bundle
        const base = (await import('@/languages/en.json')).default as Record<string, any>;

        if (language === 'en') {
          setTranslations(base);
          try { if (typeof window !== 'undefined') { localStorage.setItem('language', language); localStorage.setItem('selectedLanguage', language); } } catch {}
          return;
        }

        // Ask backend to translate base bundle into selected language
        const translated = await apiClient.post<Record<string, any>>(API_ENDPOINTS.translate, {
          to: language,
          payload: base,
        });
        setTranslations(translated);
        try { if (typeof window !== 'undefined') { localStorage.setItem('language', language); localStorage.setItem('selectedLanguage', language); } } catch {}
      } catch (error) {
        console.error(`Failed to load/translate bundle for ${language}:`, error);
        // Fallback: try existing static file if present, else English
        try {
          const fallbackDyn = (await import(`@/languages/${language}.json`)).default as Record<string, any>;
          setTranslations(fallbackDyn);
        } catch {
          const fallback = (await import('@/languages/en.json')).default as Record<string, any>;
          setTranslations(fallback);
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