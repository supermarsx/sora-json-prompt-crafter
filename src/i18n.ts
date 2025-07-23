import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enUS from './locales/en-US.json';
import esES from './locales/es-ES.json';
import ptPT from './locales/pt-PT.json';
import ruRU from './locales/ru-RU.json';
import ptBR from './locales/pt-BR.json';
import frFR from './locales/fr-FR.json';
import deDE from './locales/de-DE.json';
import jaJP from './locales/ja-JP.json';
import zhCN from './locales/zh-CN.json';

const resources = {
  'en-US': { translation: enUS },
  'es-ES': { translation: esES },
  'pt-PT': { translation: ptPT },
  'ru-RU': { translation: ruRU },
  'pt-BR': { translation: ptBR },
  'fr-FR': { translation: frFR },
  'de-DE': { translation: deDE },
  'ja-JP': { translation: jaJP },
  'zh-CN': { translation: zhCN },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en-US',
  fallbackLng: 'en-US',
  interpolation: { escapeValue: false },
});

export default i18n;
