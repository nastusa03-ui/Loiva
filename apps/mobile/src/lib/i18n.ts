import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';
import en from '@loiva/i18n/src/en.json';
import ru from '@loiva/i18n/src/ru.json';

const deviceLang = getLocales()[0]?.languageCode || 'ru';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ru: { translation: ru },
  },
  lng: deviceLang,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
  pluralSeparator: '_',
  compatibilityJSON: 'v3',
});

export default i18n;
