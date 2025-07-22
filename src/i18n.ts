import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import es from './locales/es.json';
import ptPT from './locales/pt-PT.json';
import ru from './locales/ru.json';

const resources = {
  en: { translation: en },
  es: { translation: es },
  'pt-PT': { translation: ptPT },
  ru: { translation: ru },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;
