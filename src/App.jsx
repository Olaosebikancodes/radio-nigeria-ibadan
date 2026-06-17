import { BrowserRouter, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { PlayerProvider } from './context/PlayerContext'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import AppRoutes from './routes'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function Layout() {
  const { pathname } = useLocation()
  const isAdmin = pathname.startsWith('/admin')
  return (
    <>
      <ScrollToTop />
      {!isAdmin && <Navbar />}
      <AppRoutes />
      {!isAdmin && <Footer />}
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PlayerProvider>
          <Layout />
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: 'var(--color-surface-2)',
                color: 'var(--color-text)',
                border: '1px solid var(--color-border)',
                fontSize: '13px',
                fontFamily: 'var(--font-body)',
              },
              success: { iconTheme: { primary: 'var(--color-success)', secondary: 'var(--color-bg)' } },
              error:   { iconTheme: { primary: 'var(--color-live)',    secondary: 'var(--color-bg)' } },
            }}
          />
        </PlayerProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
