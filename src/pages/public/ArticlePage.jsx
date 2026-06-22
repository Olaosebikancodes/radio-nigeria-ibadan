import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { formatDate, timeAgo } from '../../lib/utils'
import { Badge } from '../../components/ui/Badge'
import { Skeleton } from '../../components/ui/Skeleton'
import toast from 'react-hot-toast'

function ShareBar({ title }) {
  const url = window.location.href
  const encoded = encodeURIComponent(url)
  const text = encodeURIComponent(title)

  const copyLink = () => {
    navigator.clipboard.writeText(url).then(() => toast.success('Link copied!')).catch(() => toast.error('Could not copy'))
  }

  const shareButtons = [
    { label: 'X / Twitter', icon: 'ð•', href: `https://twitter.com/intent/tweet?url=${encoded}&text=${text}`, color: '#000' },
    { label: 'Facebook', icon: 'f', href: `https://www.facebook.com/sharer/sharer.php?u=${encoded}`, color: '#1877F2' },
    { label: 'WhatsApp', icon: 'ðŸ’¬', href: `https://wa.me/?text=${text}%20${encoded}`, color: '#25D366' },
  ]

  return (
    <div style={{ display:'flex', alignItems:'center', gap:'8px', flexWrap:'wrap' }}>
      <span style={{ fontSize:'11px', fontWeight:600, color:'var(--color-text-dim)', textTransform:'uppercase', letterSpacing:'0.08em' }}>Share</span>
      {shareButtons.map(b => (
        <a key={b.label} href={b.href} target="_blank" rel="noopener noreferrer" title={b.label}
          style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', width:'30px', height:'30px', borderRadius:'8px', background:'var(--color-surface-2)', border:'1px solid var(--color-border)', fontSize:'13px', fontWeight:700, color:'var(--color-text)', textDecoration:'none', transition:'background 0.15s' }}
          onMouseEnter={e=>{ e.currentTarget.style.background=b.color; e.currentTarget.style.color='#fff'; e.currentTarget.style.borderColor=b.color }}
          onMouseLeave={e=>{ e.currentTarget.style.background='var(--color-surface-2)'; e.currentTarget.style.color='var(--color-text)'; e.currentTarget.style.borderColor='var(--color-border)' }}
        >{b.icon}</a>
      ))}
      <button onClick={copyLink} title="Copy link"
        style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', width:'30px', height:'30px', borderRadius:'8px', background:'var(--color-surface-2)', border:'1px solid var(--color-border)', fontSize:'13px', cursor:'pointer', color:'var(--color-text)', transition:'background 0.15s' }}
        onMouseEnter={e=>{ e.currentTarget.style.background='var(--color-surface-3)' }}
        onMouseLeave={e=>{ e.currentTarget.style.background='var(--color-surface-2)' }}
      >ðŸ”—</button>
    </div>
  )
}

