import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { bookshelfApi } from '@/api/bookshelf'
import { useAuthStore } from '@/store/authStore'
import Loading from '@/components/common/Loading'

const tabs = [
  { key: '', label: '全部' },
  { key: 'READING', label: '在读' },
  { key: 'WANT_READ', label: '想读' },
  { key: 'READ', label: '已读' },
]

function getAccentRGB() {
  if (typeof window === 'undefined') return '59,130,246'
  const style = getComputedStyle(document.documentElement)
  const color = style.getPropertyValue('--accent-primary').trim()
  if (color.startsWith('#')) {
    const hex = color.slice(1)
    return `${parseInt(hex.slice(0, 2), 16)},${parseInt(hex.slice(2, 4), 16)},${parseInt(hex.slice(4, 6), 16)}`
  }
  return '59,130,246'
}

export default function BookshelfPage() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('')
  const queryClient = useQueryClient()
  const { isLoggedIn, user } = useAuthStore()

  const { data: books, isLoading } = useQuery({
    queryKey: ['bookshelf', tab],
    queryFn: () => bookshelfApi.list(user!.id, tab || undefined).then(r => r.data.data),
    enabled: isLoggedIn && !!user,
  })

  if (!isLoggedIn) { navigate('/login', { replace: true }); return null }

  const removeMut = useMutation({
    mutationFn: (novelId: number) => bookshelfApi.remove(user!.id, novelId),
    onSuccess: () => { toast.success('已移出书架'); queryClient.invalidateQueries({ queryKey: ['bookshelf'] }) },
  })

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
        <span className="w-1 h-6 rounded-full" style={{ background: `linear-gradient(180deg, var(--accent-primary), var(--accent-secondary))` }} />
        我的书架
      </h2>
      <div className="flex gap-3 mb-6">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className="px-4 py-1.5 text-sm rounded-full transition-all"
            style={tab === t.key ? { background: 'var(--accent-primary)', color: 'white' } : { border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
            {t.label}
          </button>
        ))}
      </div>
      {isLoading ? <Loading /> : !books?.length ? (
        <div className="text-center py-20">
          <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>书架空空如也</p>
          <Link to="/novels" className="btn-primary text-sm">去发现好书</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" style={{ perspective: '1200px' }}>
          {books.map((book: any, i: number) => (
            <motion.div key={book.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="group" style={{ transformStyle: 'preserve-3d' }}>
              <div className="card p-4 flex gap-4 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl"
                style={{ transformStyle: 'preserve-3d', transform: 'rotateX(2deg)', boxShadow: 'var(--card-shadow)' }}
                onMouseMove={e => {
                  const rect = e.currentTarget.getBoundingClientRect()
                  const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8
                  const y = ((e.clientY - rect.top) / rect.height - 0.5) * -8
                  e.currentTarget.style.transform = `rotateX(${2 + y}deg) rotateY(${x}deg)`
                  e.currentTarget.style.boxShadow = `0 12px 30px rgba(${getAccentRGB()},0.15)`
                }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'rotateX(2deg)'; e.currentTarget.style.boxShadow = 'var(--card-shadow)' }}>
                <Link to={`/novel/${book.novelId}`} className="shrink-0">
                  <div className="w-20 h-28 rounded-lg overflow-hidden bg-slate-200" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
                    {book.novelCover ? <img src={book.novelCover} alt={book.novelTitle} className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} /> : null}
                  </div>
                </Link>
                <div className="flex-1 min-w-0">
                  <Link to={`/novel/${book.novelId}`} className="text-sm font-medium line-clamp-1" style={{ color: 'var(--text-primary)' }}>{book.novelTitle}</Link>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{book.novelAuthor}</p>
                  {book.progress && <p className="text-xs mt-1" style={{ color: 'var(--accent-primary)' }}>{book.progress}</p>}
                  {book.latestChapterTitle && <p className="text-[10px] mt-1 line-clamp-1" style={{ color: 'var(--text-secondary)' }}>{book.latestChapterTitle}</p>}
                  <div className="flex gap-2 mt-3">
                    {book.latestChapterNo && <Link to={`/reader/${book.novelId}/${book.latestChapterNo}`} className="text-[10px] btn-primary py-1 px-3">继续阅读</Link>}
                    <button onClick={() => removeMut.mutate(book.novelId)} className="text-[10px] text-red-500 py-1 px-2">移除</button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}
