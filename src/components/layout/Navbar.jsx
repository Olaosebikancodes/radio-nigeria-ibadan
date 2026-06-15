import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { usePlayer } from '../../context/PlayerContext'

const NAV = [
  { label: 'Home',       to: '/' },
  { label: 'Stations',   to: '/stations' },
  { label: 'Live',       to: '/live' },
  { label: 'News',       to: '/news' },
  { label: 'Programmes', to: '/programmes' },
  { label: 'Audio',      to: '/audio' },
  { label: 'About',      to: '/about' },
  { label: 'Contact',    to: '/contact' },
]

function WaveIcon({ active }) {
  return (
    <span className="wave-icon" style={{ display:'inline-flex', alignItems:'flex-end', gap:'2px', height:'14px' }}>
      {[1,2,3,4].map(i => (
        <span key={i} style={{
          display:'block', width:'3px', borderRadius:'2px',
          backgroundColor: active ? 'var(--color-accent)' : 'var(--color-text-muted)',
          height:`${[8,14,10,12][i-1]}px`,
          animation: active ? `wave-bar 0.9s ease-in-out ${i*0.12}s infinite` : 'none',
          transformOrigin: 'bottom',
        }} />
      ))}
    </span>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen]         = useState(false)
  const { activeStation, playing, toggle } = usePlayer()
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setOpen(false), [location])

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      transition: 'background 0.35s var(--ease-smooth), border-color 0.35s',
      background: scrolled ? 'rgba(8,14,10,0.92)' : 'transparent',
      backdropFilter: scrolled ? 'blur(16px)' : 'none',
      borderBottom: scrolled ? '1px solid var(--color-border)' : '1px solid transparent',
    }}>
      <div style={{ maxWidth:'1280px', margin:'0 auto', padding:'0 24px' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', height:'68px' }}>

          {/* Logo */}
          <Link to="/" style={{ display:'flex', alignItems:'center', gap:'12px', flexShrink:0 }}>
            <div style={{
              width:'40px', height:'40px', borderRadius:'10px',
              background:'linear-gradient(135deg, var(--color-brand-light), var(--color-brand-dark))',
              display:'flex', alignItems:'center', justifyContent:'center',
              boxShadow:'0 0 16px rgba(0,92,46,0.4)',
              fontSize:'18px', fontWeight:900, color:'#fff', fontFamily:'var(--font-display)',
              letterSpacing:'-0.04em',
            }}>RN</div>
            <div>
              <p style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'15px', lineHeight:1, color:'var(--color-text)', letterSpacing:'-0.03em' }}>Radio Nigeria</p>
              <p style={{ fontSize:'10px', color:'var(--color-text-muted)', letterSpacing:'0.08em', textTransform:'uppercase', marginTop:'2px' }}>Ibadan Zonal Station</p>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav style={{ display:'flex', alignItems:'center', gap:'4px' }} className="desktop-nav">
            {NAV.map(({ label, to }) => (
              <NavLink key={to} to={to} end={to==='/'} style={({ isActive }) => ({
                padding:'6px 12px', borderRadius:'8px', fontSize:'13px', fontWeight:500,
                color: isActive ? 'var(--color-accent)' : 'var(--color-text-muted)',
                background: isActive ? 'rgba(240,165,0,0.08)' : 'transparent',
                transition:'all 0.2s var(--ease-smooth)',
                letterSpacing:'-0.01em',
              })}>{label}</NavLink>
            ))}
          </nav>

          {/* Right side */}
          <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
            {/* Mini player pill */}
            {activeStation && (
              <button onClick={toggle} style={{
                display:'flex', alignItems:'center', gap:'8px',
                padding:'6px 14px', borderRadius:'999px',
                background:'var(--color-surface-2)',
                border:'1px solid var(--color-border-light)',
                color:'var(--color-text)', cursor:'pointer',
                fontSize:'12px', fontWeight:500,
                transition:'all 0.2s var(--ease-smooth)',
              }}>
                <span style={{ width:'7px', height:'7px', borderRadius:'50%', background:'var(--color-live)', animation:'pulse-live 1.4s ease-in-out infinite', flexShrink:0 }} />
                <WaveIcon active={playing} />
                <span style={{ maxWidth:'120px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                  {activeStation.name}
                </span>
                <span style={{ color:'var(--color-text-muted)', fontSize:'11px' }}>{playing ? '❙❙' : '▶'}</span>
              </button>
            )}

            <Link to="/live" style={{
              display:'flex', alignItems:'center', gap:'7px',
              padding:'8px 16px', borderRadius:'8px', fontSize:'13px', fontWeight:600,
              background:'var(--color-brand)', color:'#fff',
              transition:'background 0.2s var(--ease-smooth)',
              letterSpacing:'-0.01em',
            }}
              onMouseEnter={e => e.currentTarget.style.background='var(--color-brand-light)'}
              onMouseLeave={e => e.currentTarget.style.background='var(--color-brand)'}
            >
              <span style={{ width:'6px', height:'6px', borderRadius:'50%', background:'#4EFF8C', animation:'pulse-live 1.4s ease-in-out infinite' }} />
              Listen Live
            </Link>

            {/* Hamburger */}
            <button onClick={() => setOpen(o => !o)} className="hamburger" style={{
              display:'none', flexDirection:'column', gap:'5px',
              padding:'6px', background:'none', border:'none', cursor:'pointer',
            }}>
              {[0,1,2].map(i => <span key={i} style={{ display:'block', width:'22px', height:'2px', background:'var(--color-text)', borderRadius:'2px' }} />)}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div style={{
          position:'absolute', top:'68px', left:0, right:0,
          background:'rgba(8,14,10,0.97)', backdropFilter:'blur(20px)',
          borderBottom:'1px solid var(--color-border)',
          padding:'16px 24px 24px',
          display:'flex', flexDirection:'column', gap:'4px',
        }}>
          {NAV.map(({ label, to }) => (
            <NavLink key={to} to={to} end={to==='/'} style={({ isActive }) => ({
              padding:'12px 16px', borderRadius:'8px', fontSize:'15px', fontWeight:500,
              color: isActive ? 'var(--color-accent)' : 'var(--color-text)',
              background: isActive ? 'rgba(240,165,0,0.08)' : 'transparent',
            })}>{label}</NavLink>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          .hamburger   { display: flex !important; }
        }
      `}</style>
    </header>
  )
}