// 用户信息 —— localStorage 存储
import { loadFromLS, saveToLS } from '@/data/localData'
import type { User, ApiResult } from '@/types'

interface StoredUser {
  id: number; username: string; password: string
  nickname: string; avatar: string; intro: string
}

function getUsers(): StoredUser[] { return loadFromLS<StoredUser[]>('novel-users', []) }
function saveUsers(u: StoredUser[]) { saveToLS('novel-users', u) }

export const userApi = {
  profile: async (userId: number) => {
    const u = getUsers().find(u => u.id === userId)
    if (!u) return { data: { code: 404, message: '用户不存在', data: null } }
    const user: User = { id: u.id, username: u.username, email: u.username, avatar: u.avatar, nickname: u.nickname, gender: 0, intro: u.intro, status: 1, createTime: '' }
    return { data: { code: 200, message: 'ok', data: user } }
  },

  update: async (userId: number, data: { nickname?: string; avatar?: string; gender?: number; intro?: string }) => {
    const users = getUsers()
    const idx = users.findIndex(u => u.id === userId)
    if (idx >= 0) {
      const cur = users[idx]
      if (data.nickname !== undefined) cur.nickname = data.nickname
      if (data.avatar !== undefined) cur.avatar = data.avatar
      if (data.intro !== undefined) cur.intro = data.intro
      users[idx] = cur
      saveUsers(users)
    }
    return { data: { code: 200, message: 'ok', data: null } }
  },

  stats: async (userId: number) => {
    const bookshelf = loadFromLS<any[]>(`novel-bookshelf-${userId}`, [])
    return {
      data: {
        code: 200, message: 'ok',
        data: {
          totalBooks: bookshelf.length,
          readingBooks: bookshelf.filter((b: any) => b.category === 'READING').length,
          finishedBooks: bookshelf.filter((b: any) => b.category === 'READ').length,
          wantBooks: bookshelf.filter((b: any) => b.category === 'WANT_READ').length,
        }
      }
    }
  },
}
