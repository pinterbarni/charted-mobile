import * as Localization from 'expo-localization';
import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import hu from './locales/hu.json';

const deviceLanguage = Localization.getLocales()[0]?.languageCode ?? 'en';

const i18n = createInstance();

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    hu: { translation: hu },
  },
  lng: deviceLanguage,
  fallbackLng: 'hu',
  interpolation: {
    escapeValue: false,
  },
  compatibilityJSON: 'v4',
});
