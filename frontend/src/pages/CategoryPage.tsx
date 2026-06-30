import { useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { novelApi } from '@/api/novel'
import NovelCard from '@/components/common/NovelCard'
import Loading from '@/components/common/Loading'

export default function CategoryPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const categoryId = searchParams.get('categoryId') ? Number(searchParams.get('categoryId')) : undefined
  const sort = searchParams.get('sort') || 'hot'
  const [page, setPage] = useState(1)

  const { data: cats } = useQuery({
    queryKey: ['categories'],
    queryFn: () => novelApi.categories().then(r => r.data.data),
  })

  const { data, isLoading } = useQuery({
    queryKey: ['novels', categoryId, sort, page],
    queryFn: () => novelApi.list({ page, pageSize: 20, categoryId, sort }).then(r => r.data.data),
  })

  const sortOptions = [
    { value: 'hot', label: '最热' },
    { value: 'new', label: '最新' },
    { value: 'collect', label: '最多收藏' },
  ]

  const pillClass = (active: boolean) => `px-4 py-2 rounded-full text-sm transition-all`
  const pillStyle = (active: boolean) => active
    ? { background: 'var(--accent-primary)', color: 'white' }
    : { border: '1px solid var(--border)', color: 'var(--text-secondary)' }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex flex-wrap items-center gap-4 mb-8">
        <div className="flex gap-2">
          <Link to="/novels" className={pillClass(!categoryId)} style={pillStyle(!categoryId)}>
            全部
          </Link>
          {cats?.map(cat => (
            <button
              key={cat.id}
              onClick={() => { setSearchParams(categoryId === cat.id ? {} : { categoryId: String(cat.id), sort }); setPage(1) }}
              className={pillClass(categoryId === cat.id)} style={pillStyle(categoryId === cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3 mb-6">
        {sortOptions.map(opt => (
          <button
            key={opt.value}
            onClick={() => { setSearchParams(categoryId ? { categoryId: String(categoryId), sort: opt.value } : { sort: opt.value }); setPage(1) }}
            className="text-xs px-3 py-1 rounded-md transition-all"
            style={sort === opt.value
              ? { background: 'var(--tag-bg)', color: 'var(--accent-primary)' }
              : { color: 'var(--text-muted)' }}>
            {opt.label}
          </button>
        ))}
      </div>

      {isLoading ? <Loading /> : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {data?.list?.map((novel, i) => (
              <motion.div key={novel.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                <NovelCard novel={novel} />
              </motion.div>
            ))}
          </div>
          {data && data.total > 20 && (
            <div className="flex justify-center gap-4 mt-8">
              <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="btn-ghost text-sm">上一页</button>
              <span className="text-sm self-center" style={{ color: 'var(--text-muted)' }}>{page} / {Math.ceil(data.total / 20)}</span>
              <button onClick={() => setPage(page + 1)} disabled={page >= Math.ceil(data.total / 20)} className="btn-ghost text-sm">下一页</button>
            </div>
          )}
        </>
      )}
    </motion.div>
  )
}
