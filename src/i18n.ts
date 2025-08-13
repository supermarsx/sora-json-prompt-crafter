import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Initialize i18next without preloaded resources.
i18n.use(initReactI18next).init({
  resources: {},
  lng: 'en-US',
  fallbackLng: 'en-US',
  interpolation: { escapeValue: false },
});

const originalChangeLanguage = i18n.changeLanguage.bind(i18n);

// Override changeLanguage to dynamically load translation files on demand.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(i18n as any).changeLanguage = async (lng: string) => {
  if (!i18n.hasResourceBundle(lng, 'translation')) {
    try {
      const { default: translation } = await import(`./locales/${lng}.json`);
      i18n.addResourceBundle(lng, 'translation', translation, true, true);
    } catch (error) {
      console.warn(`Failed to load translations for ${lng}`, error);
    }
  }
  return originalChangeLanguage(lng);
};

// Load the default language initially.
void i18n.changeLanguage('en-US');

export default i18n;
