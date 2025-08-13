import { useEffect } from 'react';
import { changeLanguageAsync } from '@/i18n';
import { useLocalStorageState } from './use-local-storage-state';
import { LOCALE } from '@/lib/storage-keys';

const SUPPORTED_LOCALES = [
  'bn-IN',
  'da-DK',
  'de-AT',
  'de-DE',
  'el-GR',
  'en-GB',
  'en-PR',
  'en-US',
  'es-AR',
  'es-ES',
  'es-MX',
  'et-EE',
  'fi-FI',
  'fr-BE',
  'fr-FR',
  'it-IT',
  'ja-JP',
  'ko-KR',
  'ne-NP',
  'pt-BR',
  'pt-PT',
  'ro-RO',
  'ru-RU',
  'sv-SE',
  'th-TH',
  'uk-UA',
  'zh-CN',
] as const;

function normalizeLocale(lng: string): string {
  const lower = lng.toLowerCase();
  const exact = SUPPORTED_LOCALES.find(
    (loc) => loc.toLowerCase() === lower,
  );
  if (exact) return exact;

  const prefix = lower.split('-')[0];
  const canonical = `${prefix}-${prefix.toUpperCase()}`;
  const canonicalMatch = SUPPORTED_LOCALES.find(
    (loc) => loc.toLowerCase() === canonical.toLowerCase(),
  );
  if (canonicalMatch) return canonicalMatch;

  const partial = SUPPORTED_LOCALES.find((loc) =>
    loc.toLowerCase().startsWith(`${prefix}-`),
  );
  if (partial) return prefix === 'en' ? 'en-US' : partial;

  return 'en-US';
}

export function useLocale() {
  const initialLocale = normalizeLocale(
    typeof navigator !== 'undefined' && navigator.language
      ? navigator.language
      : 'en-US',
  );
  const [locale, setLocale] = useLocalStorageState(LOCALE, initialLocale);

  useEffect(() => {
    const normalized = normalizeLocale(locale);
    if (normalized !== locale) {
      setLocale(normalized);
      return;
    }
    changeLanguageAsync(locale);
  }, [locale, setLocale]);

  return [locale, setLocale] as const;
}
