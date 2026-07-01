import { getChapterDirectory, getChapter } from '@/data/localData'
import type { Chapter, ApiResult } from '@/types'

export const chapterApi = {
  directory: async (novelId: number) => {
    const dir = getChapterDirectory(novelId)
    return { data: { code: 200, message: 'ok', data: dir } }
  },

  content: async (novelId: number, chapterId: number) => {
    const ch = getChapter(novelId, chapterId)
    return { data: { code: ch ? 200 : 404, message: ch ? 'ok' : '章节不存在', data: ch || null } }
  },
}
