import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  onFinish?: () => void
}

type Phase = 'enter' | 'intro' | 'exiting'

export default function SplashScreen({ onFinish }: Props) {
  const [phase, setPhase] = useState<Phase>('enter')
  const [progress, setProgress] = useState(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // 清理定时器
  const clearTimers = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    if (progressRef.current) clearInterval(progressRef.current)
  }

  // 点击进入 → 介绍页
  const handleEnter = () => {
    setPhase('intro')
    startIntroTimer()
  }

  // 跳过或自动进入登录页
  const handleSkip = () => {
    clearTimers()
    setPhase('exiting')
    setTimeout(() => onFinish?.(), 600)
  }

  // 介绍页倒计时进度条
  const startIntroTimer = () => {
    setProgress(0)
    
    // 5秒倒计时进度条
    const duration = 5000
    const interval = 50
    const step = 100 / (duration / interval)
    
    progressRef.current = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(progressRef.current!)
          return 100
        }
        return p + step
      })
    }, interval)

    // 5秒后自动进入登录页
    timerRef.current = setTimeout(() => {
      handleSkip()
    }, duration)
  }

  useEffect(() => {
    return () => clearTimers()
  }, [])

  const stars = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    delay: Math.random() * 2,
    duration: Math.random() * 2 + 1.5,
  }))

  const features = [
    { title: '海量小说', desc: '数万本精品小说，涵盖玄幻、都市、言情、科幻等全品类' },
    { title: '智能推荐', desc: 'AI 算法精准匹配，发现属于你的下一本好书' },
    { title: '舒适阅读', desc: '自定义字体、背景、翻页动画，打造专属阅读体验' },
    { title: '云端同步', desc: '书架、书签、阅读进度，多端实时同步' },
  ]

  return (
    <AnimatePresence mode="wait">
      {phase !== 'exiting' && (
        <motion.div
          className="fixed inset-0 z-[9999] overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #0a0f1a 0%, #0f172a 50%, #0c1929 100%)' }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        >
          {/* 星光背景（通用） */}
          {stars.map((star) => (
            <motion.div
              key={star.id}
              className="absolute rounded-full bg-white"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: star.size,
                height: star.size,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{
                delay: star.delay,
                duration: star.duration,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}

          {/* 阶段 1: 点击进入页 */}
          {phase === 'enter' && (
            <motion.div
              key="enter"
              className="absolute inset-0 flex flex-col items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5 }}
            >
              {/* Logo 光晕 */}
              <motion.div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full blur-3xl"
                style={{ background: 'rgba(59,130,246,0.15)' }}
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              />

              {/* 主标题 */}
              <motion.h1
                className="text-5xl sm:text-6xl font-bold mb-4 relative z-10"
                style={{
                  background: 'linear-gradient(135deg, #60a5fa, #34d399, #a78bfa)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                星海阅读
              </motion.h1>

              {/* 副标题 */}
              <motion.p
                className="text-lg text-slate-400 mb-12 relative z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                在星辰大海中，遇见你的故事
              </motion.p>

              {/* 点击进入按钮 */}
              <motion.button
                onClick={handleEnter}
                className="relative z-10 px-12 py-4 text-lg font-medium rounded-full"
                style={{
                  background: 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(168,85,247,0.2))',
                  border: '1px solid rgba(59,130,246,0.4)',
                  color: '#60a5fa',
                }}
                whileHover={{ 
                  scale: 1.05, 
                  background: 'linear-gradient(135deg, rgba(59,130,246,0.3), rgba(168,85,247,0.3))',
                }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                点击进入
              </motion.button>

              {/* 底部提示 */}
              <motion.p
                className="absolute bottom-12 text-xs text-slate-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.8 }}
              >
                点击任意处进入
              </motion.p>
            </motion.div>
          )}

          {/* 阶段 2: 网页介绍页 */}
          {phase === 'intro' && (
            <motion.div
              key="intro"
              className="absolute inset-0 flex flex-col items-center justify-center px-6"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
            >
              {/* 顶部标题 */}
              <motion.div
                className="text-center mb-12"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
                  探索无限可能
                </h2>
                <p className="text-slate-400">为你打造极致阅读体验</p>
              </motion.div>

              {/* 功能卡片 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl w-full mb-12">
                {features.map((feature, i) => (
                  <motion.div
                    key={feature.title}
                    className="p-5 rounded-xl"
                    style={{
                      background: 'rgba(30,41,59,0.5)',
                      border: '1px solid rgba(59,130,246,0.15)',
                    }}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                  >
                    <h3 className="text-lg font-semibold text-blue-400 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      {feature.desc}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* 底部操作区 */}
              <motion.div
                className="flex flex-col items-center gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                {/* 进度条 */}
                <div className="w-64 h-1 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
                      width: `${progress}%`,
                    }}
                  />
                </div>

                {/* 跳过按钮 */}
                <button
                  onClick={handleSkip}
                  className="text-sm text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-2"
                >
                  跳过 ({Math.ceil((100 - progress) / 20)}s)
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
