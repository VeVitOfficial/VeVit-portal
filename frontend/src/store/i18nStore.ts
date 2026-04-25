import { create } from 'zustand'

export type Lang = 'cs' | 'en' | 'de' | 'es' | 'uk'

interface I18nState {
  language: Lang
  setLanguage: (lang: Lang) => void
  init: () => void
}

export const useI18nStore = create<I18nState>((set) => ({
  language: 'cs',

  setLanguage: (lang) => {
    localStorage.setItem('vevit_lang', lang)
    set({ language: lang })
    // Update i18next
    import('../i18n').then(({ changeLanguage }) => changeLanguage(lang))
  },

  init: () => {
    const saved = localStorage.getItem('vevit_lang') as Lang | null
    if (saved) {
      set({ language: saved })
    }
  },
}))