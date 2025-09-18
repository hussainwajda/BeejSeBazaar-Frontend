'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

const languages = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
];

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const [currentCode, setCurrentCode] = useState(language);

  useEffect(() => {
    try {
      const entry = typeof window !== 'undefined' ? localStorage.getItem('selectedLanguage') : null;
      const legacy = typeof window !== 'undefined' ? localStorage.getItem('language') : null;
      const init = entry || legacy || language;
      setCurrentCode(init);
    } catch {
      setCurrentCode(language);
    }
  }, [language]);

  const currentLanguage = languages.find(lang => lang.code === currentCode) || languages[0];

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-9 gap-2">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">{currentLanguage.nativeName}</span>
          <span className="sm:hidden">{currentLanguage.code.toUpperCase()}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => {
              setLanguage(lang.code);
              try {
                if (typeof window !== 'undefined') {
                  localStorage.setItem('selectedLanguage', lang.code);
                  localStorage.setItem('language', lang.code);
                }
              } catch {}
              setCurrentCode(lang.code);
              setOpen(false);
            }}
            className={`flex items-center gap-3 ${
              currentCode === lang.code ? 'bg-green-50 text-green-800' : ''
            }`}
          >
            <div className="flex flex-col">
              <span className="font-medium">{lang.nativeName}</span>
              <span className="text-xs text-muted-foreground">{lang.name}</span>
            </div>
            {currentCode === lang.code && (
              <div className="w-2 h-2 bg-green-600 rounded-full ml-auto" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}