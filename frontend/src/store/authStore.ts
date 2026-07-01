import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authApi } from '@/api/auth'
import { userApi } from '@/api/user'
import type { User } from '@/types'

interface AuthState {
  user: User | null
  token: string | null
  isLoggedIn: boolean
  isLoading: boolean
  init: () => Promise<void>
  login: (username: string, password: string) => Promise<void>
  register: (username: string, password: string) => Promise<void>
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoggedIn: false,
      isLoading: true,

      init: async () => {
        const user = get().user
        if (user) {
          try {
            const res = await userApi.profile(user.id)
            if (res.data.code === 200) {
              set({ isLoggedIn: true, isLoading: false })
            } else {
              set({ user: null, token: null, isLoggedIn: false, isLoading: false })
            }
          } catch {
            set({ user: null, token: null, isLoggedIn: false, isLoading: false })
          }
        } else {
          set({ isLoading: false })
        }
      },

      login: async (username: string, password: string) => {
        const res = await authApi.login(username, password)
        if (res.code !== 200 || !res.data) throw new Error(res.message || '登录失败')
        const { accessToken, userId } = res.data
        set({
          token: accessToken,
          user: {
            id: userId, username, email: username,
            avatar: '', nickname: username,
            gender: 0, intro: '', status: 1, createTime: new Date().toISOString(),
          },
          isLoggedIn: true,
        })
      },

      register: async (username: string, password: string) => {
        const res = await authApi.register(username, password)
        if (res.code !== 200 || !res.data) throw new Error(res.message || '注册失败')
        const { accessToken, userId } = res.data
        set({
          token: accessToken,
          user: {
            id: userId, username, email: username,
            avatar: '', nickname: username,
            gender: 0, intro: '', status: 1, createTime: new Date().toISOString(),
          },
          isLoggedIn: true,
        })
      },

      logout: () => set({ user: null, token: null, isLoggedIn: false }),
    }),
    {
      name: 'novel-auth',
      partialize: (state) => ({ isLoggedIn: state.isLoggedIn, user: state.user, token: state.token }),
    }
  )
)