export default function ArticlePage() {
  const { slug } = useParams()
  const [article, setArticle] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    supabase.from('articles')
      .select('*, stations(name,slug,color_hex)')
      .eq('slug', slug).eq('published', true).single()
      .then(async ({ data }) => {
        if (!data) { setNotFound(true); setLoading(false); return }
        setArticle(data)
        // Fetch related: same category, exclude self, limit 3
        const { data: rel } = await supabase.from('articles')
          .select('id,title,slug,cover_image,category,published_at,created_at,stations(name)')
          .eq('published', true)
          .eq('category', data.category)
          .neq('id', data.id)
          .order('published_at', { ascending: false })
          .limit(3)
        setRelated(rel || [])
        setLoading(false)
      })
  }, [slug])

  if (loading) return (
    <main style={{ paddingTop:'104px', maxWidth:'760px', margin:'0 auto', padding:'120px 24px' }}>
      <Skeleton height="40px" width="70%" style={{ marginBottom:'16px' }} />
      <Skeleton height="20px" width="40%" style={{ marginBottom:'32px' }} />
      <Skeleton height="360px" radius="12px" style={{ marginBottom:'32px' }} />
      {Array(6).fill(0).map((_,i) => <Skeleton key={i} height="16px" style={{ marginBottom:'10px' }} />)}
    </main>
  )

  if (notFound) return (
    <main style={{ paddingTop:'104px', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'60vh', gap:'16px' }}>
      <p style={{ fontSize:'48px' }}>ðŸ“°</p>
      <h2 style={{ fontFamily:'var(--font-display)', fontSize:'28px', color:'var(--color-text)' }}>Article not found</h2>
      <Link to="/news" style={{ color:'var(--color-accent)', fontSize:'14px' }}>← Back to News</Link>
    </main>
  )

  return (
    <main style={{ paddingTop:'104px' }}>
      {article.cover_image && (
        <div style={{ width:'100%', height:'400px', position:'relative', overflow:'hidden' }}>
          <img src={article.cover_image} alt={article.title} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, var(--color-bg) 0%, transparent 60%)' }} />
        </div>
      )}

      <div style={{ maxWidth:'760px', margin:'0 auto', padding:`${article.cover_image ? '0' : '80px'} 24px 80px` }}>
        <div style={{ position:'relative', zIndex:1 }}>
          <div style={{ display:'flex', gap:'10px', alignItems:'center', marginBottom:'20px', flexWrap:'wrap' }}>
            <Badge label={article.category || 'General'} category={article.category} />
            {article.stations && (
              <Link to={`/stations/${article.stations.slug}`} style={{ fontSize:'11px', color:'var(--color-text-dim)', fontWeight:500 }}>
                {article.stations.name}
              </Link>
            )}
            <span style={{ fontSize:'11px', color:'var(--color-text-dim)' }}>{formatDate(article.published_at || article.created_at)}</span>
          </div>

          <h1 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(28px,5vw,48px)', fontWeight:900, color:'var(--color-text)', letterSpacing:'-0.04em', lineHeight:1.1, marginBottom:'20px' }}>
            {article.title}
          </h1>

          <ShareBar title={article.title} />

          {article.excerpt && (
            <p style={{ fontSize:'18px', color:'var(--color-text-muted)', lineHeight:1.7, marginTop:'28px', marginBottom:'28px', borderLeft:'3px solid var(--color-brand)', paddingLeft:'20px' }}>
              {article.excerpt}
            </p>
          )}

          {!article.excerpt && <div style={{ height:'32px' }} />}

          <div style={{ height:'1px', background:'var(--color-border)', marginBottom:'40px' }} />

          <div className="article-body" dangerouslySetInnerHTML={{ __html: article.content || '' }} />

          <div style={{ height:'1px', background:'var(--color-border)', margin:'40px 0' }} />

          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'12px' }}>
            <Link to="/news" style={{ fontSize:'13px', color:'var(--color-accent)', fontWeight:600 }}>← Back to News</Link>
            <ShareBar title={article.title} />
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div style={{ borderTop:'1px solid var(--color-border)', background:'var(--color-surface)', padding:'48px 24px 64px' }}>
          <div style={{ maxWidth:'1280px', margin:'0 auto' }}>
            <h2 style={{ fontFamily:'var(--font-display)', fontSize:'22px', fontWeight:700, color:'var(--color-text)', letterSpacing:'-0.03em', marginBottom:'24px' }}>More in {article.category ? article.category.charAt(0).toUpperCase() + article.category.slice(1) : 'News'}</h2>
            <div className="related-grid" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'16px' }}>
              {related.map(a => (
                <Link key={a.id} to={`/news/${a.slug}`} style={{ display:'block', background:'var(--color-bg)', borderRadius:'12px', overflow:'hidden', border:'1px solid var(--color-border)', transition:'all 0.2s', textDecoration:'none' }}
                  onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.borderColor='var(--color-border-light)' }}
                  onMouseLeave={e=>{ e.currentTarget.style.transform='none'; e.currentTarget.style.borderColor='var(--color-border)' }}
                >
                  <div style={{ height:'140px', background:'var(--color-surface-2)', overflow:'hidden' }}>
                    {a.cover_image
                      ? <img src={a.cover_image} alt={a.title} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                      : <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100%', opacity:0.1, fontSize:'28px' }}>ðŸ“°</div>
                    }
                  </div>
                  <div style={{ padding:'14px' }}>
                    <Badge label={a.category||'General'} category={a.category} />
                    <p style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'14px', color:'var(--color-text)', marginTop:'8px', lineHeight:1.3 }}>{a.title}</p>
                    <p style={{ fontSize:'11px', color:'var(--color-text-dim)', marginTop:'6px' }}>{timeAgo(a.published_at||a.created_at)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .article-body { font-size:16px; line-height:1.8; color:var(--color-text-muted); }
        .article-body h2,.article-body h3 { font-family:var(--font-display); color:var(--color-text); margin:32px 0 16px; letter-spacing:-0.03em; }
        .article-body h2 { font-size:26px; }
        .article-body h3 { font-size:20px; }
        .article-body p { margin-bottom:20px; }
        .article-body a { color:var(--color-accent); }
        .article-body img { border-radius:10px; margin:24px 0; width:100%; }
        .article-body ul,.article-body ol { padding-left:24px; margin-bottom:20px; }
        .article-body li { margin-bottom:8px; }
        .article-body blockquote { border-left:3px solid var(--color-brand); padding-left:20px; margin:24px 0; color:var(--color-text-dim); font-style:italic; }
        .article-body strong { color:var(--color-text); font-weight:600; }
        @media(max-width:700px){ .related-grid{ grid-template-columns:1fr 1fr !important; } }
        @media(max-width:480px){ .related-grid{ grid-template-columns:1fr !important; } }
      `}</style>
    </main>
  )
}
