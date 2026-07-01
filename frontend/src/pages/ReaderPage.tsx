import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { chapterApi } from '@/api/chapter'
import { readingApi } from '@/api/reading'
import { bookmarkApi } from '@/api/bookmark'
import { useReaderStore } from '@/store/readerStore'
import { useAuthStore } from '@/store/authStore'
import Loading from '@/components/common/Loading'
import type { Chapter, Bookmark } from '@/types'

export default function ReaderPage() {
  const { novelId, chapterId } = useParams<{ novelId: string; chapterId: string }>()
  const navigate = useNavigate()
  const scrollRef = useRef<HTMLDivElement>(null)
  const { settings, setFontSize, setLineHeight, setTheme, setBrightness, directoryOpen, setDirectoryOpen, settingsOpen, setSettingsOpen } = useReaderStore()
  const { isLoggedIn, user } = useAuthStore()
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [bookmarkOpen, setBookmarkOpen] = useState(false)
  const uid = user?.id || 0

  const nid = Number(novelId)
  const cid = Number(chapterId)

  const { data: chapter, isLoading } = useQuery({
    queryKey: ['chapter', novelId, chapterId],
    queryFn: () => chapterApi.content(nid, cid).then(r => r.data.data),
    enabled: !!novelId && !!chapterId,
  })

  const { data: directory } = useQuery({
    queryKey: ['directory', novelId],
    queryFn: () => chapterApi.directory(nid).then(r => r.data.data),
    enabled: !!novelId,
  })

  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = 0 }, [chapterId])

  const saveProgress = useCallback(() => {
    if (!isLoggedIn || !chapter || uid === 0) return
    readingApi.save(uid, {
      novelId: nid, chapterId: chapter.id,
      chapterNo: chapter.chapterNo || 0,
      pageOffset: scrollRef.current ? Math.floor(scrollRef.current.scrollTop / window.innerHeight) : 0
    }).catch(() => {})
  }, [isLoggedIn, chapter, nid, uid])

  useEffect(() => {
    const timer = setInterval(saveProgress, 30000)
    return () => clearInterval(timer)
  }, [saveProgress])

  useEffect(() => {
    if (!isLoggedIn || !novelId || uid === 0) return
    bookmarkApi.list(uid, nid).then(r => {
      if (r.data?.data) setBookmarks(r.data.data)
    }).catch(() => {})
  }, [isLoggedIn, novelId, uid, nid])

  const addBookmark = async () => {
    if (!isLoggedIn) { toast.error('请先登录'); return }
    if (!chapter) return
    await bookmarkApi.add(uid, { novelId: nid, chapterId: chapter.id, chapterNo: chapter.chapterNo || 0, pageOffset: scrollRef.current?.scrollTop || 0 })
    toast.success('已添加书签')
    const r = await bookmarkApi.list(uid, nid)
    if (r.data?.data) setBookmarks(r.data.data)
  }

  const deleteBookmark = async (id: number) => {
    await bookmarkApi.remove(uid, id)
    toast.success('书签已删除')
    setBookmarks(prev => prev.filter(b => b.id !== id))
  }

  const goToChapter = (ch: { id: number }) => navigate(`/reader/${novelId}/${ch.id}`)

  if (!chapter && !isLoading) return <div className="flex items-center justify-center h-screen" style={{ color: 'var(--text-muted)' }}>章节不存在</div>

  const themeClass = `reader-content theme-${settings.theme}`
  const brightness = settings.brightness / 100
  const toolbarBg = settings.theme === 'dark' ? 'rgba(10,10,15,0.9)' : settings.theme === 'light' ? 'rgba(245,240,232,0.9)' : settings.theme === 'cream' ? 'rgba(250,244,232,0.9)' : 'rgba(232,245,233,0.9)'
  const toolbarBorder = settings.theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.1)'
  const toolbarText = settings.theme === 'dark' ? '#94a3b8' : '#666'
  const toolbarTextHover = settings.theme === 'dark' ? '#fff' : '#333'

  return (
    <div className="h-screen flex flex-col" style={{ filter: `brightness(${brightness})` }}>
      <div className="h-14 flex items-center justify-between px-4 shrink-0 z-20" style={{ background: toolbarBg, borderBottom: `1px solid ${toolbarBorder}`, backdropFilter: 'blur(12px)' }}>
        <Link to={`/novel/${novelId}`} className="transition-colors text-sm flex items-center gap-2" style={{ color: toolbarText }}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>返回
        </Link>
        <span className="text-sm font-medium truncate mx-4" style={{ color: toolbarTextHover }}>{chapter?.title || '加载中...'}</span>
        <div className="flex items-center gap-2">
          <button onClick={() => setBookmarkOpen(!bookmarkOpen)} className="p-2" title="书签" style={{ color: toolbarText }}>🔖</button>
          <button onClick={() => setSettingsOpen(!settingsOpen)} className="p-2" title="设置" style={{ color: toolbarText }}>⚙️</button>
        </div>
      </div>

      <div className="flex-1 relative overflow-hidden">
        <div ref={scrollRef} className={`h-full overflow-y-auto ${themeClass}`} style={{ scrollBehavior: 'smooth', overscrollBehavior: 'contain' }}>
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-2xl mx-auto px-6 pt-10">
                <Loading text="加载章节内容..." />
              </motion.div>
            ) : (
              <motion.div key={chapterId} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.25 }} className="max-w-2xl mx-auto px-6 pt-10 pb-24">
                <h2 className="text-xl font-bold text-center mb-8">{chapter!.title}</h2>
                <div style={{ fontSize: settings.fontSize, lineHeight: settings.lineHeight }}>
                  {chapter!.content?.split('\n').filter(Boolean).map((p: string, i: number) => <p key={i}>{p.trim()}</p>)}
                </div>
                <div className="flex justify-between mt-12 pt-8" style={{ borderTop: `1px solid ${toolbarBorder}` }}>
                  {chapter!.prevId ? <button onClick={() => goToChapter({ id: chapter!.prevId! })} className="btn-ghost text-sm">← 上一章</button> : <div />}
                  {chapter!.nextId ? <button onClick={() => goToChapter({ id: chapter!.nextId! })} className="btn-ghost text-sm">下一章 →</button> : <div />}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="h-12 flex items-center justify-center gap-6 shrink-0 z-20" style={{ background: toolbarBg, borderTop: `1px solid ${toolbarBorder}`, backdropFilter: 'blur(12px)' }}>
        <button onClick={() => setDirectoryOpen(!directoryOpen)} className="px-3 text-xs" style={{ color: toolbarText }}>📑 目录</button>
        <div className="flex items-center gap-3">
          <button onClick={() => setTheme(settings.theme === 'dark' ? 'light' : settings.theme === 'light' ? 'cream' : settings.theme === 'cream' ? 'green' : 'dark')} className="text-xs" style={{ color: toolbarText }}>
            {{ dark: '🌙 夜间', light: '☀️ 日间', cream: '📜 米黄', green: '🌿 护眼' }[settings.theme]}
          </button>
          <button onClick={() => setFontSize(settings.fontSize === 14 ? 18 : settings.fontSize === 18 ? 22 : 14)} className="text-xs" style={{ color: toolbarText }}>A<sup>{settings.fontSize <= 14 ? '-' : '+'}</sup></button>
        </div>
        <button onClick={addBookmark} className="px-3 text-xs" style={{ color: toolbarText }}>🔖 书签</button>
      </div>

      <AnimatePresence>
        {directoryOpen && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setDirectoryOpen(false)} />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25 }}
              className="fixed right-0 top-0 bottom-0 w-80 max-w-[85vw] z-40 overflow-y-auto" style={{ background: 'var(--bg-card)', borderLeft: '1px solid var(--border)' }}>
              <div className="p-4" style={{ borderBottom: '1px solid var(--border)' }}>
                <h3 className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>目录</h3>
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>共 {directory?.length || 0} 章</p>
              </div>
              <div className="p-2">
                {directory?.map((ch: any) => (
                  <button key={ch.id} onClick={() => { goToChapter(ch); setDirectoryOpen(false) }}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm" style={ch.id === cid ? { background: 'var(--tag-bg)', color: 'var(--accent-primary)' } : { color: 'var(--text-secondary)' }}>
                    {ch.title}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {settingsOpen && (
        <div className="fixed bottom-16 left-1/2 -translate-x-1/2 w-72 rounded-2xl p-5 z-40" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }}>
          <div className="flex items-center justify-between mb-4"><h3 className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>阅读设置</h3><button onClick={() => setSettingsOpen(false)} style={{ color: 'var(--text-muted)' }}>✕</button></div>
          <div className="mb-3"><label className="text-xs" style={{ color: 'var(--text-secondary)' }}>字号</label><input type="range" min={12} max={28} value={settings.fontSize} onChange={e => setFontSize(Number(e.target.value))} className="w-full mt-1" style={{ accentColor: 'var(--accent-primary)' }} /></div>
          <div className="mb-3"><label className="text-xs" style={{ color: 'var(--text-secondary)' }}>行间距</label><input type="range" min={1.5} max={3} step={0.1} value={settings.lineHeight} onChange={e => setLineHeight(Number(e.target.value))} className="w-full mt-1" style={{ accentColor: 'var(--accent-primary)' }} /></div>
          <div className="mb-3"><label className="text-xs" style={{ color: 'var(--text-secondary)' }}>亮度</label><input type="range" min={50} max={150} value={settings.brightness} onChange={e => setBrightness(Number(e.target.value))} className="w-full mt-1" style={{ accentColor: 'var(--accent-primary)' }} /></div>
          <div className="flex gap-2">
            {(['dark', 'light', 'cream', 'green'] as const).map(t => (
              <button key={t} onClick={() => setTheme(t)} className="flex-1 py-2 rounded-lg text-xs font-medium"
                style={settings.theme === t ? { background: 'var(--accent-primary)', color: 'white' } : { background: 'var(--bg-hover)', color: 'var(--text-secondary)' }}>
                {{ dark: '夜间', light: '日间', cream: '米黄', green: '护眼' }[t]}
              </button>
            ))}
          </div>
        </div>
      )}

      <AnimatePresence>
        {bookmarkOpen && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setBookmarkOpen(false)} />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25 }}
              className="fixed right-0 top-0 bottom-0 w-80 max-w-[85vw] z-40 overflow-y-auto" style={{ background: 'var(--bg-card)', borderLeft: '1px solid var(--border)' }}>
              <div className="p-4" style={{ borderBottom: '1px solid var(--border)' }}><h3 className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>我的书签</h3></div>
              <div className="p-2">
                {bookmarks.length === 0 ? <p className="text-xs p-4 text-center" style={{ color: 'var(--text-muted)' }}>暂无书签</p> :
                  bookmarks.map(bm => (
                    <div key={bm.id} className="flex items-center justify-between px-3 py-2 rounded-lg text-sm">
                      <button onClick={() => { goToChapter({ id: bm.chapterId }); setBookmarkOpen(false) }} style={{ color: 'var(--text-secondary)' }}>
                        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>第{bm.chapterNo}章</span>
                        {bm.note && <p className="text-xs mt-0.5" style={{ color: 'var(--accent-primary)' }}>{bm.note}</p>}
                      </button>
                      <button onClick={() => deleteBookmark(bm.id)} className="text-red-500 text-xs">删除</button>
                    </div>
                  ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
