import request from './request'
import type { ReadingProgress, ApiResult } from '@/types'

export const readingApi = {
  save: (data: { novelId: number; chapterId: number; chapterNo: number; pageOffset: number }) =>
    request.post<ApiResult<null>>('/reading-progress', data),

  get: (novelId: number) =>
    request.get<ApiResult<ReadingProgress>>(`/reading-progress/${novelId}`),
}
