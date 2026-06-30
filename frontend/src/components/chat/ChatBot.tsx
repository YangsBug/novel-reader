import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { novelApi } from '@/api/novel'
import { explainChar, lookupChar, lookupWord } from '@/utils/charDict'
import type { Novel, Category } from '@/types'

interface Message {
  id: number
  role: 'user' | 'bot'
  text: string
  novels?: Novel[] // 推荐小说时附带
}

const CATEGORY_NAMES = ['言情', '科幻', '悬疑', '历史', '游戏', '玄幻', '都市', '武侠', '仙侠']

export default function ChatBot() {
  const [open, setOpen] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      role: 'bot',
      text: '你好！我是星海阅读的智能助手 ✨\n\n我可以帮你：\n· 推荐小说（试试说"推荐小说"或"推荐科幻小说"）\n· 解释生字（直接发一个汉字或说"XX字怎么读"）\n· 聊聊读书心得\n\n有什么想了解的？',
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  // 首次打开时加载分类
  useEffect(() => {
    if (!open) return
    novelApi.categories().then((res) => {
      const list = res.data.data || []
      setCategories(list)
    }).catch(() => {
      setCategories([])
    })
  }, [open])

  const addMessage = (msg: Omit<Message, 'id'>) => {
    setMessages((prev) => [...prev, { ...msg, id: Date.now() + Math.random() }])
  }

  /** 生成机器人回复 */
  const getBotReply = async (text: string): Promise<string> => {
    const q = text.trim()

    // 问候
    if (/^(你好|嗨|hello|hi|在吗|在不在)/i.test(q)) {
      return '你好呀！有什么阅读方面的问题想问我吗？ 😊'
    }

    // 感谢
    if (/谢谢|多谢|感谢|thanks/i.test(q)) {
      return '不客气！随时为你服务～'
    }

    // 再见
    if (/拜拜|再见|bye|晚安/i.test(q)) {
      return '再见！祝你阅读愉快，下次再来找我聊天 📚'
    }

    // 你是谁
    if (/你是谁|你叫什么|你的名字/i.test(q)) {
      return '我是星海阅读的小书童，专门陪你聊小说、推荐好书、解答生字！'
    }

    // 有什么功能 / 能做什么
    if (/你能做什么|有什么功能|能帮我/i.test(q)) {
      return '我可以帮你做这些：\n📖 推荐小说（如"推荐言情小说"）\n🔤 解释不认识的字（直接发汉字）\n💬 陪你聊读书心得\n\n试试对我发一个你不认识的字吧！'
    }

    // 要不要钱 / 收费
    if (/收费|要钱|免费|花钱/i.test(q)) {
      return '完全免费！这是星海阅读为读者提供的免费助手服务 🎉'
    }

    // 解释汉字/词语：单字、已知词、或带"什么意思/怎么读/解释"等表达
    const isSingleChar = /^[\u4e00-\u9fff]$/.test(q)
    const isExplainWithSuffix = /[\u4e00-\u9fff]+(?:是什么意思|什么意思|是什么|是啥|怎么读|怎么念|读法|念法|的读音|的拼音|的读法|的念法|读音|拼音|是什么字|的字义|的含义|的意思|的释义|解释一下|啥意思|啥含义|怎么讲|讲什么)/.test(q)
    const isExplainWithPrefix = /^(?:给我解释|给我讲讲|给我说说|解释一下|解释|说明一下|说明|介绍一下|介绍|讲讲|说说|什么是|什么叫|请解释|请说明|告诉我)/.test(q)
    const isKnownWord = lookupWord(q) !== null || lookupChar(q) !== null

    if (isSingleChar || isExplainWithSuffix || isExplainWithPrefix || isKnownWord) {
      return explainChar(q)
    }

    // 推荐小说 / 分类查询
    const isCategoryName = CATEGORY_NAMES.some((c) => q.includes(c))
    const isRecommendRequest = /推荐|好看|有什么.*书|推荐.*小说|推荐.*书|热门|热门的|来点|想看|有什么/.test(q)

    if (isRecommendRequest || isCategoryName) {
      try {
        // 匹配用户提到的分类（支持"言情的""推荐一本言情小说"）
        let matchedCategory: Category | null = null
        for (const name of CATEGORY_NAMES) {
          if (q.includes(name)) {
            matchedCategory = categories.find((c) => c.name === name) || null
            break
          }
        }

        let novels: Novel[] = []

        if (matchedCategory) {
          const res = await novelApi.list({ categoryId: matchedCategory.id, pageSize: 5 })
          novels = res.data.data?.list || []
        } else {
          // 没有分类，返回热门小说
          const res = await novelApi.hot()
          novels = (res.data.data || []) as unknown as Novel[]
        }

        if (novels.length > 0) {
          const categoryLabel = matchedCategory ? matchedCategory.name + '类' : '热门'
          const list = novels
            .slice(0, 5)
            .map((n, i) => `${i + 1}. 《${n.title}》— ${n.author}  [${n.status}]`)
            .join('\n')
          return `为你找到以下${categoryLabel}小说：\n\n${list}\n\n点击小说卡片可以直接跳转阅读哦～`
        } else {
          return matchedCategory
            ? `"${matchedCategory.name}"分类下暂时还没有小说，可以去书城逛逛其他分类～`
            : '暂时没有热门推荐，可以去书城逛逛～'
        }
      } catch {
        return '抱歉，获取小说推荐失败了，请稍后再试 😥'
      }
    }

    // 好看吗 / 评价 / 怎么样
    if (/好看吗|怎么样|评价|推荐吗|值得看/i.test(q)) {
      return '每个人的口味不同哦～你可以先看看小说的简介和评论，也可以在书城按分类浏览。如果你告诉我喜欢什么类型，我可以帮你精准推荐！'
    }

    // 小说进度 / 更新
    if (/更新|连载|完结|进度|多少章/i.test(q)) {
      return '关于具体小说的更新进度和章节数，可以在小说详情页查看。进入书架还能看到你所有在读书籍的最新动态！'
    }

    // 记录 / 书签 / 进度
    if (/书签|笔记|标记|阅读记录|阅读进度/i.test(q)) {
      return '你可以使用星海阅读的"书架"功能管理你的阅读，还能添加书签和笔记。这些功能都在阅读器界面的工具栏里～'
    }

    // 默认回复
    const fallbacks = [
      '你可以试试对我说：\n· "推荐小说" 或 "推荐科幻小说"\n· 发一个你不认识的汉字\n· "XX字怎么读"',
      '我不太确定你的意思 😊 试试"推荐小说"、直接发一个生字、或者问我"你能做什么"？',
      '抱歉我没理解～ 我的强项是推荐小说和解释生字，要不试试这些功能？',
    ]
    return fallbacks[Math.floor(Math.random() * fallbacks.length)]
  }

  const handleSend = async () => {
    const text = input.trim()
    if (!text || loading) return

    addMessage({ role: 'user', text })
    setInput('')
    setLoading(true)

    try {
      const reply = await getBotReply(text)
      addMessage({ role: 'bot', text: reply })
    } catch {
      addMessage({ role: 'bot', text: '出了一点小问题，请稍后再试 😥' })
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {/* 悬浮按钮 */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center
                   shadow-lg transition-all duration-300 hover:scale-110 active:scale-95"
        style={{
          background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
          boxShadow: '0 4px 20px rgba(59,130,246,0.4)',
        }}
        title="智能助手"
      >
        {open ? (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M8 9h.01M12 9h.01M16 9h.01" fill="currentColor" />
          </svg>
        )}
      </button>

      {/* 聊天面板 */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] h-[520px]
                       max-h-[calc(100vh-8rem)] rounded-2xl flex flex-col overflow-hidden"
            style={{
              background: 'var(--bg-card, #fff)',
              border: '1px solid var(--border, #cbd5e1)',
              boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
            }}
          >
            {/* 头部 */}
            <div
              className="flex items-center gap-3 px-4 py-3 shrink-0"
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              }}
            >
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-lg">
                🤖
              </div>
              <div className="flex-1">
                <div className="text-white font-medium text-sm">小书童</div>
                <div className="text-white/70 text-xs">在线 · 随时为你服务</div>
              </div>
            </div>

            {/* 消息区 */}
            <div
              className="flex-1 overflow-y-auto px-4 py-3 space-y-3"
              style={{ background: 'var(--bg-primary, #f8fafc)' }}
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm whitespace-pre-wrap break-words leading-relaxed ${
                      msg.role === 'user'
                        ? 'text-white rounded-br-md'
                        : 'rounded-bl-md'
                    }`}
                    style={
                      msg.role === 'user'
                        ? { background: 'linear-gradient(135deg, #3b82f6, #6366f1)' }
                        : {
                            background: 'var(--bg-card, #fff)',
                            border: '1px solid var(--border, #cbd5e1)',
                            color: 'var(--text-primary, #1e293b)',
                          }
                    }
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {/* 加载动画 */}
              {loading && (
                <div className="flex justify-start">
                  <div
                    className="px-4 py-3 rounded-2xl rounded-bl-md"
                    style={{
                      background: 'var(--bg-card, #fff)',
                      border: '1px solid var(--border, #cbd5e1)',
                    }}
                  >
                    <div className="flex gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* 输入区 */}
            <div
              className="p-3 shrink-0 flex items-center gap-2"
              style={{
                borderTop: '1px solid var(--border, #cbd5e1)',
                background: 'var(--bg-card, #fff)',
              }}
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="输入问题，比如「推荐小说」…"
                disabled={loading}
                className="flex-1 px-4 py-2 rounded-full text-sm outline-none transition-all
                           disabled:opacity-50"
                style={{
                  background: 'var(--bg-primary, #f8fafc)',
                  border: '1px solid var(--border, #cbd5e1)',
                  color: 'var(--text-primary, #1e293b)',
                }}
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="w-10 h-10 rounded-full flex items-center justify-center shrink-0
                           transition-all active:scale-90 disabled:opacity-40"
                style={{
                  background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                }}
              >
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
