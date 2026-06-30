import request from './request'
import type { Novel, Category, PageResult, ApiResult } from '@/types'

export const novelApi = {
  list: (params: { page?: number; pageSize?: number; categoryId?: number; keyword?: string; sort?: string }) =>
    request.get<ApiResult<PageResult<Novel>>>('/novels', { params }),

  detail: (id: number) =>
    request.get<ApiResult<Novel>>(`/novels/${id}`),

  hot: () =>
    request.get<ApiResult<Novel[]>>('/novels/hot'),

  categories: () =>
    request.get<ApiResult<Category[]>>('/categories'),
}
