import { useEffect, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { useThemeStore, Theme } from '@/store/themeStore'

const themeLabels: Record<Theme, string> = { light: '☀️ 清新白', mint: '🌿 薄荷绿' }
const themeIcons: Record<Theme, string> = { light: '☀️', mint: '🌿' }

export default function Navbar() {
  const [search, setSearch] = useState('')
  const [showMenu, setShowMenu] = useState(false)
  const { isLoggedIn, user, logout } = useAuthStore()
  const { theme, toggle } = useThemeStore()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    document.documentElement.className = `theme-${theme}`
  }, [theme])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (search.trim()) navigate(`/search?q=${encodeURIComponent(search.trim())}`)
  }

  const navLinks = [
    { path: '/', label: '首页' },
    { path: '/novels', label: '分类' },
    { path: '/bookshelf', label: '书架' },
  ]

  const linkClass = (path: string) =>
    `text-sm transition-colors duration-200 ${
      location.pathname === path
        ? 'font-semibold'
        : 'hover:opacity-70'
    }`

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <span className="text-2xl font-bold" style={{
              background: `linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              星海阅读
            </span>
          </Link>

          {/* Nav Links - Desktop */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={linkClass(link.path)}
                style={{ color: location.pathname === link.path ? 'var(--accent-primary)' : 'var(--text-secondary)' }}
              >
                {link.label}
              </Link>
            ))}
            {isLoggedIn && (
              <Link
                to="/history"
                className={linkClass('/history')}
                style={{ color: location.pathname === '/history' ? 'var(--accent-primary)' : 'var(--text-secondary)' }}
              >
                历史
              </Link>
            )}
          </div>

          {/* Search & User */}
          <div className="flex items-center gap-3">
            <form onSubmit={handleSearch} className="hidden sm:block">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="搜索小说..."
                className="w-48 lg:w-64 input-field py-1.5 text-sm"
              />
            </form>

            {/* 主题切换 */}
            <button
              onClick={toggle}
              className="text-lg px-2 py-1.5 rounded-lg transition-colors hover:opacity-70"
              title={themeLabels[theme]}
            >
              {themeIcons[theme]}
            </button>

            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors"
                  style={{ background: 'var(--bg-hover)' }}
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium text-white"
                    style={{ background: `linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))` }}>
                    {user?.nickname?.[0] || 'U'}
                  </div>
                  <span className="hidden lg:block text-sm" style={{ color: 'var(--text-secondary)' }}>{user?.nickname}</span>
                </button>
                {showMenu && (
                  <>
                    <div className="fixed inset-0" onClick={() => setShowMenu(false)} />
                    <div className="absolute right-0 top-full mt-2 w-40 card shadow-xl py-1 z-50">
                      <Link to="/profile" className="block px-4 py-2 text-sm transition-colors" style={{ color: 'var(--text-secondary)' }}
                        onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'var(--bg-hover)' }}
                        onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'transparent' }}
                        onClick={() => setShowMenu(false)}>个人中心</Link>
                      <Link to="/bookshelf" className="block px-4 py-2 text-sm transition-colors" style={{ color: 'var(--text-secondary)' }}
                        onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'var(--bg-hover)' }}
                        onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'transparent' }}
                        onClick={() => setShowMenu(false)}>我的书架</Link>
                      <hr style={{ borderColor: 'var(--border)', margin: '4px 0' }} />
                      <button className="block w-full text-left px-4 py-2 text-sm text-red-500 transition-colors" style={{ background: 'var(--bg-hover)' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-secondary)' }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-hover)' }}
                        onClick={() => { logout(); setShowMenu(false); navigate('/') }}>退出登录</button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link to="/login" className="btn-primary text-sm px-4 py-1.5">登录</Link>
            )}

            {/* Mobile menu */}
            <button className="md:hidden p-2" onClick={() => setShowMenu(!showMenu)}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: 'var(--text-primary)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
