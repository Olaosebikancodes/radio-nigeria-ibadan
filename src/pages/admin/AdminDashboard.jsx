import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
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
        <div style={{ width:'40px', height:'40px', borderRadius:'10px', background:`${color}20`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'18px' }}>{icon}</div>
        <span style={{ fontSize:'11px', color:'var(--color-text-dim)', fontWeight:500 }}>View all →</span>
      </div>
      <p style={{ fontFamily:'var(--font-display)', fontWeight:900, fontSize:'32px', color:'var(--color-text)', letterSpacing:'-0.04em' }}>{value ?? '—'}</p>
      <p style={{ fontSize:'13px', color:'var(--color-text-muted)', marginTop:'4px' }}>{label}</p>
    </Link>
  )
}

export default function AdminDashboard() {
  const [stats, setStats]   = useState({})
  const [recent, setRecent] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const [
        { count: totalArticles },
        { count: published },
        { count: totalAudio },
        { count: totalProgs },
        { data: recentArts },
      ] = await Promise.all([
        supabase.from('articles').select('*',{count:'exact',head:true}),
        supabase.from('articles').select('*',{count:'exact',head:true}).eq('published',true),
        supabase.from('audio_content').select('*',{count:'exact',head:true}),
        supabase.from('programmes').select('*',{count:'exact',head:true}),
        supabase.from('articles').select('id,title,slug,published,created_at').order('created_at',{ascending:false}).limit(5),
      ])
      setStats({ totalArticles, published, drafts:(totalArticles-published), totalAudio, totalProgs })
      setRecent(recentArts||[])
      setLoading(false)
    }
    load()
  }, [])

  return (
    <AdminLayout>
      <div style={{ padding:'32px' }}>
        <div style={{ marginBottom:'32px', display:'flex', flexWrap:'wrap', gap:'8px', justifyContent:'space-between' }}>
          <h1 style={{ fontFamily:'var(--font-display)', fontSize:'28px', fontWeight:700, color:'var(--color-text)', letterSpacing:'-0.03em' }}>Dashboard</h1>
          <p style={{ fontSize:'13px', color:'var(--color-text-muted)', marginTop:'4px' }}>{new Date().toLocaleDateString('en-NG',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}</p>
        </div>

        {/* Stats */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:'16px', marginBottom:'40px' }}>
          {loading ? Array(4).fill(0).map((_,i)=><Skeleton key={i} height="130px" radius="14px"/>) : <>
            <StatCard label="Total Articles"     value={stats.totalArticles} icon="📰" color="#1A6B9A" to="/admin/news" />
            <StatCard label="Published"          value={stats.published}     icon="✅" color="#27AE60" to="/admin/news" />
            <StatCard label="Drafts"             value={stats.drafts}        icon="📝" color="#F39C12" to="/admin/news" />
            <StatCard label="Audio Uploads"      value={stats.totalAudio}    icon="🎙️" color="#8E44AD" to="/admin/audio" />
            <StatCard label="Programme Slots"    value={stats.totalProgs}    icon="📅" color="#E74C3C" to="/admin/programmes" />
          </>}
        </div>

        {/* Recent articles */}
        <div style={{ background:'var(--color-surface)', borderRadius:'16px', border:'1px solid var(--color-border)', overflow:'hidden' }}>
          <div style={{ padding:'20px 24px', borderBottom:'1px solid var(--color-border)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <h2 style={{ fontFamily:'var(--font-display)', fontSize:'16px', fontWeight:700, color:'var(--color-text)' }}>Recent Articles</h2>
            <Link to="/admin/news/create" style={{ padding:'7px 16px', borderRadius:'8px', fontSize:'12px', fontWeight:600, background:'var(--color-brand)', color:'#fff' }}>+ New Article</Link>
          </div>
          {loading ? <div style={{padding:'20px'}}><Skeleton height="40px"/></div>
            : recent.length===0 ? <p style={{padding:'24px',color:'var(--color-text-muted)',fontSize:'13px'}}>No articles yet.</p>
            : recent.map(a => (
              <div key={a.id} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 24px', borderBottom:'1px solid var(--color-border)', gap:'12px', flexWrap:'wrap' }}>
                <div style={{ minWidth:0, flex:1 }}>
                  <p style={{ fontSize:'14px', fontWeight:500, color:'var(--color-text)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{a.title}</p>
                  <p style={{ fontSize:'11px', color:'var(--color-text-dim)', marginTop:'2px' }}>{new Date(a.created_at).toLocaleDateString('en-NG')}</p>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:'10px', flexShrink:0 }}>
                  <span style={{ fontSize:'11px', fontWeight:600, padding:'3px 10px', borderRadius:'999px', background: a.published?'rgba(52,199,89,0.12)':'rgba(255,165,0,0.12)', color: a.published?'var(--color-success)':'var(--color-warning)' }}>{a.published?'Published':'Draft'}</span>
                  <Link to={`/admin/news/${a.id}/edit`} style={{ fontSize:'12px', color:'var(--color-accent)' }}>Edit</Link>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </AdminLayout>
  )
}
