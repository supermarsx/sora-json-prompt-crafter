import i18n, { type Resource } from 'i18next';
import { initReactI18next } from 'react-i18next';
declare const __BASE_URL__: string;

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
          const cache = await caches.open('sora-prompt-cache-v2');
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

// Load the default language initially.
void changeLanguageAsync('en-US');

export default i18n;
