import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ReaderSettings } from '@/types'

interface ReaderState {
  settings: ReaderSettings
  setFontSize: (size: number) => void
  setLineHeight: (h: number) => void
  setTheme: (theme: ReaderSettings['theme']) => void
  setBrightness: (b: number) => void
  setPageMode: (mode: 'scroll' | 'flip') => void
  directoryOpen: boolean
  setDirectoryOpen: (open: boolean) => void
  settingsOpen: boolean
  setSettingsOpen: (open: boolean) => void
}

export const useReaderStore = create<ReaderState>()(
  persist(
    (set) => ({
      settings: { fontSize: 18, lineHeight: 2, theme: 'dark', brightness: 100, pageMode: 'scroll' },
      setFontSize: (s) => set((st) => ({ settings: { ...st.settings, fontSize: s } })),
      setLineHeight: (h) => set((st) => ({ settings: { ...st.settings, lineHeight: h } })),
      setTheme: (t) => set((st) => ({ settings: { ...st.settings, theme: t } })),
      setBrightness: (b) => set((st) => ({ settings: { ...st.settings, brightness: b } })),
      setPageMode: (m) => set((st) => ({ settings: { ...st.settings, pageMode: m } })),
      directoryOpen: false,
      setDirectoryOpen: (o) => set({ directoryOpen: o }),
      settingsOpen: false,
      setSettingsOpen: (o) => set({ settingsOpen: o }),
    }),
    { name: 'novel-reader-settings' }
  )
)
