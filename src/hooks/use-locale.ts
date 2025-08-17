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

/**
 * Normalize a raw locale string to one of the application's supported locales.
 *
 * The comparison is case-insensitive and attempts several fallbacks:
 * 1. direct match against `SUPPORTED_LOCALES`
 * 2. canonical match of language and upper-cased region (e.g. `pt` → `pt-PT`)
 * 3. partial match for the language prefix (defaults to `en-US` for English)
 *
 * @param lng - The locale string to normalize
 * @returns A supported locale, defaulting to `en-US` when no match is found
 */
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

/**
 * React hook that manages the application's active locale.
 *
 * The initial locale is determined from `navigator.language`, normalized, and
 * stored in `localStorage`. Subsequent updates persist to storage and trigger
 * the i18n layer to switch languages.
 *
 * @returns A tuple containing the current locale and a setter function.
 */
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
