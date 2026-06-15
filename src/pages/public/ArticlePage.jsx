import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { formatDate } from '../../lib/utils'
import { Badge } from '../../components/ui/Badge'
import { Skeleton } from '../../components/ui/Skeleton'

export default function ArticlePage() {
  const { slug } = useParams()
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    supabase.from('articles')
      .select('*, stations(name,slug,color_hex)')
      .eq('slug', slug).eq('published', true).single()
      .then(({ data }) => { if (data) setArticle(data); else setNotFound(true); setLoading(false) })
  }, [slug])

  if (loading) return (
    <main style={{ paddingTop:'68px', maxWidth:'760px', margin:'0 auto', padding:'120px 24px' }}>
      <Skeleton height="40px" width="70%" style={{ marginBottom:'16px' }} />
      <Skeleton height="20px" width="40%" style={{ marginBottom:'32px' }} />
      <Skeleton height="360px" radius="12px" style={{ marginBottom:'32px' }} />
      {Array(6).fill(0).map((_,i) => <Skeleton key={i} height="16px" style={{ marginBottom:'10px' }} />)}
    </main>
  )

  if (notFound) return (
    <main style={{ paddingTop:'68px', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'60vh', gap:'16px' }}>
      <p style={{ fontSize:'48px' }}>📰</p>
      <h2 style={{ fontFamily:'var(--font-display)', fontSize:'28px', color:'var(--color-text)' }}>Article not found</h2>
      <Link to="/news" style={{ color:'var(--color-accent)', fontSize:'14px' }}>← Back to News</Link>
    </main>
  )

  return (
    <main style={{ paddingTop:'68px' }}>
      {/* Cover */}
      {article.cover_image && (
        <div style={{ width:'100%', height:'400px', position:'relative', overflow:'hidden' }}>
          <img src={article.cover_image} alt={article.title} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, var(--color-bg) 0%, transparent 60%)' }} />
        </div>
      )}

      {/* Content */}
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

          <h1 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(28px,5vw,48px)', fontWeight:900, color:'var(--color-text)', letterSpacing:'-0.04em', lineHeight:1.1, marginBottom:'24px' }}>
            {article.title}
          </h1>

          {article.excerpt && (
            <p style={{ fontSize:'18px', color:'var(--color-text-muted)', lineHeight:1.7, marginBottom:'40px', borderLeft:'3px solid var(--color-brand)', paddingLeft:'20px' }}>
              {article.excerpt}
            </p>
          )}

          <div style={{ height:'1px', background:'var(--color-border)', marginBottom:'40px' }} />

          {/* Article body */}
          <div className="article-body" dangerouslySetInnerHTML={{ __html: article.content || '' }} />

          <div style={{ height:'1px', background:'var(--color-border)', margin:'48px 0' }} />
          <Link to="/news" style={{ fontSize:'13px', color:'var(--color-accent)', fontWeight:600 }}>← Back to News</Link>
        </div>
      </div>

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
      `}</style>
    </main>
  )
}
