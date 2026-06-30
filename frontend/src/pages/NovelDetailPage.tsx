import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { novelApi } from '@/api/novel'
import { chapterApi } from '@/api/chapter'
import { bookshelfApi } from '@/api/bookshelf'
import { commentApi } from '@/api/comment'
import { readingApi } from '@/api/reading'
import { useAuthStore } from '@/store/authStore'
import Loading from '@/components/common/Loading'
import type { Comment } from '@/types'

export default function NovelDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { isLoggedIn, user } = useAuthStore()
  const queryClient = useQueryClient()
  const [commentText, setCommentText] = useState('')
  const [introExpanded, setIntroExpanded] = useState(false)
  const [replyTarget, setReplyTarget] = useState<number | null>(null)
  const [replyText, setReplyText] = useState('')

  const { data: novel, isLoading } = useQuery({
    queryKey: ['novel', id],
    queryFn: () => novelApi.detail(Number(id)).then(r => r.data.data),
    enabled: !!id,
  })

  const { data: directory } = useQuery({
    queryKey: ['directory', id],
    queryFn: () => chapterApi.directory(Number(id)).then(r => r.data.data),
    enabled: !!id,
  })

  const { data: comments, isLoading: commentsLoading } = useQuery({
    queryKey: ['comments', id],
    queryFn: () => commentApi.list(Number(id)).then(r => r.data.data),
    enabled: !!id,
  })

  const { data: progress } = useQuery({
    queryKey: ['progress', id],
    queryFn: () => readingApi.get(Number(id)).then(r => r.data.data),
    enabled: !!id && isLoggedIn,
  })

  const addShelfMut = useMutation({
    mutationFn: () => bookshelfApi.add(Number(id)),
    onSuccess: () => toast.success('已加入书架'),
    onError: (e: any) => toast.error(e.response?.data?.message || '添加失败'),
  })

  const commentMut = useMutation({
    mutationFn: ({ content, parentId }: { content: string; parentId?: number }) => commentApi.add(Number(id), content, parentId),
    onSuccess: (_data, vars) => {
      if (vars.parentId) {
        setReplyTarget(null)
        setReplyText('')
        toast.success('回复成功')
      } else {
        setCommentText('')
        toast.success('评论成功')
      }
      queryClient.invalidateQueries({ queryKey: ['comments', id] })
    },
    onError: (e: any) => toast.error(e.response?.data?.message || '操作失败'),
  })

  const likeMut = useMutation({
    mutationFn: (commentId: number) => commentApi.like(commentId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['comments', id] }),
    onError: (e: any) => toast.error(e.response?.data?.message || '操作失败'),
  })

  if (isLoading || !novel) return <Loading />

  const statusStyle = novel.status === '已完结'
    ? { color: '#16a34a', background: 'rgba(22,163,74,0.1)', borderColor: 'rgba(22,163,74,0.3)' }
    : { color: 'var(--accent-primary)', background: 'var(--tag-bg)', borderColor: 'var(--tag-border)' }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
      {/* 浮动返回按钮 */}
      <button
        onClick={() => navigate('/')}
        className="fixed top-24 left-8 w-11 h-11 rounded-full flex items-center justify-center z-50 transition-all duration-300 backdrop-blur-md border shadow-lg"
        style={{
          background: 'var(--bg-card)',
          borderColor: 'var(--border)',
          color: 'var(--text-primary)',
        }}
        title="返回首页"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
      </button>
      {/* 头部 */}
      <div className="flex flex-col sm:flex-row gap-8 mb-10">
        <div className="w-40 h-56 rounded-xl shrink-0 shadow-2xl overflow-hidden bg-slate-200">
          {novel.cover ? (
            <img src={novel.cover} alt={novel.title} className="w-full h-full object-cover"
              onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
          ) : null}
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap gap-2 mb-2">
            {novel.categories?.map((c: string) => <span key={c} className="tag-accent">{c}</span>)}
            <span className="text-xs px-2 py-0.5 rounded-full border" style={statusStyle}>{novel.status}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: 'var(--accent-primary)' }}>{novel.title}</h1>
          <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>{novel.author} · {novel.wordCount ? Math.floor(novel.wordCount / 10000) + '万字' : ''} · 🔥 {novel.clickCount?.toLocaleString()} · ⭐ {novel.collectCount?.toLocaleString()}</p>
          <div className={`text-sm leading-relaxed ${!introExpanded ? 'line-clamp-3' : ''}`} style={{ color: 'var(--text-secondary)' }}>
            {novel.intro}
          </div>
          {novel.intro && novel.intro.length > 100 && (
            <button onClick={() => setIntroExpanded(!introExpanded)} className="text-xs mt-1 hover:underline" style={{ color: 'var(--accent-primary)' }}>
              {introExpanded ? '收起' : '展开'}
            </button>
          )}
          <div className="flex gap-3 mt-5">
            {progress ? (
              <Link to={`/reader/${id}/${progress.chapterId}`} className="btn-primary text-sm">继续阅读 · 第{progress.chapterNo}章</Link>
            ) : directory && directory.length > 0 ? (
              <Link to={`/reader/${id}/${directory[0].id}`} className="btn-primary text-sm">开始阅读</Link>
            ) : null}
            <button onClick={() => { if (!isLoggedIn) { toast.error('请先登录'); return } addShelfMut.mutate() }} className="btn-outline text-sm">加入书架</button>
          </div>
        </div>
      </div>

      {/* 章节列表 */}
      <section className="mb-10">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <span className="w-1 h-5 rounded-full" style={{ background: `linear-gradient(180deg, var(--accent-primary), var(--accent-secondary))` }} />
          章节目录 <span className="text-sm font-normal" style={{ color: 'var(--text-muted)' }}>(共{directory?.length || 0}章)</span>
        </h3>
        <div className="card p-4 max-h-96 overflow-y-auto">
          {directory?.map((ch) => (
            <Link key={ch.id} to={`/reader/${id}/${ch.id}`} className="flex justify-between items-center py-2 border-b last:border-0 text-sm transition-colors"
              style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-primary)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}>
              <span className="truncate flex-1">{ch.title}</span>
              <span className="text-xs ml-2 shrink-0" style={{ color: 'var(--text-muted)' }}>{ch.wordCount}字</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 评论区 */}
      <section>
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <span className="w-1 h-5 rounded-full" style={{ background: `linear-gradient(180deg, var(--accent-primary), var(--accent-secondary))` }} />
          评论区 <span className="text-sm font-normal" style={{ color: 'var(--text-muted)' }}>({comments?.total || 0})</span>
        </h3>

        {isLoggedIn ? (
          <div className="card p-4 mb-6">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs text-white shrink-0"
                style={{ background: `linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))` }}>{user?.nickname?.[0]}</div>
              <div className="flex-1">
                <textarea value={commentText} onChange={e => setCommentText(e.target.value)} placeholder="写下你的评论..." className="input-field min-h-[80px] text-sm resize-none" />
                <button onClick={() => commentText.trim() && commentMut.mutate({ content: commentText.trim() })} disabled={!commentText.trim() || commentMut.isPending} className="btn-primary text-xs mt-2 px-4 py-1.5">
                  {commentMut.isPending ? '发表中...' : '发表'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="card p-6 text-center mb-6">
            <p className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>登录后即可发表评论</p>
            <Link to="/login" className="btn-primary text-xs">去登录</Link>
          </div>
        )}

        {commentsLoading ? <Loading /> : comments?.list?.map((comment: Comment) => (
          <div key={comment.id} className="card p-4 mb-3">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs text-white shrink-0">{comment.username[0]}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{comment.username}</span>
                  <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{new Date(comment.createTime).toLocaleDateString()}</span>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{comment.content}</p>
                <div className="flex items-center gap-4 mt-2">
                  <button onClick={() => { if (!isLoggedIn) { toast.error('请先登录'); return }; likeMut.mutate(comment.id) }}
                    className="text-xs flex items-center gap-1 transition-colors"
                    style={{ color: comment.liked ? 'var(--accent-primary)' : 'var(--text-muted)' }}>
                    <svg className="w-3.5 h-3.5" fill={comment.liked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2 0V12a2 2 0 012-2h2.5" /></svg>
                    {comment.likeCount || 0}
                  </button>
                  <button onClick={() => {
                    if (!isLoggedIn) { toast.error('请先登录'); return }
                    setReplyTarget(replyTarget === comment.id ? null : comment.id)
                    setReplyText('')
                  }}
                    className="text-xs transition-colors hover:underline"
                    style={{ color: replyTarget === comment.id ? 'var(--accent-primary)' : 'var(--text-muted)' }}>
                    回复
                  </button>
                </div>
                {/* 回复输入框 */}
                {replyTarget === comment.id && (
                  <div className="mt-3 flex gap-2">
                    <input
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                      placeholder={`回复 ${comment.username}...`}
                      className="input-field flex-1 text-xs py-1.5"
                      autoFocus
                      onKeyDown={e => {
                        if (e.key === 'Enter' && replyText.trim()) {
                          commentMut.mutate({ content: replyText.trim(), parentId: comment.id })
                        }
                        if (e.key === 'Escape') setReplyTarget(null)
                      }}
                    />
                    <button
                      onClick={() => replyText.trim() && commentMut.mutate({ content: replyText.trim(), parentId: comment.id })}
                      disabled={!replyText.trim() || commentMut.isPending}
                      className="btn-primary text-xs px-3 py-1.5 shrink-0"
                    >
                      发送
                    </button>
                  </div>
                )}
                {comment.replies?.map(reply => (
                  <div key={reply.id} className="mt-3 ml-4 pl-3 border-l-2" style={{ borderColor: 'var(--border)' }}>
                    <div className="flex gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-[10px] text-white shrink-0">{reply.username[0]}</div>
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{reply.username}</span>
                          <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{new Date(reply.createTime).toLocaleDateString()}</span>
                        </div>
                        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{reply.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </section>
    </motion.div>
  )
}
