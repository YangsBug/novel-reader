import { Outlet, useNavigate } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import SplashScreen from '@/components/common/SplashScreen'
import { useAuthStore } from '@/store/authStore'

let splashShown = false

export default function MainLayout() {
  const navigate = useNavigate()
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)

  const showSplash = !splashShown

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-primary)' }}>
      {showSplash && <SplashScreen onFinish={() => { splashShown = true; navigate(isLoggedIn ? '/' : '/login', { replace: true }) }} />}
      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-12">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
