import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { novelApi } from '@/api/novel'
import NovelCard from '@/components/common/NovelCard'
import Loading from '@/components/common/Loading'

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const q = searchParams.get('q') || ''
  const [input, setInput] = useState(q)
  const [page, setPage] = useState(1)

  useEffect(() => { setInput(q); setPage(1) }, [q])

  const { data, isLoading } = useQuery({
    queryKey: ['search', q, page],
    queryFn: () => novelApi.list({ page, pageSize: 20, keyword: q }).then(r => r.data.data),
    enabled: !!q,
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) { setSearchParams({ q: input.trim() }); setPage(1) }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto">
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-3">
          <input value={input} onChange={e => setInput(e.target.value)} placeholder="搜索小说名或作者..." className="input-field flex-1" />
          <button type="submit" className="btn-primary">搜索</button>
        </div>
      </form>

      {!q ? (
        <div className="text-center py-20 text-sm" style={{ color: 'var(--text-muted)' }}>输入关键字搜索小说</div>
      ) : isLoading ? <Loading /> : data?.list?.length === 0 ? (
        <div className="text-center py-20 text-sm" style={{ color: 'var(--text-muted)' }}>未找到相关小说</div>
      ) : (
        <>
          <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>找到 {data?.total} 个结果</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {data?.list?.map((novel, i) => (
              <motion.div key={novel.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                <NovelCard novel={novel} />
              </motion.div>
            ))}
          </div>
        </>
      )}
    </motion.div>
  )
}
