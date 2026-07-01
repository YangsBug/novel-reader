import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { userApi } from '@/api/user'
import { useAuthStore } from '@/store/authStore'
import Loading from '@/components/common/Loading'

export default function ProfilePage() {
  const navigate = useNavigate()
  const { logout, isLoggedIn, user } = useAuthStore()
  const queryClient = useQueryClient()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ nickname: '', email: '', intro: '' })

  const { data: profileData, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: () => userApi.profile(user!.id).then(r => r.data.data),
    enabled: isLoggedIn,
  })

  const { data: stats } = useQuery({
    queryKey: ['user-stats'],
    queryFn: () => userApi.stats(user!.id).then(r => r.data.data),
    enabled: isLoggedIn,
  })

  const updateMut = useMutation({
    mutationFn: (data: typeof form) => userApi.update(user!.id, data),
    onSuccess: () => { toast.success('更新成功'); queryClient.invalidateQueries({ queryKey: ['profile'] }); setEditing(false) },
    onError: (e: any) => toast.error(e.response?.data?.message || '更新失败'),
  })

  const startEdit = () => {
    if (!user) return
    const data = profileData || user
    setForm({ nickname: data.nickname || '', email: data.email || '', intro: data.intro || '' })
    setEditing(true)
  }

  if (isLoading) return <Loading />
  if (!isLoggedIn) {
    navigate('/login', { replace: true })
    return null
  }
  if (!user) return null

  const statItems = [
    { label: '书架藏书', value: stats?.totalBooks ?? '-', color: 'var(--accent-primary)' },
    { label: '阅读中', value: stats?.readingBooks ?? '-', color: '#f59e0b' },
    { label: '已读完', value: stats?.finishedBooks ?? '-', color: '#16a34a' },
    { label: '想读', value: stats?.wantBooks ?? '-', color: '#a78bfa' },
  ]

  const displayUser = profileData || user

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-8 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
        <span className="w-1 h-6 rounded-full" style={{ background: `linear-gradient(180deg, var(--accent-primary), var(--accent-secondary))` }} />
        个人中心
      </h2>

      {/* 头像区 */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 rounded-full mx-auto mb-3 flex items-center justify-center text-2xl font-bold text-white"
          style={{ background: `linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))` }}>
          {displayUser.nickname?.[0] || displayUser.username[0]}
        </div>
        <h3 className="text-lg font-medium" style={{ color: 'var(--text-primary)' }}>{displayUser.nickname || displayUser.username}</h3>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{displayUser.email || '未绑定邮箱'}</p>
      </div>

      {/* 阅读统计 */}
      <div className="grid grid-cols-4 gap-3 mb-8">
        {statItems.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="card p-3 text-center"
          >
            <p className="text-2xl font-bold" style={{ color: item.color }}>{item.value}</p>
            <p className="text-[11px] mt-1" style={{ color: 'var(--text-muted)' }}>{item.label}</p>
          </motion.div>
        ))}
      </div>

      {/* 信息 */}
      <div className="card p-6">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>基本信息</h4>
          {!editing && <button onClick={startEdit} className="text-xs hover:underline" style={{ color: 'var(--accent-primary)' }}>编辑</button>}
        </div>
        {editing ? (
          <div className="space-y-4">
            <div>
              <label className="text-xs mb-1 block" style={{ color: 'var(--text-muted)' }}>昵称</label>
              <input value={form.nickname} onChange={e => setForm({ ...form, nickname: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="text-xs mb-1 block" style={{ color: 'var(--text-muted)' }}>邮箱</label>
              <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="text-xs mb-1 block" style={{ color: 'var(--text-muted)' }}>简介</label>
              <textarea value={form.intro} onChange={e => setForm({ ...form, intro: e.target.value })} className="input-field min-h-[80px] resize-none" />
            </div>
            <div className="flex gap-3">
              <button onClick={() => updateMut.mutate(form)} disabled={updateMut.isPending} className="btn-primary text-sm">保存</button>
              <button onClick={() => setEditing(false)} className="btn-ghost text-sm">取消</button>
            </div>
          </div>
        ) : (
          <div className="space-y-3 text-sm">
            <div className="flex"><span className="w-16" style={{ color: 'var(--text-muted)' }}>用户名</span><span style={{ color: 'var(--text-primary)' }}>{displayUser.username}</span></div>
            <div className="flex"><span className="w-16" style={{ color: 'var(--text-muted)' }}>昵称</span><span style={{ color: 'var(--text-primary)' }}>{displayUser.nickname || '-'}</span></div>
            <div className="flex"><span className="w-16" style={{ color: 'var(--text-muted)' }}>邮箱</span><span style={{ color: 'var(--text-primary)' }}>{displayUser.email || '-'}</span></div>
            <div className="flex"><span className="w-16" style={{ color: 'var(--text-muted)' }}>简介</span><span style={{ color: 'var(--text-primary)' }}>{displayUser.intro || '-'}</span></div>
          </div>
        )}
      </div>

      <button onClick={() => { logout(); navigate('/') }} className="w-full mt-6 py-3 border border-red-300 text-red-500 rounded-lg text-sm hover:bg-red-50 transition-all">
        退出登录
      </button>
    </motion.div>
  )
}
