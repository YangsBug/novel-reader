import { loadFromLS, saveToLS, uid } from '@/data/localData'
import type { Bookmark, ApiResult } from '@/types'

function key(userId: number) { return `novel-bookmarks-${userId}` }

function getAll(userId: number): Bookmark[] {
  return loadFromLS<Bookmark[]>(key(userId), [])
}

export const bookmarkApi = {
  list: async (userId: number, novelId?: number) => {
    let all = getAll(userId)
    if (novelId) all = all.filter(b => b.novelId === novelId)
    return { data: { code: 200, message: 'ok', data: all } as ApiResult<Bookmark[]> }
  },

  add: async (userId: number, data: { novelId: number; chapterId: number; chapterNo: number; pageOffset: number; note?: string }) => {
    const all = getAll(userId)
    const newB: Bookmark = { id: uid(), userId, ...data, note: data.note || '', createTime: new Date().toISOString() }
    saveToLS(key(userId), [newB, ...all])
    return { data: { code: 200, message: '已添加书签', data: null } }
  },

  remove: async (userId: number, id: number) => {
    const all = getAll(userId).filter(b => b.id !== id)
    saveToLS(key(userId), all)
    return { data: { code: 200, message: '已删除', data: null } }
  },
}
