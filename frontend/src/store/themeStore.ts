import { create } from 'zustand'

type Theme = 'dark' | 'light'

interface ThemeState {
  theme: Theme
  clickCount: number
  isDisco: boolean
  toggle: () => void
  setTheme: (t: Theme) => void
  init: () => void
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: 'dark',
  clickCount: 0,
  isDisco: false,

  toggle: () => {
    const state = get()
    if (state.isDisco) return

    const newTheme = state.theme === 'dark' ? 'light' : 'dark'
    localStorage.setItem('vevit_theme', newTheme)

    const newCount = state.clickCount + 1
    if (newCount >= 16) {
      set({ isDisco: true, clickCount: 0, theme: 'dark' })
      document.body.classList.add('disco-mode')
      setTimeout(() => {
        set({ isDisco: false })
        document.body.classList.remove('disco-mode')
      }, 25000)
      return
    }

    set({ theme: newTheme, clickCount: newCount })
    setTimeout(() => set({ clickCount: 0 }), 2000)
  },

  setTheme: (t) => {
    localStorage.setItem('vevit_theme', t)
    set({ theme: t })
  },

  init: () => {
    const saved = localStorage.getItem('vevit_theme') as Theme | null
    if (saved) {
      set({ theme: saved })
    }
  },
}))