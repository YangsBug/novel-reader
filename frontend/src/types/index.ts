export interface User {
  id: number
  username: string
  email: string
  avatar: string
  nickname: string
  gender: number
  intro: string
  status: number
  createTime: string
}

export interface Novel {
  id: number
  title: string
  author: string
  cover: string
  intro: string
  wordCount: number
  status: string
  clickCount: number
  collectCount: number
  updateTime: string
  categories: string[]
  latestChapter?: string
  latestChapterId?: number
}

export interface Chapter {
  id: number
  novelId: number
  title: string
  content?: string
  wordCount: number
  chapterNo: number
  prevId?: number
  prevTitle?: string
  nextId?: number
  nextTitle?: string
}

export interface Category {
  id: number
  name: string
  sort: number
}

export interface Bookshelf {
  id: number
  novelId: number
  novelTitle: string
  novelCover: string
  novelAuthor: string
  novelStatus?: string
  category: 'READING' | 'WANT_READ' | 'READ'
  latestChapterNo?: number
  latestChapterTitle?: string
  progress?: string
  progressChapterNo?: number
  progressChapterId?: number
  firstChapterId?: number
}

export interface Comment {
  id: number
  userId: number
  username: string
  avatar: string
  novelId: number
  content: string
  likeCount: number
  liked: boolean
  parentId?: number
  createTime: string
  replies?: Comment[]
}

export interface Bookmark {
  id: number
  userId: number
  novelId: number
  chapterId: number
  chapterNo: number
  pageOffset: number
  note: string
  createTime: string
}

export interface ReadingProgress {
  id: number
  userId: number
  novelId: number
  chapterId: number
  chapterNo: number
  pageOffset: number
  updateTime: string
}

export interface PageResult<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
  totalPages?: number
}

export interface ApiResult<T> {
  code: number
  message: string
  data: T
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  userId: string
  username: string
  avatar: string
}

export interface ReaderSettings {
  fontSize: number
  lineHeight: number
  theme: 'light' | 'cream' | 'dark' | 'green'
  brightness: number
  pageMode: 'scroll' | 'flip'
}
