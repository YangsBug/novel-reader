import { useQuery } from '@tanstack/react-query'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import { novelApi } from '@/api/novel'
import type { Swiper as SwiperType } from 'swiper'
import NovelCard from '@/components/common/NovelCard'
import Loading from '@/components/common/Loading'
import type { Category } from '@/types'

export default function HomePage() {
  const swiperRef = useRef<SwiperType | null>(null)
  const { data: hotData, isLoading: hotLoading } = useQuery({
    queryKey: ['hot-novels'],
    queryFn: () => novelApi.hot().then(r => r.data.data)
  })
  const { data: allData } = useQuery({
    queryKey: ['novels-recent'],
    queryFn: () => novelApi.list({ page: 1, pageSize: 24, sort: 'new' }).then(r => r.data.data)
  })
  const { data: catData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => novelApi.categories().then(r => r.data.data)
  })

  const categories: Category[] = catData || []
  const hot = hotData || []
  const novels = allData?.list || []

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      {/* Banner */}
      <section className="relative mb-10 overflow-hidden rounded-2xl gradient-border">
        {hotLoading ? <Loading /> : (
          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            autoplay={{ delay: 6000, disableOnInteraction: false, pauseOnMouseEnter: false }}
            pagination={{ clickable: true }}
            navigation={true}
            loop={hot.length > 3}
            onSwiper={(swiper) => { swiperRef.current = swiper }}
            className="rounded-2xl"
          >
            {hot.slice(0, 6).map((novel) => (
              <SwiperSlide key={novel.id}>
                <Link to={`/novel/${novel.id}`}>
                  <div className="relative h-[360px] flex items-center px-12 md:px-20 gap-8 md:gap-16"
                    style={{ background: `linear-gradient(135deg, var(--accent-primary)10, var(--bg-secondary))` }}>
                    <div className="absolute inset-0 overflow-hidden opacity-20">
                      <div className="absolute -top-20 -right-20 w-[500px] h-[500px] rounded-full blur-3xl"
                        style={{ background: `var(--accent-primary)` }} />
                    </div>
                    {/* 封面图片 */}
                    <div className="relative z-10 shrink-0 w-[140px] h-[200px] md:w-[170px] md:h-[240px] rounded-xl overflow-hidden shadow-2xl"
                      style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
                      <img
                        src={novel.cover}
                        alt={novel.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="relative z-10 max-w-2xl min-w-0">
                      <div className="flex gap-2 mb-3">
                        {novel.categories?.map(c => (
                          <span key={c} className="tag-accent">{c}</span>
                        ))}
                        <span className="text-xs px-2 py-0.5 rounded-full border"
                          style={{
                            color: novel.status === '已完结' ? '#16a34a' : 'var(--accent-primary)',
                            background: novel.status === '已完结' ? 'rgba(22,163,74,0.1)' : 'var(--tag-bg)',
                            borderColor: novel.status === '已完结' ? 'rgba(22,163,74,0.3)' : 'var(--tag-border)'
                          }}>
                          {novel.status}
                        </span>
                      </div>
                      <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>{novel.title}</h2>
                      <p className="text-sm mb-2" style={{ color: 'var(--text-muted)' }}>{novel.author} · {novel.wordCount ? Math.floor(novel.wordCount / 10000) + '万字' : ''}</p>
                      <p className="text-sm line-clamp-3 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{novel.intro}</p>
                      <div className="flex gap-4 mt-4 text-xs" style={{ color: 'var(--text-muted)' }}>
                        <span>🔥 {novel.clickCount?.toLocaleString()} 点击</span>
                        <span>⭐ {novel.collectCount?.toLocaleString()} 收藏</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
            <div className="swiper-button-prev" style={{ color: 'var(--text-primary)' }}
              onClick={() => swiperRef.current?.slidePrev()} />
            <div className="swiper-button-next" style={{ color: 'var(--text-primary)' }}
              onClick={() => swiperRef.current?.slideNext()} />
          </Swiper>
        )}
      </section>

      {/* 分类导航 */}
      <section className="mb-10">
        <div className="flex flex-wrap gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/novels?categoryId=${cat.id}`}
              className="px-5 py-2 rounded-full border text-sm transition-all duration-300"
              style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent-primary)'; e.currentTarget.style.color = 'var(--accent-primary)'; e.currentTarget.style.background = 'var(--tag-bg)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'transparent' }}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </section>

      {/* 最近更新 */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <span className="w-1 h-6 rounded-full" style={{ background: `linear-gradient(180deg, var(--accent-primary), var(--accent-secondary))` }} />
            最近更新
          </h3>
          <Link to="/novels?sort=new" className="text-sm transition-colors" style={{ color: 'var(--text-muted)' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-primary)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
            查看全部 →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {novels.length > 0 ? novels.map((novel, i) => (
            <motion.div
              key={novel.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
            >
              <NovelCard novel={novel} />
            </motion.div>
          )) : (
            Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="card p-3 animate-pulse">
                <div className="aspect-[3/4] rounded-lg mb-3" style={{ background: 'var(--bg-hover)' }} />
                <div className="h-4 rounded mb-2 w-3/4" style={{ background: 'var(--bg-hover)' }} />
                <div className="h-3 rounded w-1/2" style={{ background: 'var(--bg-hover)' }} />
              </div>
            ))
          )}
        </div>
      </section>
    </motion.div>
  )
}
