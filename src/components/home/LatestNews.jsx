import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { timeAgo, truncate } from '../../lib/utils'
import { Badge } from '../ui/Badge'
import { ArticleCardSkeleton } from '../ui/Skeleton'

function ArticleCard({ article, featured }) {
  return (
    <Link to={`/news/${article.slug}`} style={{
      display:'block', background:'var(--color-surface)',
      borderRadius:'14px', overflow:'hidden',
      border:'1px solid var(--color-border)',
      transition:'all 0.3s var(--ease-out-expo)',
      gridColumn: featured ? 'span 2' : 'span 1',
    }}
      onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.borderColor='var(--color-border-light)'; e.currentTarget.style.boxShadow='0 16px 40px rgba(0,0,0,0.4)' }}
      onMouseLeave={e=>{ e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.borderColor='var(--color-border)'; e.currentTarget.style.boxShadow='none' }}
    >
      {/* Cover */}
      <div style={{ height: featured ? '280px' : '200px', background:`linear-gradient(135deg, var(--color-surface-2), var(--color-surface-3))`, position:'relative', overflow:'hidden' }}>
        {article.cover_image
          ? <img src={article.cover_image} alt={article.title} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
          : <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', opacity:0.15 }}>
              <span style={{ fontSize:'48px' }}>📻</span>
            </div>
        }
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)' }} />
        {article.station && (
          <div style={{ position:'absolute', top:'12px', right:'12px' }}>
            <Badge label={article.station.name} />
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{ padding:'20px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'10px' }}>
          <Badge label={article.category || 'General'} category={article.category} />
          <span style={{ fontSize:'11px', color:'var(--color-text-dim)' }}>{timeAgo(article.published_at || article.created_at)}</span>
        </div>
        <h3 style={{ fontFamily:'var(--font-display)', fontSize: featured ? '22px' : '17px', fontWeight:700, color:'var(--color-text)', marginBottom:'8px', letterSpacing:'-0.03em', lineHeight:1.25 }}>{article.title}</h3>
        {article.excerpt && (
          <p style={{ fontSize:'13px', color:'var(--color-text-muted)', lineHeight:1.65 }}>{truncate(article.excerpt, featured ? 200 : 100)}</p>
        )}
      </div>
    </Link>
  )
}

export default function LatestNews() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    supabase.from('articles')
      .select('id,title,slug,excerpt,cover_image,category,published_at,created_at,stations(name)')
      .eq('published', true)
      .order('published_at', { ascending:false })
      .limit(5)
      .then(({ data }) => { setArticles(data || []); setLoading(false) })
  }, [])

  return (
    <section style={{ background:'var(--color-surface)', borderTop:'1px solid var(--color-border)', borderBottom:'1px solid var(--color-border)' }}>
      <div style={{ maxWidth:'1280px', margin:'0 auto', padding:'80px 24px' }}>
        <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:'40px', flexWrap:'wrap', gap:'16px' }}>
          <div>
            <p style={{ fontSize:'11px', fontWeight:600, color:'var(--color-brand-light)', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'8px' }}>Latest</p>
            <h2 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(28px,4vw,40px)', fontWeight:900, color:'var(--color-text)', letterSpacing:'-0.04em' }}>News & Updates</h2>
          </div>
          <Link to="/news" style={{ fontSize:'13px', color:'var(--color-accent)', fontWeight:600 }}>All news →</Link>
        </div>

        {loading ? (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'16px' }}>
            {Array(3).fill(0).map((_,i) => <ArticleCardSkeleton key={i} />)}
          </div>
        ) : articles.length === 0 ? (
          <p style={{ color:'var(--color-text-muted)', textAlign:'center', padding:'40px 0' }}>No articles yet. Check back soon.</p>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'16px' }}>
            {articles.map((a, i) => <ArticleCard key={a.id} article={a} featured={i===0} />)}
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 900px) {
          .news-grid { grid-template-columns: 1fr 1fr !important; }
          .news-grid > *:first-child { grid-column: span 2 !important; }
        }
        @media (max-width: 560px) {
          .news-grid { grid-template-columns: 1fr !important; }
          .news-grid > * { grid-column: span 1 !important; }
        }
      `}</style>
    </section>
  )
}
