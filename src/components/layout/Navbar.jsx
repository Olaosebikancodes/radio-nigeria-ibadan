import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { usePlayer } from '../../context/PlayerContext'
import { SOCIAL_LINKS } from '../../lib/utils'

const NAV = [
  { label:'Home',       to:'/' },
  { label:'Stations',   to:'/stations' },
  { label:'Live',       to:'/live' },
  { label:'News',       to:'/news' },
  { label:'Programmes', to:'/programmes' },
  { label:'Audio',      to:'/audio' },
  { label:'About',      to:'/about' },
  { label:'Contact',    to:'/contact' },
]

const FacebookIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
)

const TwitterIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
)

const InstagramIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
)

const YoutubeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
)

function WaveIcon({ active }) {
  return (
    <span style={{ display:'inline-flex', alignItems:'flex-end', gap:'2px', height:'14px' }}>
      {[1,2,3,4].map(i => (
        <span key={i} style={{ display:'block', width:'3px', borderRadius:'2px', backgroundColor: active ? 'var(--color-accent)' : 'var(--color-text-muted)', height:`${[8,14,10,12][i-1]}px`, animation: active ? `wave-bar 0.9s ease-in-out ${i*0.12}s infinite` : 'none', transformOrigin:'bottom' }} />
      ))}
    </span>
  )
}

