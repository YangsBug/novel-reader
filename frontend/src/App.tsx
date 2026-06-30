import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from '@/components/layout/MainLayout'
import HomePage from '@/pages/HomePage'
import CategoryPage from '@/pages/CategoryPage'
import SearchPage from '@/pages/SearchPage'
import NovelDetailPage from '@/pages/NovelDetailPage'
import ReaderPage from '@/pages/ReaderPage'
import BookshelfPage from '@/pages/BookshelfPage'
import HistoryPage from '@/pages/HistoryPage'
import ProfilePage from '@/pages/ProfilePage'
import LoginPage from '@/pages/LoginPage'
import ProtectedRoute from '@/components/common/ProtectedRoute'

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/novels" element={<CategoryPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/novel/:id" element={<NovelDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/bookshelf" element={<ProtectedRoute><BookshelfPage /></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
      <Route path="/reader/:novelId/:chapterId" element={<ReaderPage />} />
    </Routes>
  )
}
