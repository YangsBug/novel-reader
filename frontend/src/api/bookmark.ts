import request from './request'
import type { Bookmark, ApiResult } from '@/types'

export const bookmarkApi = {
  list: (novelId: number) =>
    request.get<ApiResult<Bookmark[]>>('/bookmarks', { params: { novelId } }),

  add: (data: { novelId: number; chapterId: number; chapterNo: number; pageOffset: number; note?: string }) =>
    request.post<ApiResult<null>>('/bookmarks', data),

  remove: (id: number) =>
    request.delete<ApiResult<null>>(`/bookmarks/${id}`),
}
