import { Link } from 'react-router-dom'
import { useState, useRef } from 'react'
import type { Novel } from '@/types'

const fallbackBg = 'bg-gradient-to-br from-slate-300 to-slate-400'

export default function NovelCard({ novel }: { novel: Novel }) {
  const [imgError, setImgError] = useState(false)
  const cardRef = useRef<HTMLAnchorElement>(null)
  const [glowPos, setGlowPos] = useState({ x: -100, y: -100, active: false })

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    setGlowPos({ x: e.clientX - rect.left, y: e.clientY - rect.top, active: true })
  }

  const handleMouseLeave = () => setGlowPos(p => ({ ...p, active: false }))

  return (
    <Link
      to={`/novel/${novel.id}`}
      ref={cardRef}
      className="block group relative"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* 悬浮光效 */}
      <div
        className="absolute inset-0 rounded-xl pointer-events-none z-10 transition-opacity duration-300"
        style={{
          opacity: glowPos.active ? 1 : 0,
          background: `radial-gradient(300px circle at ${glowPos.x}px ${glowPos.y}px, rgba(var(--accent-primary-rgb, 59,130,246), 0.12), transparent 40%)`,
        }}
      />

      <div className="card p-3 hover:-translate-y-1 transition-transform duration-300">
        {/* 封面 */}
        <div className={`aspect-[3/4] rounded-lg mb-3 relative overflow-hidden ${(!novel.cover || imgError) ? fallbackBg : ''}`}>
          {novel.cover && !imgError ? (
            <img
              src={novel.cover}
              alt={novel.title}
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center" style={{ color: 'var(--text-muted)' }}>
              <span className="text-xs">{novel.title.slice(0, 4)}</span>
            </div>
          )}
          {/* 封面光泽划过 */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{ background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.15) 45%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.07) 55%, transparent 60%)' }} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
            <span className="text-xs text-white font-medium">{novel.status}</span>
          </div>
          <div className="absolute top-2 left-2">
            {novel.categories?.slice(0, 1).map(c => (
              <span key={c} className="tag text-[10px]">{c}</span>
            ))}
          </div>
        </div>
        {/* 信息 */}
        <h4 className="text-sm font-medium line-clamp-1 group-hover:text-[var(--accent-primary)] transition-colors" style={{ color: 'var(--text-primary)' }}>
          {novel.title}
        </h4>
        <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{novel.author}</p>
        {novel.latestChapter && (
          <p className="text-[10px] mt-1 line-clamp-1" style={{ color: 'var(--text-secondary)' }}>{novel.latestChapter}</p>
        )}
      </div>
    </Link>
  )
}
