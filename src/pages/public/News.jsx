import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { timeAgo, truncate, CATEGORIES } from '../../lib/utils'
import { Badge } from '../../components/ui/Badge'
import { ArticleCardSkeleton } from '../../components/ui/Skeleton'

const PAGE_SIZE = 9

function ArticleCard({ article }) {
  return (
    <Link to={`/news/${article.slug}`} style={{ display:'block', background:'var(--color-surface)', borderRadius:'14px', overflow:'hidden', border:'1px solid var(--color-border)', transition:'all 0.3s var(--ease-out-expo)' }}
      onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.borderColor='var(--color-border-light)'; e.currentTarget.style.boxShadow='0 16px 40px rgba(0,0,0,0.4)' }}
      onMouseLeave={e=>{ e.currentTarget.style.transform='none'; e.currentTarget.style.borderColor='var(--color-border)'; e.currentTarget.style.boxShadow='none' }}
    >
      <div style={{ height:'180px', background:'var(--color-surface-2)', position:'relative', overflow:'hidden' }}>
        {article.cover_image
          ? <img src={article.cover_image} alt={article.title} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
          : <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100%', opacity:0.15, fontSize:'40px' }}>ðŸ“»</div>
        }
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 60%)' }} />
      </div>
      <div style={{ padding:'18px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'10px' }}>
          <Badge label={article.category || 'General'} category={article.category} />
          <span style={{ fontSize:'11px', color:'var(--color-text-dim)' }}>{timeAgo(article.published_at || article.created_at)}</span>
        </div>
        <h3 style={{ fontFamily:'var(--font-display)', fontSize:'17px', fontWeight:700, color:'var(--color-text)', marginBottom:'8px', letterSpacing:'-0.03em', lineHeight:1.3 }}>{article.title}</h3>
        <p style={{ fontSize:'13px', color:'var(--color-text-muted)', lineHeight:1.6 }}>{truncate(article.excerpt || '', 100)}</p>
      </div>
    </Link>
  )
}

export default function News() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading]   = useState(true)
  const [category, setCategory] = useState('all')
  const [search, setSearch]     = useState('')
  const [page, setPage]         = useState(0)
  const [total, setTotal]       = useState(0)

  const fetchArticles = useCallback(async () => {
    setLoading(true)
    let q = supabase.from('articles')
      .select('id,title,slug,excerpt,cover_image,category,published_at,created_at', { count:'exact' })
      .eq('published', true)
      .order('published_at', { ascending:false })
      .range(page * PAGE_SIZE, (page+1)*PAGE_SIZE - 1)

    if (category !== 'all') q = q.eq('category', category)
    if (search.trim()) q = q.ilike('title', `%${search.trim()}%`)

    const { data, count } = await q
    setArticles(data || [])
    setTotal(count || 0)
    setLoading(false)
  }, [category, search, page])

  useEffect(() => { setPage(0) }, [category, search])
  useEffect(() => { fetchArticles() }, [fetchArticles])

  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <main style={{ paddingTop:'68px' }}>
      <div style={{ background:`linear-gradient(to bottom, rgba(0,92,46,0.12), transparent)`, borderBottom:'1px solid var(--color-border)', padding:'60px 24px 48px' }}>
        <div style={{ maxWidth:'1280px', margin:'0 auto' }}>
          <p style={{ fontSize:'11px', fontWeight:600, color:'var(--color-brand-light)', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'10px' }}>Stay Informed</p>
          <h1 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(32px,5vw,56px)', fontWeight:900, color:'var(--color-text)', letterSpacing:'-0.04em', marginBottom:'24px' }}>News</h1>

          <div style={{ position:'relative', maxWidth:'440px' }}>
            <span style={{ position:'absolute', left:'14px', top:'50%', transform:'translateY(-50%)', color:'var(--color-text-dim)', fontSize:'14px' }}>ðŸ”</span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search articlesâ€¦"
              style={{ width:'100%', padding:'11px 16px 11px 40px', borderRadius:'10px', fontSize:'14px',
                background:'var(--color-surface)', border:'1px solid var(--color-border)', color:'var(--color-text)',
                outline:'none', transition:'border-color 0.2s',
              }}
              onFocus={e=>e.target.style.borderColor='var(--color-brand-light)'}
              onBlur={e=>e.target.style.borderColor='var(--color-border)'}
            />
          </div>
        </div>
      </div>

      <div style={{ maxWidth:'1280px', margin:'0 auto', padding:'32px 24px 80px' }}>
        <div style={{ display:'flex', gap:'8px', flexWrap:'wrap', marginBottom:'32px' }}>
          {CATEGORIES.map(c => (
            <button key={c.value} onClick={() => setCategory(c.value)} style={{
              padding:'7px 16px', borderRadius:'999px', fontSize:'12px', fontWeight:500, cursor:'pointer',
              background: category===c.value ? 'var(--color-brand)' : 'var(--color-surface)',
              color: category===c.value ? '#fff' : 'var(--color-text-muted)',
              border:`1px solid ${category===c.value ? 'var(--color-brand)' : 'var(--color-border)'}`,
              transition:'all 0.2s',
            }}>{c.label}</button>
          ))}
        </div>

        {!loading && <p style={{ fontSize:'12px', color:'var(--color-text-dim)', marginBottom:'24px' }}>{total} article{total!==1 ? 's' : ''} found</p>}

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:'16px' }}>
          {loading
            ? Array(6).fill(0).map((_,i) => <ArticleCardSkeleton key={i} />)
            : articles.length === 0
              ? <div style={{ gridColumn:'1/-1', textAlign:'center', padding:'60px', color:'var(--color-text-muted)' }}>No articles found. Try a different search or category.</div>
              : articles.map(a => <ArticleCard key={a.id} article={a} />)
          }
        </div>

        {totalPages > 1 && (
          <div style={{ display:'flex', gap:'8px', justifyContent:'center', marginTop:'48px' }}>
            <button disabled={page===0} onClick={() => setPage(p=>p-1)} style={{ padding:'8px 16px', borderRadius:'8px', fontSize:'13px', fontWeight:500, cursor:page===0?'not-allowed':'pointer', background:'var(--color-surface)', color: page===0?'var(--color-text-dim)':'var(--color-text)', border:'1px solid var(--color-border)', opacity: page===0?0.4:1 }}>â† Prev</button>
            {Array.from({length:totalPages}).map((_,i) => (
              <button key={i} onClick={() => setPage(i)} style={{ width:'36px', height:'36px', borderRadius:'8px', fontSize:'13px', fontWeight:600, cursor:'pointer', background: page===i?'var(--color-brand)':'var(--color-surface)', color: page===i?'#fff':'var(--color-text-muted)', border:`1px solid ${page===i?'var(--color-brand)':'var(--color-border)'}`, transition:'all 0.2s' }}>{i+1}</button>
            ))}
            <button disabled={page===totalPages-1} onClick={() => setPage(p=>p+1)} style={{ padding:'8px 16px', borderRadius:'8px', fontSize:'13px', fontWeight:500, cursor:page===totalPages-1?'not-allowed':'pointer', background:'var(--color-surface)', color: page===totalPages-1?'var(--color-text-dim)':'var(--color-text)', border:'1px solid var(--color-border)', opacity: page===totalPages-1?0.4:1 }}>Next â†’</button>
          </div>
        )}
      </div>
    </main>
  )
}
