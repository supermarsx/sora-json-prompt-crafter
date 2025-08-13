import i18n, { type Resource } from 'i18next';
import { initReactI18next } from 'react-i18next';

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
      const { default: translation } = await import(
        `./locales/${lng}.json`
      );
      i18n.addResourceBundle(
        lng,
        'translation',
        translation as Resource,
        true,
        true,
      );
    } catch (error) {
      console.warn(`Failed to load translations for ${lng}`, error);
    }
  }
  return i18n.changeLanguage(lng);
}

// Load the default language initially.
void changeLanguageAsync('en-US');

export default i18n;
