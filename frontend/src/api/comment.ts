import { getGlobalComments, saveGlobalComments, uid } from '@/data/localData'
import type { Comment, PageResult, ApiResult } from '@/types'

export const commentApi = {
  list: async (novelId: number, page = 1, pageSize = 10, userId?: number) => {
    let all = getGlobalComments()
    // 加入 liked 状态
    const likedSet = new Set(loadLikes(userId || 0))
    all = all.map(c => ({ ...c, liked: likedSet.has(c.id) }))
    // 顶级评论 + 回复
    const parents = all.filter(c => c.novelId === novelId)
    parents.forEach(p => {
      p.replies = all.filter(c => c.parentId === p.id)
    })

    const total = parents.length
    const start = (page - 1) * pageSize
    const paged = parents.slice(start, start + pageSize)

    const result: PageResult<Comment> = { list: paged, total, page, pageSize, totalPages: Math.ceil(total / pageSize) }
    return { data: { code: 200, message: 'ok', data: result } }
  },

  add: async (novelId: number, content: string, userId: number, username: string, parentId?: number) => {
    const all = getGlobalComments()
    const newC: Comment = {
      id: uid(), userId, username, avatar: '',
      novelId, content, likeCount: 0, liked: false,
      parentId,
      createTime: new Date().toISOString(),
    }
    saveGlobalComments([...all, newC])
    return { data: { code: 200, message: '发表成功', data: null } }
  },

  like: async (commentId: number, userId: number) => {
    const likes = loadLikes(userId)
    const all = getGlobalComments()
    if (likes.has(commentId)) {
      likes.delete(commentId)
      const c = all.find(c => c.id === commentId)
      if (c && c.likeCount > 0) c.likeCount--
    } else {
      likes.add(commentId)
      const c = all.find(c => c.id === commentId)
      if (c) c.likeCount = (c.likeCount || 0) + 1
    }
    saveLikes(userId, likes)
    saveGlobalComments(all)
    return { data: { code: 200, message: 'ok', data: null } }
  },
}

function loadLikes(userId: number): Set<number> {
  try {
    const raw = localStorage.getItem(`novel-likes-${userId}`)
    return raw ? new Set(JSON.parse(raw)) : new Set()
  } catch { return new Set() }
}

function saveLikes(userId: number, set: Set<number>) {
  localStorage.setItem(`novel-likes-${userId}`, JSON.stringify([...set]))
}