const socialStyle = { display:'flex', alignItems:'center', justifyContent:'center', width:'28px', height:'28px', borderRadius:'7px', background:'var(--color-surface)', border:'1px solid var(--color-border)', color:'var(--color-text-muted)', transition:'all 0.2s', cursor:'pointer' }

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen]         = useState(false)
  const { activeStation, playing, toggle } = usePlayer()
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive:true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  useEffect(() => setOpen(false), [location])

  return (
    <header style={{ position:'fixed', top:0, left:0, right:0, zIndex:100, transition:'background 0.35s, border-color 0.35s', background: scrolled ? 'rgba(8,14,10,0.92)' : 'transparent', backdropFilter: scrolled ? 'blur(16px)' : 'none', borderBottom: scrolled ? '1px solid var(--color-border)' : '1px solid transparent' }}>
      <div style={{ maxWidth:'1280px', margin:'0 auto', padding:'0 24px' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', height:'68px', gap:'12px' }}>

          {/* Logo */}
          <Link to="/" style={{ display:'flex', alignItems:'center', gap:'10px', flexShrink:0 }}>
            <img src="https://tfxpqxxzopsycpnmdyke.supabase.co/storage/v1/object/public/images/IZS%20Logo.png" alt="Radio Nigeria Ibadan" style={{ height:'56px', width:'auto', objectFit:'contain' }} />
            <div>
              <p style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'14px', lineHeight:1, color:'var(--color-text)', letterSpacing:'-0.03em' }}>Radio Nigeria</p>
              <p style={{ fontSize:'9px', color:'var(--color-text-muted)', letterSpacing:'0.08em', textTransform:'uppercase', marginTop:'2px' }}>Ibadan Zonal Station</p>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav style={{ display:'flex', alignItems:'center', gap:'2px' }} className="desktop-nav">
            {NAV.map(({ label, to }) => (
              <NavLink key={to} to={to} end={to==='/'} style={({ isActive }) => ({ padding:'6px 10px', borderRadius:'8px', fontSize:'12px', fontWeight:500, color: isActive ? 'var(--color-accent)' : 'var(--color-text-muted)', background: isActive ? 'rgba(240,165,0,0.08)' : 'transparent', transition:'all 0.2s', letterSpacing:'-0.01em' })}>{label}</NavLink>
            ))}
          </nav>

          {/* Right */}
          <div style={{ display:'flex', alignItems:'center', gap:'10px', flexShrink:0 }}>
            {/* Social icons — desktop */}
            <div style={{ display:'flex', gap:'6px' }} className="social-icons">
              <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer" style={socialStyle} onMouseEnter={e=>{e.currentTarget.style.background='#1877F222';e.currentTarget.style.color='#1877F2';e.currentTarget.style.borderColor='#1877F244'}} onMouseLeave={e=>{e.currentTarget.style.background='var(--color-surface)';e.currentTarget.style.color='var(--color-text-muted)';e.currentTarget.style.borderColor='var(--color-border)'}} title="Facebook"><FacebookIcon /></a>
              <a href={SOCIAL_LINKS.twitter} target="_blank" rel="noopener noreferrer" style={socialStyle} onMouseEnter={e=>{e.currentTarget.style.background='#00000022';e.currentTarget.style.color='var(--color-text)';e.currentTarget.style.borderColor='#ffffff33'}} onMouseLeave={e=>{e.currentTarget.style.background='var(--color-surface)';e.currentTarget.style.color='var(--color-text-muted)';e.currentTarget.style.borderColor='var(--color-border)'}} title="X / Twitter"><TwitterIcon /></a>
              <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" style={socialStyle} onMouseEnter={e=>{e.currentTarget.style.background='#E114514 22';e.currentTarget.style.color='#E1306C';e.currentTarget.style.borderColor='#E1306C44'}} onMouseLeave={e=>{e.currentTarget.style.background='var(--color-surface)';e.currentTarget.style.color='var(--color-text-muted)';e.currentTarget.style.borderColor='var(--color-border)'}} title="Instagram"><InstagramIcon /></a>
              <a href={SOCIAL_LINKS.youtube} target="_blank" rel="noopener noreferrer" style={socialStyle} onMouseEnter={e=>{e.currentTarget.style.background='#FF000022';e.currentTarget.style.color='#FF0000';e.currentTarget.style.borderColor='#FF000044'}} onMouseLeave={e=>{e.currentTarget.style.background='var(--color-surface)';e.currentTarget.style.color='var(--color-text-muted)';e.currentTarget.style.borderColor='var(--color-border)'}} title="YouTube"><YoutubeIcon /></a>
            </div>

            {/* Mini player */}
            {activeStation && (
              <button onClick={toggle} style={{ display:'flex', alignItems:'center', gap:'7px', padding:'5px 12px', borderRadius:'999px', background:'var(--color-surface-2)', border:'1px solid var(--color-border-light)', color:'var(--color-text)', cursor:'pointer', fontSize:'11px', fontWeight:500 }}>
                <span style={{ width:'6px', height:'6px', borderRadius:'50%', background:'var(--color-live)', animation:'pulse-live 1.4s infinite', flexShrink:0 }} />
                <WaveIcon active={playing} />
                <span style={{ maxWidth:'90px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{activeStation.name}</span>
                <span style={{ color:'var(--color-text-muted)', fontSize:'10px' }}>{playing ? '❙❙' : '▶'}</span>
              </button>
            )}

            <Link to="/live" style={{ display:'flex', alignItems:'center', gap:'6px', padding:'7px 14px', borderRadius:'8px', fontSize:'12px', fontWeight:600, background:'var(--color-brand)', color:'#fff', transition:'background 0.2s', whiteSpace:'nowrap' }}
              onMouseEnter={e=>e.currentTarget.style.background='var(--color-brand-light)'}
              onMouseLeave={e=>e.currentTarget.style.background='var(--color-brand)'}
            >
              <span style={{ width:'5px', height:'5px', borderRadius:'50%', background:'#4EFF8C', animation:'pulse-live 1.4s infinite' }} />
              Live
            </Link>

            {/* Hamburger */}
            <button onClick={() => setOpen(o=>!o)} className="hamburger" style={{ display:'none', flexDirection:'column', gap:'5px', padding:'6px', background:'none', border:'none', cursor:'pointer' }}>
              {[0,1,2].map(i=><span key={i} style={{ display:'block', width:'20px', height:'2px', background:'var(--color-text)', borderRadius:'2px' }} />)}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div style={{ position:'absolute', top:'68px', left:0, right:0, background:'rgba(8,14,10,0.97)', backdropFilter:'blur(20px)', borderBottom:'1px solid var(--color-border)', padding:'12px 20px 20px', display:'flex', flexDirection:'column', gap:'2px' }}>
          {NAV.map(({ label, to }) => (
            <NavLink key={to} to={to} end={to==='/'} style={({ isActive }) => ({ padding:'11px 14px', borderRadius:'8px', fontSize:'14px', fontWeight:500, color: isActive ? 'var(--color-accent)' : 'var(--color-text)', background: isActive ? 'rgba(240,165,0,0.08)' : 'transparent' })}>{label}</NavLink>
          ))}
          {/* Mobile social */}
          <div style={{ display:'flex', gap:'10px', padding:'12px 14px 4px', marginTop:'4px', borderTop:'1px solid var(--color-border)' }}>
            {[{ href:SOCIAL_LINKS.facebook, icon:<FacebookIcon/>, label:'Facebook' }, { href:SOCIAL_LINKS.twitter, icon:<TwitterIcon/>, label:'Twitter' }, { href:SOCIAL_LINKS.instagram, icon:<InstagramIcon/>, label:'Instagram' }, { href:SOCIAL_LINKS.youtube, icon:<YoutubeIcon/>, label:'YouTube' }].map(s=>(
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" style={{ ...socialStyle, width:'36px', height:'36px', borderRadius:'9px' }}>{s.icon}</a>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 1024px) { .desktop-nav { display: none !important; } .hamburger { display: flex !important; } }
        @media (max-width: 768px)  { .social-icons { display: none !important; } }
      `}</style>
    </header>
  )
}
