import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const LINKS = [
  { to:'/admin',            label:'Dashboard',  icon:'📊', exact:true },
  { to:'/admin/news',       label:'News',       icon:'📰' },
  { to:'/admin/programmes', label:'Programmes', icon:'📅' },
  { to:'/admin/audio',      label:'Audio',      icon:'🎙️' },
  { to:'/admin/stations',   label:'Stations',   icon:'📻' },
  { to:'/admin/users',      label:'Staff',      icon:'👥' },
]

export default function AdminLayout({ children }) {
  const { staff, signOut } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleSignOut = async () => { await signOut(); navigate('/admin/login') }

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'var(--color-bg)' }}>

      {/* Desktop Sidebar */}
      <aside className="admin-sidebar" style={{ width:'220px', background:'var(--color-surface)', borderRight:'1px solid var(--color-border)', display:'flex', flexDirection:'column', position:'fixed', top:0, left:0, bottom:0, zIndex:50 }}>
        <div style={{ padding:'20px 20px 16px', borderBottom:'1px solid var(--color-border)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
            <div style={{ width:'32px', height:'32px', borderRadius:'8px', background:'linear-gradient(135deg, var(--color-brand-light), var(--color-brand-dark))', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'12px', fontWeight:900, color:'#fff', fontFamily:'var(--font-display)' }}>RN</div>
            <div>
              <p style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'13px', color:'var(--color-text)', lineHeight:1 }}>Radio Nigeria</p>
              <p style={{ fontSize:'10px', color:'var(--color-text-dim)', marginTop:'2px' }}>Admin Panel</p>
            </div>
          </div>
        </div>
        <nav style={{ flex:1, padding:'12px 10px', display:'flex', flexDirection:'column', gap:'2px', overflowY:'auto' }}>
          {LINKS.map(({ to, label, icon, exact }) => (
            <NavLink key={to} to={to} end={exact} style={({ isActive }) => ({
              display:'flex', alignItems:'center', gap:'10px', padding:'10px 12px', borderRadius:'8px', fontSize:'13px', fontWeight:500,
              color: isActive ? 'var(--color-accent)' : 'var(--color-text-muted)',
              background: isActive ? 'rgba(240,165,0,0.08)' : 'transparent',
              transition:'all 0.15s',
            })}><span style={{ fontSize:'16px' }}>{icon}</span>{label}</NavLink>
          ))}
        </nav>
        <div style={{ padding:'16px', borderTop:'1px solid var(--color-border)' }}>
          {staff && (
            <div style={{ marginBottom:'12px', padding:'10px 12px', background:'var(--color-surface-2)', borderRadius:'8px' }}>
              <p style={{ fontSize:'12px', fontWeight:600, color:'var(--color-text)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{staff.name}</p>
              <p style={{ fontSize:'10px', color:'var(--color-text-dim)', textTransform:'capitalize' }}>{staff.role}</p>
            </div>
          )}
          <button onClick={handleSignOut} style={{ width:'100%', padding:'8px', borderRadius:'8px', fontSize:'12px', fontWeight:500, cursor:'pointer', background:'transparent', color:'var(--color-text-dim)', border:'1px solid var(--color-border)' }}>Sign Out</button>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <div className="admin-topbar" style={{ display:'none', position:'fixed', top:0, left:0, right:0, zIndex:100, background:'var(--color-surface)', borderBottom:'1px solid var(--color-border)', padding:'0 16px', height:'56px', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
          <div style={{ width:'28px', height:'28px', borderRadius:'7px', background:'linear-gradient(135deg, var(--color-brand-light), var(--color-brand-dark))', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'11px', fontWeight:900, color:'#fff', fontFamily:'var(--font-display)' }}>RN</div>
          <p style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'13px', color:'var(--color-text)' }}>Admin</p>
        </div>
        <button onClick={() => setMenuOpen(o => !o)} style={{ background:'none', border:'1px solid var(--color-border)', borderRadius:'8px', padding:'6px 10px', cursor:'pointer', color:'var(--color-text)', fontSize:'18px', lineHeight:1 }}>☰</button>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div style={{ position:'fixed', inset:0, zIndex:200 }} onClick={() => setMenuOpen(false)}>
          <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.6)' }} />
          <div style={{ position:'absolute', top:0, left:0, bottom:0, width:'260px', background:'var(--color-surface)', borderRight:'1px solid var(--color-border)', display:'flex', flexDirection:'column', zIndex:201 }} onClick={e => e.stopPropagation()}>
            <div style={{ padding:'20px 16px 16px', borderBottom:'1px solid var(--color-border)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <p style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'15px', color:'var(--color-text)' }}>Menu</p>
              <button onClick={() => setMenuOpen(false)} style={{ background:'none', border:'none', color:'var(--color-text-muted)', fontSize:'20px', cursor:'pointer' }}>✕</button>
            </div>
            <nav style={{ flex:1, padding:'12px 10px', display:'flex', flexDirection:'column', gap:'4px' }}>
              {LINKS.map(({ to, label, icon, exact }) => (
                <NavLink key={to} to={to} end={exact} onClick={() => setMenuOpen(false)} style={({ isActive }) => ({
                  display:'flex', alignItems:'center', gap:'12px', padding:'12px 14px', borderRadius:'8px', fontSize:'14px', fontWeight:500,
                  color: isActive ? 'var(--color-accent)' : 'var(--color-text-muted)',
                  background: isActive ? 'rgba(240,165,0,0.08)' : 'transparent',
                })}><span style={{ fontSize:'18px' }}>{icon}</span>{label}</NavLink>
              ))}
            </nav>
            <div style={{ padding:'16px', borderTop:'1px solid var(--color-border)' }}>
              {staff && <p style={{ fontSize:'13px', color:'var(--color-text-muted)', marginBottom:'12px' }}>Signed in as <strong style={{ color:'var(--color-text)' }}>{staff.name}</strong></p>}
              <button onClick={handleSignOut} style={{ width:'100%', padding:'10px', borderRadius:'8px', fontSize:'13px', fontWeight:600, cursor:'pointer', background:'rgba(255,59,48,0.1)', color:'var(--color-live)', border:'1px solid rgba(255,59,48,0.2)' }}>Sign Out</button>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="admin-main" style={{ marginLeft:'220px', flex:1, minWidth:0 }}>
        {children}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .admin-sidebar { display: none !important; }
          .admin-topbar  { display: flex !important; }
          .admin-main    { margin-left: 0 !important; padding-top: 56px; }
        }
      `}</style>
    </div>
  )
}
