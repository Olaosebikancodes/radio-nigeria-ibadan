import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Radio } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { timeAgo, truncate } from '../../lib/utils'
import { Badge } from '../ui/Badge'
import { ArticleCardSkeleton } from '../ui/Skeleton'

function ArticleCard({ article }) {
  return (
    <Link to={`/news/${article.slug}`} style={{
      flex: '0 0 280px', minWidth: 0, display: 'block',
      background: 'var(--color-surface)', borderRadius: '14px',
      overflow: 'hidden', border: '1px solid var(--color-border)',
      transition: 'all 0.3s var(--ease-out-expo)',
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'var(--color-border-light)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.4)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.boxShadow = 'none' }}
    >
      <div style={{ height: '160px', background: 'var(--color-surface-2)', position: 'relative', overflow: 'hidden' }}>
        {article.cover_image
          ? <img src={article.cover_image} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', opacity: 0.2 }}><Radio size={32} color="var(--color-text-dim)"/></div>
        }
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)' }} />
      </div>
      <div style={{ padding: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
          <Badge label={article.category || 'General'} category={article.category} />
          <span style={{ fontSize: '13px', color: 'var(--color-text-dim)' }}>{timeAgo(article.published_at || article.created_at)}</span>
        </div>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '17px', fontWeight: 700, color: 'var(--color-text)', lineHeight: 1.35, letterSpacing: '-0.02em' }}>
          {truncate(article.title, 70)}
        </h3>
      </div>
    </Link>
  )
}

export default function LatestNews() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading]   = useState(true)
  const [offset, setOffset]     = useState(0)
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 700)
  const trackRef = useRef(null)
  const SLIDE_EVERY = 4000

  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 700)
    window.addEventListener('resize', fn, { passive: true })
    return () => window.removeEventListener('resize', fn)
  }, [])

  useEffect(() => {
    supabase.from('articles')
      .select('id,title,slug,cover_image,category,published_at,created_at')
      .eq('published', true).order('published_at', { ascending: false }).limit(12)
      .then(({ data }) => { setArticles(data || []); setLoading(false) })
  }, [])

  useEffect(() => {
    if (articles.length <= 4 || isMobile) return
    const t = setInterval(() => {
      setOffset(o => (o + 1) % (articles.length - 3))
    }, SLIDE_EVERY)
    return () => clearInterval(t)
  }, [articles.length, isMobile])

  const cardW      = 280
  const translateX = isMobile ? 0 : offset * -(cardW + 16)

  return (
    <section style={{ background: 'var(--color-surface)', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '56px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-brand-light)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>Latest</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px,3.5vw,36px)', fontWeight: 900, color: 'var(--color-text)', letterSpacing: '-0.04em' }}>News & Updates</h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {articles.length > 4 && (
              <div style={{ display: 'flex', gap: '6px' }}>
                {Array.from({ length: Math.max(1, articles.length - 3) }).map((_, i) => (
                  <button key={i} onClick={() => setOffset(i)} style={{
                    width: i === offset ? '20px' : '6px', height: '6px', borderRadius: '3px', border: 'none', cursor: 'pointer',
                    background: i === offset ? 'var(--color-accent)' : 'var(--color-border-light)',
                    transition: 'all 0.3s var(--ease-out-expo)', padding: 0,
                  }} />
                ))}
              </div>
            )}
              </div>
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
            {Array(4).fill(0).map((_, i) => <ArticleCardSkeleton key={i} />)}
          </div>
        ) : articles.length === 0 ? (
          <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '40px 0' }}>No articles yet. Check back soon.</p>
        ) : isMobile ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '12px' }}>
            {articles.slice(0, 6).map(a => <ArticleCard key={a.id} article={a} />)}
          </div>
        ) : (
          <div style={{ overflow: 'hidden' }}>
            <div ref={trackRef} style={{
              display: 'flex', gap: '16px',
              transform: `translateX(${translateX}px)`,
              transition: 'transform 0.5s var(--ease-out-expo)',
            }}>
              {articles.map(a => <ArticleCard key={a.id} article={a} />)}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
