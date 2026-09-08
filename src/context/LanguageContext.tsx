import React, { createContext, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n/index';

export type Language = 'en' | 'hi' | 'te' | 'ta' | 'mr' | 'pa';

export const LANGUAGE_OPTIONS: { code: Language; label: string; nativeLabel: string; flag: string }[] = [
  { code: 'en', label: 'English',  nativeLabel: 'English',   flag: '🇬🇧' },
  { code: 'hi', label: 'Hindi',    nativeLabel: 'हिंदी',       flag: '🇮🇳' },
  { code: 'te', label: 'Telugu',   nativeLabel: 'తెలుగు',      flag: '🇮🇳' },
  { code: 'ta', label: 'Tamil',    nativeLabel: 'தமிழ்',       flag: '🇮🇳' },
  { code: 'mr', label: 'Marathi',  nativeLabel: 'मराठी',       flag: '🇮🇳' },
  { code: 'pa', label: 'Punjabi',  nativeLabel: 'ਪੰਜਾਬੀ',      flag: '🇮🇳' },
];

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  languageOptions: typeof LANGUAGE_OPTIONS;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(
    (localStorage.getItem('agri_lang') as Language) || 'en'
  );
  const { t } = useTranslation();

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('agri_lang', lang);
    i18n.changeLanguage(lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: (key) => t(key) as string, languageOptions: LANGUAGE_OPTIONS }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
};
