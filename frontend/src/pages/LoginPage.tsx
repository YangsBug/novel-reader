import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { authApi } from '@/api/auth'
import { useAuthStore } from '@/store/authStore'

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuthStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username || !password) { toast.error('请填写完整'); return }
    setLoading(true)
    try {
      const res = isLogin
        ? await authApi.login(username, password)
        : await authApi.register(username, password, email || undefined)
      const { accessToken, refreshToken, userId, username: uname, avatar } = res.data.data
      login(accessToken, refreshToken, {
        id: Number(userId), username: uname, avatar,
        email: '', nickname: uname, gender: 0, intro: '', status: 1, createTime: ''
      })
      toast.success(isLogin ? '登录成功' : '注册成功')
      navigate('/')
    } catch (e: any) {
      toast.error(e.response?.data?.message || (isLogin ? '登录失败' : '注册失败'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="card p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="text-3xl font-bold mb-2" style={{
              background: `linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              星海阅读
            </div>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{isLogin ? '欢迎回来' : '创建新账号'}</p>
          </div>

          {/* Tabs */}
          <div className="flex mb-6 rounded-lg p-1" style={{ background: 'var(--bg-secondary)' }}>
            <button onClick={() => setIsLogin(true)} className={`flex-1 py-2 text-sm rounded-md transition-all ${isLogin ? 'text-white' : ''}`}
              style={isLogin ? { background: 'var(--accent-primary)' } : { color: 'var(--text-muted)' }}>
              登录
            </button>
            <button onClick={() => setIsLogin(false)} className={`flex-1 py-2 text-sm rounded-md transition-all ${!isLogin ? 'text-white' : ''}`}
              style={!isLogin ? { background: 'var(--accent-primary)' } : { color: 'var(--text-muted)' }}>
              注册
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs mb-1 block" style={{ color: 'var(--text-muted)' }}>用户名</label>
              <input value={username} onChange={e => setUsername(e.target.value)} className="input-field" placeholder="输入用户名" autoComplete="username" />
            </div>
            <div>
              <label className="text-xs mb-1 block" style={{ color: 'var(--text-muted)' }}>密码</label>
              <input value={password} onChange={e => setPassword(e.target.value)} type="password" className="input-field" placeholder="输入密码" autoComplete={isLogin ? 'current-password' : 'new-password'} />
            </div>
            {!isLogin && (
              <div>
                <label className="text-xs mb-1 block" style={{ color: 'var(--text-muted)' }}>邮箱（选填）</label>
                <input value={email} onChange={e => setEmail(e.target.value)} className="input-field" placeholder="example@qq.com" autoComplete="email" />
              </div>
            )}
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? '处理中...' : (isLogin ? '登录' : '注册')}
            </button>
          </form>

          <p className="text-center text-[10px] mt-6" style={{ color: 'var(--text-secondary)' }}>
            测试账号: 123 / 123456
          </p>
        </div>
      </motion.div>
    </div>
  )
}
