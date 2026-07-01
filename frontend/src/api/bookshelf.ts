// 书架 —— localStorage 按 userId 隔离
import { loadFromLS, saveToLS, uid, NOVELS, getChapters } from '@/data/localData'
import type { Bookshelf, ApiResult } from '@/types'

function key(userId: number) { return `novel-bookshelf-${userId}` }

function getAll(userId: number): Bookshelf[] {
  return loadFromLS<Bookshelf[]>(key(userId), [])
}

function save(userId: number, data: Bookshelf[]) { saveToLS(key(userId), data) }

export const bookshelfApi = {
  list: async (userId: number, category?: string) => {
    let all = getAll(userId)
    // 补充小说最新信息
    all = all.map(b => {
      const novel = NOVELS.find(n => n.id === b.novelId)
      const chs = getChapters(b.novelId)
      const latestChapter = chs[chs.length - 1]
      return {
        ...b,
        novelTitle: novel?.title || b.novelTitle,
        novelCover: novel?.cover || b.novelCover,
        novelAuthor: novel?.author || '',
        latestChapterTitle: latestChapter?.title,
        latestChapterNo: latestChapter?.chapterNo,
      }
    })
    const filtered = category ? all.filter(b => b.category === category) : all
    return { data: { code: 200, message: 'ok', data: filtered } as ApiResult<Bookshelf[]> }
  },

  add: async (userId: number, novelId: number) => {
    const all = getAll(userId)
    if (all.find(b => b.novelId === novelId)) {
      return { data: { code: 400, message: '已在书架中', data: null } }
    }
    const novel = NOVELS.find(n => n.id === novelId)
    const newItem: Bookshelf = {
      id: uid(), novelId,
      novelTitle: novel?.title || '', novelCover: novel?.cover || '',
      novelAuthor: novel?.author || '',
      category: 'WANT_READ', progress: '',
    }
    save(userId, [newItem, ...all])
    return { data: { code: 200, message: '已加入书架', data: null } }
  },

  update: async (userId: number, id: number, category: Bookshelf['category']) => {
    const all = getAll(userId).map(b => b.id === id ? { ...b, category } : b)
    save(userId, all)
    return { data: { code: 200, message: 'ok', data: null } }
  },

  remove: async (userId: number, novelId: number) => {
    const all = getAll(userId).filter(b => b.novelId !== novelId)
    save(userId, all)
    return { data: { code: 200, message: '已移除', data: null } }
  },
}
