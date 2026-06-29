import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Megaphone, CheckCircle, Radio } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import AdminLayout from '../../components/layout/AdminLayout'
import { Skeleton } from '../../components/ui/Skeleton'

function StatCard({ label, value, icon, color, to }) {
  return (
    <Link to={to} style={{ display:'block', background:'var(--color-surface)', borderRadius:'14px', padding:'24px', border:`1px solid var(--color-border)`, transition:'all 0.2s', textDecoration:'none' }}
      onMouseEnter={e=>{ e.currentTarget.style.borderColor=color+'66'; e.currentTarget.style.transform='translateY(-2px)' }}
      onMouseLeave={e=>{ e.currentTarget.style.borderColor='var(--color-border)'; e.currentTarget.style.transform='none' }}
    >
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:'16px' }}>
        <div style={{ width:'40px', height:'40px', borderRadius:'10px', background:`${color}20`, display:'flex', alignItems:'center', justifyContent:'center', color }}>{icon}</div>
        <span style={{ fontSize:’11px’, color:’var(--color-text-dim)’, fontWeight:500 }}>View all →</span>
      </div>
      <p style={{ fontFamily:'var(--font-display)', fontWeight:900, fontSize:'32px', color:'var(--color-text)', letterSpacing:'-0.04em' }}>{value ?? '—'}</p>
      <p style={{ fontSize:'13px', color:'var(--color-text-muted)', marginTop:'4px' }}>{label}</p>
    </Link>
  )
}

// Dashboard — the first page seen after login.
// Shows counts of total adverts, active adverts, and live stations,
// plus the 5 most recently created adverts.
// Each stat card links to the relevant admin section.
export default function AdminDashboard() {
  const [stats, setStats]   = useState({})
  const [recent, setRecent] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const [
        { count: totalAdverts },
        { count: activeAdverts },
        { count: totalStations },
        { data: recentAdverts },
      ] = await Promise.all([
        supabase.from('adverts').select('*',{count:'exact',head:true}),
        supabase.from('adverts').select('*',{count:'exact',head:true}).eq('active',true),
        supabase.from('stations').select('*',{count:'exact',head:true}).eq('active',true),
        supabase.from('adverts').select('id,title,active,stations(name),created_at').order('created_at',{ascending:false}).limit(5),
      ])
      setStats({ totalAdverts, activeAdverts, totalStations })
      setRecent(recentAdverts||[])
      setLoading(false)
    }
    load()
  }, [])

  return (
    <AdminLayout>
      <div className="admin-content">
        <style>{`
          .admin-content { padding: 32px; }
          @media(max-width:640px){ .admin-content { padding: 16px; } }
          @media(max-width:640px){ .admin-stat-grid { grid-template-columns: 1fr !important; } }
        `}</style>
        <div style={{ marginBottom:'32px', display:'flex', flexWrap:'wrap', gap:'8px', justifyContent:'space-between' }}>
          <h1 style={{ fontFamily:'var(--font-display)', fontSize:'28px', fontWeight:700, color:'var(--color-text)', letterSpacing:'-0.03em' }}>Dashboard</h1>
          <p style={{ fontSize:'13px', color:'var(--color-text-muted)', marginTop:'4px' }}>{new Date().toLocaleDateString('en-NG',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}</p>
        </div>

        <div className="admin-stat-grid" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:'16px', marginBottom:'40px' }}>
          {loading ? Array(3).fill(0).map((_,i)=><Skeleton key={i} height="130px" radius="14px"/>) : <>
            <StatCard label="Total Adverts"   value={stats.totalAdverts}  icon={<Megaphone size={18}/>}    color="#F39C12" to="/admin/adverts" />
            <StatCard label="Active Adverts"  value={stats.activeAdverts} icon={<CheckCircle size={18}/>}  color="#27AE60" to="/admin/adverts" />
            <StatCard label="Live Stations"   value={stats.totalStations} icon={<Radio size={18}/>}        color="#1A6B9A" to="/admin/stations" />
          </>}
        </div>

        <div style={{ background:'var(--color-surface)', borderRadius:'16px', border:'1px solid var(--color-border)', overflow:'hidden' }}>
          <div style={{ padding:'20px 24px', borderBottom:'1px solid var(--color-border)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <h2 style={{ fontFamily:'var(--font-display)', fontSize:'16px', fontWeight:700, color:'var(--color-text)' }}>Recent Adverts</h2>
            <Link to="/admin/adverts" style={{ padding:'7px 16px', borderRadius:'8px', fontSize:'12px', fontWeight:600, background:'var(--color-brand)', color:'#fff' }}>Manage Adverts</Link>
          </div>
          {loading ? <div style={{padding:'20px'}}><Skeleton height="40px"/></div>
            : recent.length===0 ? <p style={{padding:'24px',color:'var(--color-text-muted)',fontSize:'13px'}}>No adverts yet.</p>
            : recent.map(a => (
              <div key={a.id} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 24px', borderBottom:'1px solid var(--color-border)', gap:'12px', flexWrap:'wrap' }}>
                <div style={{ minWidth:0, flex:1 }}>
                  <p style={{ fontSize:'14px', fontWeight:500, color:'var(--color-text)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{a.title}</p>
                  <p style={{ fontSize:'11px', color:'var(--color-text-dim)', marginTop:'2px' }}>{a.stations?.name ?? 'All Stations'} · {new Date(a.created_at).toLocaleDateString('en-NG')}</p>
                </div>
                <span style={{ fontSize:'11px', fontWeight:600, padding:'3px 10px', borderRadius:'999px', background: a.active?'rgba(52,199,89,0.12)':'rgba(255,59,48,0.1)', color: a.active?'var(--color-success)':'var(--color-live)', flexShrink:0 }}>{a.active ? 'Active' : 'Inactive'}</span>
              </div>
            ))
          }
        </div>
      </div>
    </AdminLayout>
  )
}
