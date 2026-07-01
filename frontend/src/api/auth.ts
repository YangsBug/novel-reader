// 纯前端认证 —— localStorage 存储用户
import { loadFromLS, saveToLS, uid } from '@/data/localData'
import type { User, ApiResult } from '@/types'

interface StoredUser {
  id: number; username: string; password: string
  nickname: string; avatar: string; intro: string
}

function getUsers(): StoredUser[] {
  return loadFromLS<StoredUser[]>('novel-users', [])
}

function saveUsers(users: StoredUser[]) {
  saveToLS('novel-users', users)
}

export const authApi = {
  login: async (username: string, password: string): Promise<ApiResult<{ accessToken: string; userId: number; username: string; avatar: string }>> => {
    const users = getUsers()
    const user = users.find(u => u.username === username && u.password === password)
    if (!user) return { code: 401, message: '用户名或密码错误', data: null as unknown as any }
    const token = btoa(`${user.id}:${Date.now()}`)
    return { code: 200, message: '登录成功', data: { accessToken: token, userId: user.id, username: user.username, avatar: user.avatar } }
  },

  register: async (username: string, password: string): Promise<ApiResult<{ accessToken: string; userId: number; username: string; avatar: string }>> => {
    const users = getUsers()
    if (users.find(u => u.username === username)) {
      return { code: 400, message: '用户名已存在', data: null as unknown as any }
    }
    const newUser: StoredUser = { id: uid(), username, password, nickname: username, avatar: '', intro: '' }
    saveUsers([...users, newUser])
    const token = btoa(`${newUser.id}:${Date.now()}`)
    return { code: 200, message: '注册成功', data: { accessToken: token, userId: newUser.id, username: newUser.username, avatar: newUser.avatar } }
  },
}
