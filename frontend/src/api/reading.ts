// 阅读进度 —— localStorage 按 userId 隔离
import { loadFromLS, saveToLS } from '@/data/localData'
import type { ReadingProgress, ApiResult } from '@/types'

function key(userId: number) { return `novel-progress-${userId}` }

export const readingApi = {
  save: async (userId: number, data: { novelId: number; chapterId: number; chapterNo: number; pageOffset: number }) => {
    const all = loadFromLS<ReadingProgress[]>(key(userId), [])
    const idx = all.findIndex(p => p.novelId === data.novelId)
    const entry: ReadingProgress = { id: Date.now(), userId, ...data, updateTime: new Date().toISOString() }
    if (idx >= 0) all[idx] = entry
    else all.push(entry)
    saveToLS(key(userId), all)
    return { data: { code: 200, message: 'ok', data: null } }
  },

  get: async (userId: number, novelId: number): Promise<{ data: ApiResult<ReadingProgress> }> => {
    const all = loadFromLS<ReadingProgress[]>(key(userId), [])
    const found = all.find(p => p.novelId === novelId)
    return { data: { code: found ? 200 : 404, message: 'ok', data: found || null as unknown as ReadingProgress } }
  },
}
