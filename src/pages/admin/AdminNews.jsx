import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import AdminLayout from '../../components/layout/AdminLayout'
import { formatDate } from '../../lib/utils'
import toast from 'react-hot-toast'

export default function AdminNews() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading]   = useState(true)
  const [filter, setFilter]     = useState('all')

  const fetch = async () => {
    setLoading(true)
    let q = supabase.from('articles').select('id,title,slug,category,published,published_at,created_at,stations(name)').order('created_at',{ascending:false})
    if (filter==='published') q=q.eq('published',true)
    if (filter==='draft')     q=q.eq('published',false)
    const { data } = await q
    setArticles(data||[]); setLoading(false)
  }
  useEffect(()=>{ fetch() }, [filter])

  const togglePublish = async (id, current) => {
    const { error } = await supabase.from('articles').update({ published:!current, published_at: !current ? new Date().toISOString() : null }).eq('id',id)
    if (!error) { toast.success(!current?'Article published':'Moved to drafts'); fetch() }
    else toast.error('Failed to update')
  }

  const deleteArticle = async (id, title) => {
    if (!confirm(`Delete "${title}"?`)) return
    const { error } = await supabase.from('articles').delete().eq('id',id)
    if (!error) { toast.success('Deleted'); fetch() }
    else toast.error('Failed to delete')
  }

  return (
    <AdminLayout>
      <div style={{ padding:'32px' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'28px', flexWrap:'wrap', gap:'12px' }}>
          <div>
            <h1 style={{ fontFamily:'var(--font-display)', fontSize:'28px', fontWeight:700, color:'var(--color-text)', letterSpacing:'-0.03em' }}>News Articles</h1>
            <p style={{ fontSize:'13px', color:'var(--color-text-muted)', marginTop:'4px' }}>{articles.length} article{articles.length!==1?'s':''}</p>
          </div>
          <Link to="/admin/news/create" style={{ padding:'10px 20px', borderRadius:'10px', fontSize:'13px', fontWeight:600, background:'var(--color-brand)', color:'#fff' }}>+ New Article</Link>
        </div>

        <div style={{ display:'flex', gap:'8px', marginBottom:'20px' }}>
          {['all','published','draft'].map(f=>(
            <button key={f} onClick={()=>setFilter(f)} style={{ padding:'6px 16px', borderRadius:'999px', fontSize:'12px', fontWeight:500, cursor:'pointer', textTransform:'capitalize', background:filter===f?'var(--color-brand)':'var(--color-surface)', color:filter===f?'#fff':'var(--color-text-muted)', border:`1px solid ${filter===f?'var(--color-brand)':'var(--color-border)'}`, transition:'all 0.2s' }}>{f}</button>
          ))}
        </div>

        <div style={{ background:'var(--color-surface)', borderRadius:'16px', border:'1px solid var(--color-border)', overflow:'hidden' }}>
          <div className="news-table-header" style={{ display:'grid', gridTemplateColumns:'1fr 120px 100px 120px 100px', gap:'16px', padding:'12px 20px', background:'var(--color-surface-2)', borderBottom:'1px solid var(--color-border)' }}>
            {['Title','Category','Station','Date','Actions'].map(h=><p key={h} style={{ fontSize:'10px', fontWeight:700, color:'var(--color-text-dim)', textTransform:'uppercase', letterSpacing:'0.08em' }}>{h}</p>)}
          </div>
          {loading ? <p style={{padding:'24px',color:'var(--color-text-muted)'}}>Loading…</p>
            : articles.length===0 ? <p style={{padding:'24px',color:'var(--color-text-muted)',textAlign:'center'}}>No articles. Create one above.</p>
            : articles.map(a=>(
              <div key={a.id} className="news-table-row" style={{ display:'grid', gridTemplateColumns:'1fr 120px 100px 120px 100px', gap:'16px', padding:'14px 20px', borderBottom:'1px solid var(--color-border)', alignItems:'center' }}
                onMouseEnter={e=>e.currentTarget.style.background='var(--color-surface-2)'}
                onMouseLeave={e=>e.currentTarget.style.background='transparent'}
              >
                <div>
                  <p style={{ fontSize:'13px', fontWeight:500, color:'var(--color-text)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{a.title}</p>
                  <span style={{ fontSize:'11px', fontWeight:600, padding:'2px 8px', borderRadius:'999px', background:a.published?'rgba(52,199,89,0.12)':'rgba(255,165,0,0.12)', color:a.published?'var(--color-success)':'var(--color-warning)', marginTop:'4px', display:'inline-block' }}>{a.published?'Published':'Draft'}</span>
                </div>
                <p className="news-col-hide" style={{ fontSize:'12px', color:'var(--color-text-muted)', textTransform:'capitalize' }}>{a.category||'"”'}</p>
                <p className="news-col-hide" style={{ fontSize:'12px', color:'var(--color-text-muted)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{a.stations?.name||'"”'}</p>
                <p className="news-col-hide" style={{ fontSize:'12px', color:'var(--color-text-dim)' }}>{formatDate(a.published_at||a.created_at)}</p>
                <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
                  <Link to={`/admin/news/${a.id}/edit`} style={{ fontSize:'11px', fontWeight:600, color:'var(--color-accent)' }}>Edit</Link>
                  <button onClick={()=>togglePublish(a.id,a.published)} style={{ fontSize:'11px', fontWeight:600, color:a.published?'var(--color-text-dim)':'var(--color-success)', background:'none', border:'none', cursor:'pointer' }}>{a.published?'Unpublish':'Publish'}</button>
                  <button onClick={()=>deleteArticle(a.id,a.title)} style={{ fontSize:'11px', fontWeight:600, color:'var(--color-live)', background:'none', border:'none', cursor:'pointer' }}>Del</button>
                </div>
              </div>
            ))
          }
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .news-table-header { display: none !important; }
          .news-table-row { grid-template-columns: 1fr auto !important; gap: 8px !important; }
          .news-col-hide { display: none !important; }
          .news-table-row > div:last-child { grid-column: 1 / -1; }
        }
      `}</style>
    </AdminLayout>
  )
}
