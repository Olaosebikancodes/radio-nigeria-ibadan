import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { LayoutDashboard, Megaphone, Radio, Menu, X } from 'lucide-react'

const LINKS = [
  { to:'/admin',           label:'Dashboard', Icon: LayoutDashboard, exact:true },
  { to:'/admin/adverts',   label:'Adverts',   Icon: Megaphone },
  { to:'/admin/stations',  label:'Stations',  Icon: Radio },
]

export default function AdminLayout({ children }) {
  const { staff, signOut } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleSignOut = async () => { await signOut(); navigate('/admin/login') }

  return (
    <div style={{ display:'flex', minHeight:'100vh' }}>

      <aside className="admin-sidebar" style={{ width:'220px', background:'var(--color-surface)', borderRight:'1px solid var(--color-border)', display:'flex', flexDirection:'column', position:'fixed', top:0, left:0, bottom:0, zIndex:50 }}>
        <div style={{ padding:'16px 20px', borderBottom:'1px solid var(--color-border)', display:'flex', alignItems:'center', justifyContent:'center' }}>
          {/* Logo image — stored in Supabase Storage under the "images" bucket.
              To change the logo, upload a new image to Supabase Storage and replace the URL here
              (and in the Navbar component: src/components/layout/Navbar.jsx) */}
          <img src="https://tfxpqxxzopsycpnmdyke.supabase.co/storage/v1/object/public/images/Untitled%20design(8).png" alt="Radio Nigeria" style={{ height:'52px', width:'auto', objectFit:'contain' }} />
        </div>
        <nav style={{ flex:1, padding:'12px 10px', display:'flex', flexDirection:'column', gap:'2px', overflowY:'auto' }}>
          {LINKS.map(({ to, label, Icon, exact }) => (
            <NavLink key={to} to={to} end={exact} style={({ isActive }) => ({
              display:'flex', alignItems:'center', gap:'10px', padding:'10px 12px', borderRadius:'8px', fontSize:'16px', fontWeight:500,
              color: isActive ? 'var(--color-accent)' : 'var(--color-text-muted)',
              background: isActive ? 'rgba(240,165,0,0.08)' : 'transparent',
              transition:'all 0.15s',
            })}><Icon size={18}/>{label}</NavLink>
          ))}
        </nav>
        <div style={{ padding:'16px', borderTop:'1px solid var(--color-border)' }}>
          {staff && (
            <div style={{ marginBottom:'12px', padding:'10px 12px', background:'var(--color-surface-2)', borderRadius:'8px' }}>
              <p style={{ fontSize:'14px', fontWeight:600, color:'var(--color-text)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{staff.name}</p>
              <p style={{ fontSize:'12px', color:'var(--color-text-dim)', textTransform:'capitalize' }}>{staff.role}</p>
            </div>
          )}
          <button onClick={handleSignOut} style={{ width:'100%', padding:'8px', borderRadius:'8px', fontSize:'12px', fontWeight:500, cursor:'pointer', background:'transparent', color:'var(--color-text-dim)', border:'1px solid var(--color-border)' }}>Sign Out</button>
        </div>
      </aside>

      <div className="admin-topbar" style={{ display:'none', position:'fixed', top:0, left:0, right:0, zIndex:100, background:'var(--color-surface)', borderBottom:'1px solid var(--color-border)', padding:'0 16px', height:'56px', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ display:'flex', alignItems:'center' }}>
          <img src="https://tfxpqxxzopsycpnmdyke.supabase.co/storage/v1/object/public/images/Untitled%20design(8).png" alt="Radio Nigeria" style={{ height:'36px', width:'auto', objectFit:'contain' }} />
        </div>
        <button onClick={() => setMenuOpen(o => !o)} style={{ background:'none', border:'1px solid var(--color-border)', borderRadius:'8px', padding:'6px 10px', cursor:'pointer', color:'var(--color-text)', lineHeight:1, display:'flex', alignItems:'center' }}><Menu size={18}/></button>
      </div>

      {menuOpen && (
        <div style={{ position:'fixed', inset:0, zIndex:200 }} onClick={() => setMenuOpen(false)}>
          <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.6)' }} />
          <div style={{ position:'absolute', top:0, left:0, bottom:0, width:'260px', background:'var(--color-surface)', borderRight:'1px solid var(--color-border)', display:'flex', flexDirection:'column', zIndex:201 }} onClick={e => e.stopPropagation()}>
            <div style={{ padding:'20px 16px 16px', borderBottom:'1px solid var(--color-border)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <p style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'15px', color:'var(--color-text)' }}>Menu</p>
              <button onClick={() => setMenuOpen(false)} style={{ background:'none', border:'none', color:'var(--color-text-muted)', cursor:'pointer', display:'flex', alignItems:'center' }}><X size={20}/></button>
            </div>
            <nav style={{ flex:1, padding:'12px 10px', display:'flex', flexDirection:'column', gap:'4px' }}>
              {LINKS.map(({ to, label, Icon, exact }) => (
                <NavLink key={to} to={to} end={exact} onClick={() => setMenuOpen(false)} style={({ isActive }) => ({
                  display:'flex', alignItems:'center', gap:'12px', padding:'12px 14px', borderRadius:'8px', fontSize:'17px', fontWeight:500,
                  color: isActive ? 'var(--color-accent)' : 'var(--color-text-muted)',
                  background: isActive ? 'rgba(240,165,0,0.08)' : 'transparent',
                })}><Icon size={16}/>{label}</NavLink>
              ))}
            </nav>
            <div style={{ padding:'16px', borderTop:'1px solid var(--color-border)' }}>
              {staff && <p style={{ fontSize:'13px', color:'var(--color-text-muted)', marginBottom:'12px' }}>Signed in as <strong style={{ color:'var(--color-text)' }}>{staff.name}</strong></p>}
              <button onClick={handleSignOut} style={{ width:'100%', padding:'10px', borderRadius:'8px', fontSize:'13px', fontWeight:600, cursor:'pointer', background:'rgba(255,59,48,0.1)', color:'var(--color-live)', border:'1px solid rgba(255,59,48,0.2)' }}>Sign Out</button>
            </div>
          </div>
        </div>
      )}

      <div className="admin-main" style={{ marginLeft:'220px', flex:1, minWidth:0 }}>
        {children}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .admin-sidebar { display: none !important; }
          .admin-topbar  { display: flex !important; }
          .admin-main    { margin-left: 0 !important; padding-top: 56px; }
          .admin-main > div { padding: 16px !important; }
          .admin-page-header { flex-direction: column !important; align-items: flex-start !important; }
        }
      `}</style>
    </div>
  )
}
