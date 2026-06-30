import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import App from './App'
import ChatBot from '@/components/chat/ChatBot'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false, staleTime: 30000 }
  }
})

// 初始化主题
const saved = localStorage.getItem('novel-theme')
const theme = saved ? JSON.parse(saved).state?.theme : 'light'
document.documentElement.className = `theme-${theme || 'light'}`

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <App />
        <ChatBot />
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: 'var(--bg-card, #fff)',
              color: 'var(--text-primary, #1e293b)',
              border: '1px solid var(--border, #cbd5e1)'
            }
          }}
        />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
)
