import request from './request'
import type { Comment, PageResult, ApiResult } from '@/types'

export const commentApi = {
  list: (novelId: number, page = 1, pageSize = 10) =>
    request.get<ApiResult<PageResult<Comment>>>(`/novels/${novelId}/comments`, { params: { page, pageSize } }),

  add: (novelId: number, content: string, parentId?: number) =>
    request.post<ApiResult<null>>(`/novels/${novelId}/comments`, { content, parentId }),

  like: (commentId: number) =>
    request.post<ApiResult<null>>(`/comments/${commentId}/like`),
}
