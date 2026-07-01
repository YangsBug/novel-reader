import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { bookshelfApi } from '@/api/bookshelf'
import { useAuthStore } from '@/store/authStore'
import Loading from '@/components/common/Loading'

export default function HistoryPage() {
  const navigate = useNavigate()
  const { isLoggedIn, user } = useAuthStore()

  const { data: books, isLoading } = useQuery({
    queryKey: ['bookshelf', 'READING'],
    queryFn: () => bookshelfApi.list(user!.id, 'READING').then(r => r.data.data),
    enabled: isLoggedIn,
  })

  if (!isLoggedIn) {
    navigate('/login', { replace: true })
    return null
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
        <span className="w-1 h-6 rounded-full" style={{ background: `linear-gradient(180deg, var(--accent-primary), var(--accent-secondary))` }} />
        阅读历史
      </h2>

      {isLoading ? <Loading /> : !books?.length ? (
        <div className="text-center py-20 text-sm" style={{ color: 'var(--text-muted)' }}>暂无阅读记录</div>
      ) : (
        <div className="space-y-3">
          {books.map((book, i) => (
            <motion.div key={book.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
              <div className="card p-4 flex items-center gap-4 transition-all">
                <Link to={`/novel/${book.novelId}`} className="shrink-0">
                  <img
                    src={book.novelCover || 'https://placehold.co/64x80/1e293b/64748b?text=暂无'}
                    alt={book.novelTitle}
                    className="w-16 h-20 rounded-lg object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = 'https://placehold.co/64x80/1e293b/64748b?text=暂无'
                    }}
                  />
                </Link>
                <Link to={`/novel/${book.novelId}`} className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{book.novelTitle}</h4>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{book.novelAuthor}</p>
                  {book.progress && <p className="text-xs mt-1" style={{ color: 'var(--accent-primary)' }}>读到 {book.progress}</p>}
                </Link>
                <Link
                  to={`/reader/${book.novelId}/${book.progressChapterId || book.firstChapterId || 1}`}
                  className="btn-primary text-xs px-3 py-1.5 shrink-0"
                >
                  继续读
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}
