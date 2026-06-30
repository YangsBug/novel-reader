import request from './request'
import type { Chapter, ApiResult } from '@/types'

export const chapterApi = {
  directory: (novelId: number) =>
    request.get<ApiResult<Chapter[]>>(`/novels/${novelId}/chapters`),

  content: (novelId: number, chapterId: number) =>
    request.get<ApiResult<Chapter>>(`/novels/${novelId}/chapters/${chapterId}`),
}
