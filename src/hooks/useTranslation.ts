import { useLanguage } from '../contexts/LanguageContext';

/**
 * Translation hook
 * Returns translations based on current locale
 */
export const useTranslation = () => {
  const { t, locale, setLocale } = useLanguage();
  
  return {
    t,
    locale,
    setLocale,
  };
};

// Helper function to get nested translation
export const getTranslation = (key: string, translations: any): string => {
  const keys = key.split('.');
  let result = translations;
  
  for (const k of keys) {
    if (result && typeof result === 'object' && k in result) {
      result = result[k];
    } else {
      return key; // Return key if translation not found
    }
  }
  
  return typeof result === 'string' ? result : key;
};
