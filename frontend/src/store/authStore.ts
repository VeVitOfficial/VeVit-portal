import { create } from 'zustand'

interface User {
  id: number
  nickname: string
  email: string
  avatar_url?: string
  level: number
  xp: number
  tier?: string
  privacy?: boolean
}

interface AuthState {
  user: User | null
  isLoggedIn: boolean
  setUser: (user: User | null) => void
  logout: () => void
  init: () => void
}

function parseAuthCookie(): User | null {
  try {
    const value = `; ${document.cookie}`
    const parts = value.split('; vevit_auth=')
    if (parts.length === 2) {
      const cookieValue = parts.pop()?.split(';').shift()
      if (cookieValue) {
        return JSON.parse(decodeURIComponent(cookieValue))
      }
    }
  } catch {
    // Cookie not present or invalid
  }
  return null
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoggedIn: false,

  setUser: (user) => set({ user, isLoggedIn: !!user }),

  logout: () => {
    document.cookie = 'vevit_auth=; path=/; domain=.vevit.fun; max-age=0'
    document.cookie = 'vevit_auth=; path=/; max-age=0'
    set({ user: null, isLoggedIn: false })
  },

  init: () => {
    const user = parseAuthCookie()
    if (user) {
      set({ user, isLoggedIn: true })
    }
  },
}))