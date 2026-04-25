import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import cs from './locales/cs.json'
import en from './locales/en.json'
import de from './locales/de.json'
import es from './locales/es.json'
import uk from './locales/uk.json'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      cs: { translation: cs },
      en: { translation: en },
      de: { translation: de },
      es: { translation: es },
      uk: { translation: uk },
    },
    fallbackLng: 'cs',
    lng: localStorage.getItem('vevit_lang') || 'cs',
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'vevit_lang',
      caches: ['localStorage'],
    },
  })

export function changeLanguage(lng: string) {
  i18n.changeLanguage(lng)
}

export default i18n