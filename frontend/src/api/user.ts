import request from './request'
import type { User, ApiResult } from '@/types'

export const userApi = {
  profile: () => request.get<ApiResult<User>>('/user/profile'),

  update: (data: Partial<User>) => request.put<ApiResult<null>>('/user/profile', data),

  stats: () => request.get<ApiResult<{
    totalBooks: number
    readingBooks: number
    finishedBooks: number
    wantBooks: number
  }>>('/user/stats'),
}
