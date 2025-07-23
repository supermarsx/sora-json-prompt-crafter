import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enUS from './locales/en-US.json';
import esES from './locales/es-ES.json';
import ptPT from './locales/pt-PT.json';
import ruRU from './locales/ru-RU.json';
import ptBR from './locales/pt-BR.json';
import frFR from './locales/fr-FR.json';
import deDE from './locales/de-DE.json';
import zhCN from './locales/zh-CN.json';
import itIT from './locales/it-IT.json';
import esMX from './locales/es-MX.json';
import enGB from './locales/en-GB.json';
import bnIN from './locales/bn-IN.json';
import jaJP from './locales/ja-JP.json';
import enPR from './locales/en-PR.json';
import koKR from './locales/ko-KR.json';
import roRO from './locales/ro-RO.json';
import svSE from './locales/sv-SE.json';
import ukUA from './locales/uk-UA.json';
import neNP from './locales/ne-NP.json';
import daDK from './locales/da-DK.json';
import etEE from './locales/et-EE.json';
import fiFI from './locales/fi-FI.json';
import elGR from './locales/el-GR.json';
import thTH from './locales/th-TH.json';
import deAT from './locales/de-AT.json';
import frBE from './locales/fr-BE.json';
import esAR from './locales/es-AR.json';

const resources = {
  'en-US': { translation: enUS },
  'es-ES': { translation: esES },
  'pt-PT': { translation: ptPT },
  'ru-RU': { translation: ruRU },
  'pt-BR': { translation: ptBR },
  'fr-FR': { translation: frFR },
  'de-DE': { translation: deDE },
  'zh-CN': { translation: zhCN },
  'it-IT': { translation: itIT },
  'es-MX': { translation: esMX },
  'en-GB': { translation: enGB },
  'bn-IN': { translation: bnIN },
  'ja-JP': { translation: jaJP },
  'en-PR': { translation: enPR },
  'ko-KR': { translation: koKR },
  'ro-RO': { translation: roRO },
  'sv-SE': { translation: svSE },
  'uk-UA': { translation: ukUA },
  'ne-NP': { translation: neNP },
  'da-DK': { translation: daDK },
  'et-EE': { translation: etEE },
  'fi-FI': { translation: fiFI },
  'el-GR': { translation: elGR },
  'th-TH': { translation: thTH },
  'de-AT': { translation: deAT },
  'fr-BE': { translation: frBE },
  'es-AR': { translation: esAR },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en-US',
  fallbackLng: 'en-US',
  interpolation: { escapeValue: false },
});

export default i18n;
