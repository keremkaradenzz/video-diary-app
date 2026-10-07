import { getLocales } from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { en } from './locales/en';
import { tr } from './locales/tr';

const resources = { en: { translation: en }, tr: { translation: tr } };
const device = getLocales()[0]?.languageCode ?? 'en';

// eslint-disable-next-line import/no-named-as-default-member -- `use` is the instance method, not the named export
i18n.use(initReactI18next).init({
  resources,
  lng: device in resources ? device : 'en',
  fallbackLng: 'en',
  initAsync: false,
  interpolation: { escapeValue: false },
});

export default i18n;
