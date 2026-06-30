import request from './request'
import type { Bookshelf, ApiResult } from '@/types'

export const bookshelfApi = {
  list: (category?: string) =>
    request.get<ApiResult<Bookshelf[]>>('/bookshelf', { params: { category } }),

  add: (novelId: number) =>
    request.post<ApiResult<null>>('/bookshelf', { novelId }),

  update: (id: number, category: string) =>
    request.put<ApiResult<null>>(`/bookshelf/${id}`, { category }),

  remove: (novelId: number) =>
    request.delete<ApiResult<null>>(`/bookshelf/${novelId}`),
}
