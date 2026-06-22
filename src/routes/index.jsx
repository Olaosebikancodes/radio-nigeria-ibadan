import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Home           = lazy(() => import('../pages/public/Home'))
const About          = lazy(() => import('../pages/public/About'))
const Stations       = lazy(() => import('../pages/public/Stations'))
const StationDetail  = lazy(() => import('../pages/public/StationDetail'))
const Contact        = lazy(() => import('../pages/public/Contact'))

const AdminLogin      = lazy(() => import('../pages/admin/AdminLogin'))
const AdminDashboard  = lazy(() => import('../pages/admin/AdminDashboard'))
const AdminAdverts    = lazy(() => import('../pages/admin/AdminAdverts'))
const AdminStations   = lazy(() => import('../pages/admin/AdminStations'))
const AdminUsers      = lazy(() => import('../pages/admin/AdminUsers'))

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
        <Route path="/"               element={<Home />} />
        <Route path="/about"          element={<About />} />
        <Route path="/stations"       element={<Stations />} />
        <Route path="/stations/:slug" element={<StationDetail />} />
        <Route path="/contact"        element={<Contact />} />

        <Route path="/admin/login"    element={<AdminLogin />} />
        <Route path="/admin"          element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/adverts"  element={<ProtectedRoute><AdminAdverts /></ProtectedRoute>} />
        <Route path="/admin/stations" element={<ProtectedRoute><AdminStations /></ProtectedRoute>} />
        <Route path="/admin/users"    element={<ProtectedRoute><AdminUsers /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}
