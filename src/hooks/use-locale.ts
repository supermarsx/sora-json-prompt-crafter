import { useEffect } from 'react';
import i18n from '@/i18n';
import { useLocalStorageState } from './use-local-storage-state';
import { LOCALE } from '@/lib/storage-keys';

export function useLocale() {
  const [locale, setLocale] = useLocalStorageState(LOCALE, 'en');

  useEffect(() => {
    i18n.changeLanguage(locale);
  }, [locale]);

  return [locale, setLocale] as const;
}
