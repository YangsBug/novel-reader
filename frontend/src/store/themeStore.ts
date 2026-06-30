import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Theme = 'light' | 'mint'

interface ThemeState {
  theme: Theme
  toggle: () => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'light',
      toggle: () => {
        const next = get().theme === 'light' ? 'mint' : 'light'
        document.documentElement.className = `theme-${next}`
        set({ theme: next })
      }
    }),
    { name: 'novel-theme' }
  )
)
