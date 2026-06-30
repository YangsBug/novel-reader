import request from './request'
import type { LoginResponse, ApiResult } from '@/types'

export const authApi = {
  login: (username: string, password: string) =>
    request.post<ApiResult<LoginResponse>>('/auth/login', { username, password }),

  register: (username: string, password: string, email?: string) =>
    request.post<ApiResult<LoginResponse>>('/auth/register', { username, password, email }),

  sendCode: (email: string) =>
    request.post<ApiResult<null>>('/auth/send-code', { email }),

  refresh: (refreshToken: string) =>
    request.post<ApiResult<{ accessToken: string; refreshToken: string }>>('/auth/refresh', { refreshToken }),
}
