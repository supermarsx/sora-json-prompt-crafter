import { useState, useEffect } from 'react';
import i18n from '@/i18n';
import { safeGet, safeSet } from '@/lib/storage';

export function useLocale() {
  const [locale, setLocale] = useState(() => safeGet('locale') || 'en');

  useEffect(() => {
    i18n.changeLanguage(locale);
    safeSet('locale', locale);
  }, [locale]);

  return [locale, setLocale] as const;
}
