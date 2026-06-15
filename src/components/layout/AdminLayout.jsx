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

  const handleSignOut = async () => { await signOut(); navigate('/admin/login') }

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'var(--color-bg)' }}>
      {/* Sidebar */}
      <aside style={{ width:'220px', background:'var(--color-surface)', borderRight:'1px solid var(--color-border)', display:'flex', flexDirection:'column', position:'fixed', top:0, left:0, bottom:0, zIndex:50, flexShrink:0 }}>
        {/* Logo */}
        <div style={{ padding:'20px 20px 16px', borderBottom:'1px solid var(--color-border)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
            <div style={{ width:'32px', height:'32px', borderRadius:'8px', background:'linear-gradient(135deg, var(--color-brand-light), var(--color-brand-dark))', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'12px', fontWeight:900, color:'#fff', fontFamily:'var(--font-display)' }}>RN</div>
            <div>
              <p style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'13px', color:'var(--color-text)', lineHeight:1 }}>Radio Nigeria</p>
              <p style={{ fontSize:'10px', color:'var(--color-text-dim)', marginTop:'2px' }}>Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex:1, padding:'12px 10px', display:'flex', flexDirection:'column', gap:'2px', overflowY:'auto' }}>
          {LINKS.map(({ to, label, icon, exact }) => (
            <NavLink key={to} to={to} end={exact} style={({ isActive }) => ({
              display:'flex', alignItems:'center', gap:'10px', padding:'10px 12px', borderRadius:'8px', fontSize:'13px', fontWeight:500,
              color: isActive ? 'var(--color-accent)' : 'var(--color-text-muted)',
              background: isActive ? 'rgba(240,165,0,0.08)' : 'transparent',
              transition:'all 0.15s',
            })}>
              <span style={{ fontSize:'16px', lineHeight:1 }}>{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div style={{ padding:'16px', borderTop:'1px solid var(--color-border)' }}>
          {staff && (
            <div style={{ marginBottom:'12px', padding:'10px 12px', background:'var(--color-surface-2)', borderRadius:'8px' }}>
              <p style={{ fontSize:'12px', fontWeight:600, color:'var(--color-text)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{staff.name}</p>
              <p style={{ fontSize:'10px', color:'var(--color-text-dim)', textTransform:'capitalize' }}>{staff.role}</p>
            </div>
          )}
          <button onClick={handleSignOut} style={{ width:'100%', padding:'8px', borderRadius:'8px', fontSize:'12px', fontWeight:500, cursor:'pointer', background:'transparent', color:'var(--color-text-dim)', border:'1px solid var(--color-border)', transition:'all 0.15s' }}
            onMouseEnter={e=>{ e.currentTarget.style.background='rgba(255,59,48,0.1)'; e.currentTarget.style.color='var(--color-live)'; e.currentTarget.style.borderColor='rgba(255,59,48,0.3)' }}
            onMouseLeave={e=>{ e.currentTarget.style.background='transparent'; e.currentTarget.style.color='var(--color-text-dim)'; e.currentTarget.style.borderColor='var(--color-border)' }}
          >Sign Out</button>
        </div>
      </aside>

      {/* Main */}
      <div style={{ marginLeft:'220px', flex:1, minWidth:0 }}>
        {children}
      </div>
    </div>
  )
}
