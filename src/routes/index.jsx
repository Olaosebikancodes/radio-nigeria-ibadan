import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Public pages — lazy loaded
const Home           = lazy(() => import('../pages/public/Home'))
const About          = lazy(() => import('../pages/public/About'))
const Stations       = lazy(() => import('../pages/public/Stations'))
const StationDetail  = lazy(() => import('../pages/public/StationDetail'))
const Live           = lazy(() => import('../pages/public/Live'))
const News           = lazy(() => import('../pages/public/News'))
const ArticlePage    = lazy(() => import('../pages/public/ArticlePage'))
const Programmes     = lazy(() => import('../pages/public/Programmes'))
const Audio          = lazy(() => import('../pages/public/Audio'))
const Contact        = lazy(() => import('../pages/public/Contact'))

// Admin pages — lazy loaded
const AdminLogin         = lazy(() => import('../pages/admin/AdminLogin'))
const AdminDashboard     = lazy(() => import('../pages/admin/AdminDashboard'))
const AdminNews          = lazy(() => import('../pages/admin/AdminNews'))
const AdminArticleEditor = lazy(() => import('../pages/admin/AdminArticleEditor'))
const AdminProgrammes    = lazy(() => import('../pages/admin/AdminProgrammes'))
const AdminAudio         = lazy(() => import('../pages/admin/AdminAudio'))
const AdminStations      = lazy(() => import('../pages/admin/AdminStations'))
const AdminUsers         = lazy(() => import('../pages/admin/AdminUsers'))

function PageLoader() {
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'60vh' }}>
      <div style={{ width:'28px', height:'28px', borderRadius:'50%', border:'2px solid var(--color-brand)', borderTopColor:'transparent', animation:'spin 0.6s linear infinite' }} />
      <style>{`@keyframes spin { to { transform:rotate(360deg) } }`}</style>
    </div>
  )
}

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <PageLoader />
  return user ? children : <Navigate to="/admin/login" replace />
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public */}
        <Route path="/"               element={<Home />} />
        <Route path="/about"          element={<About />} />
        <Route path="/stations"       element={<Stations />} />
        <Route path="/stations/:slug" element={<StationDetail />} />
        <Route path="/live"           element={<Live />} />
        <Route path="/news"           element={<News />} />
        <Route path="/news/:slug"     element={<ArticlePage />} />
        <Route path="/programmes"     element={<Programmes />} />
        <Route path="/audio"          element={<Audio />} />
        <Route path="/contact"        element={<Contact />} />

        {/* Admin */}
        <Route path="/admin/login"         element={<AdminLogin />} />
        <Route path="/admin"               element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/news"          element={<ProtectedRoute><AdminNews /></ProtectedRoute>} />
        <Route path="/admin/news/create"   element={<ProtectedRoute><AdminArticleEditor /></ProtectedRoute>} />
        <Route path="/admin/news/:id/edit" element={<ProtectedRoute><AdminArticleEditor /></ProtectedRoute>} />
        <Route path="/admin/programmes"    element={<ProtectedRoute><AdminProgrammes /></ProtectedRoute>} />
        <Route path="/admin/audio"         element={<ProtectedRoute><AdminAudio /></ProtectedRoute>} />
        <Route path="/admin/stations"      element={<ProtectedRoute><AdminStations /></ProtectedRoute>} />
        <Route path="/admin/users"         element={<ProtectedRoute><AdminUsers /></ProtectedRoute>} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}
