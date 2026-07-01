import { NOVELS, CATEGORIES } from '@/data/localData'
import type { Novel, Category, PageResult, ApiResult } from '@/types'

export const novelApi = {
  list: async (params: { page?: number; pageSize?: number; categoryId?: number; keyword?: string; sort?: string }) => {
    const { page = 1, pageSize = 20, categoryId, keyword, sort } = params
    let list = [...NOVELS]

    if (categoryId) {
      const catName = CATEGORIES.find(c => c.id === categoryId)?.name
      if (catName) list = list.filter(n => n.categories?.includes(catName))
    }
    if (keyword) {
      const kw = keyword.toLowerCase()
      list = list.filter(n => n.title.toLowerCase().includes(kw) || n.author.toLowerCase().includes(kw))
    }
    if (sort === 'hot') list.sort((a, b) => (b.clickCount || 0) - (a.clickCount || 0))
    else if (sort === 'new') list.sort((a, b) => b.id - a.id)
    else if (sort === 'collect') list.sort((a, b) => (b.collectCount || 0) - (a.collectCount || 0))

    const total = list.length
    const start = (page - 1) * pageSize
    const paged = list.slice(start, start + pageSize)

    const result: PageResult<Novel> = { list: paged, total, page, pageSize, totalPages: Math.ceil(total / pageSize) }
    return { data: { code: 200, message: 'ok', data: result } }
  },

  detail: async (id: number) => {
    const novel = NOVELS.find(n => n.id === id)
    return { data: { code: novel ? 200 : 404, message: novel ? 'ok' : '未找到', data: novel || null } }
  },

  hot: async () => {
    const sorted = [...NOVELS].sort((a, b) => (b.clickCount || 0) - (a.clickCount || 0)).slice(0, 6)
    return { data: { code: 200, message: 'ok', data: sorted } }
  },

  categories: async () => {
    return { data: { code: 200, message: 'ok', data: CATEGORIES } }
  },
}
