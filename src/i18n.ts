import i18n, { type Resource } from 'i18next';
import { initReactI18next } from 'react-i18next';
import { PWA_CACHE } from '@/lib/cache-name';
declare const __BASE_URL__: string;

// Supported translation files shipped with the application.
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
];

// Initialize i18next without preloaded resources.

i18n.use(initReactI18next).init({
  resources: {},
  lng: 'en-US',
  fallbackLng: 'en-US',
  interpolation: { escapeValue: false },
});

export async function changeLanguageAsync(lng: string) {
  if (!i18n.hasResourceBundle(lng, 'translation')) {
    try {
      const url = `${__BASE_URL__}locales/${lng}.json`;
      let response: Response | undefined =
        typeof caches !== 'undefined' ? await caches.match(url) : undefined;
      if (!response) {
        response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch ${url}: ${response.status}`);
        }
        if (typeof caches !== 'undefined') {
          const cache = await caches.open(PWA_CACHE);
          cache.put(url, response.clone());
        }
      }
      const translation = (await response.json()) as Resource;
      i18n.addResourceBundle(lng, 'translation', translation, true, true);
    } catch (error) {
      console.warn(`Failed to load translations for ${lng}`, error);
    }
  }
  return i18n.changeLanguage(lng);
}

function detectLocale(): string {
  if (typeof navigator === 'undefined') {
    return 'en-US';
  }
  const candidates: string[] = [];
  if (navigator.language) {
    candidates.push(navigator.language);
  }
  if (navigator.languages) {
    candidates.push(...navigator.languages);
  }
  for (const lang of candidates) {
    if (SUPPORTED_LOCALES.includes(lang)) {
      return lang;
    }
    const base = lang.split('-')[0];
    const match = SUPPORTED_LOCALES.find((l) => l.startsWith(base));
    if (match) {
      return match;
    }
  }
  return 'en-US';
}

// Load the detected language initially.
void changeLanguageAsync(detectLocale());

export default i18n;
