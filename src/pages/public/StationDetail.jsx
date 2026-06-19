import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { usePlayer } from '../../context/PlayerContext'
import { todayName, formatTime, isOnAir, timeAgo } from '../../lib/utils'
import { LiveBadge, Badge } from '../../components/ui/Badge'
import { Skeleton } from '../../components/ui/Skeleton'

export default function StationDetail() {
  const { slug } = useParams()
  const [station, setStation]     = useState(null)
  const [programmes, setProgrammes] = useState([])
  const [articles, setArticles]   = useState([])
  const [loading, setLoading]     = useState(true)
  const { play, activeStation, playing } = usePlayer()

  useEffect(() => {
    const load = async () => {
      const { data: s } = await supabase.from('stations').select('*').eq('slug', slug).single()
      if (!s) { setLoading(false); return }
      setStation(s)
      const today = todayName()
      const [{ data: progs }, { data: arts }] = await Promise.all([
        supabase.from('programmes').select('*').eq('station_id', s.id).contains('days',[today]).eq('active',true).order('start_time'),
        supabase.from('articles').select('id,title,slug,cover_image,category,published_at,created_at').eq('station_id', s.id).eq('published',true).order('published_at',{ascending:false}).limit(4),
      ])
      setProgrammes(progs || []); setArticles(arts || [])
      setLoading(false)
    }
    load()
  }, [slug])

  if (loading) return <main style={{ paddingTop:'68px', maxWidth:'1280px', margin:'0 auto', padding:'100px 24px' }}><Skeleton height="60px" width="50%" style={{marginBottom:'16px'}}/><Skeleton height="20px" width="30%"/></main>
  if (!station) return <main style={{ paddingTop:'68px', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'60vh', gap:'16px' }}><p style={{fontSize:'48px'}}>📻</p><h2 style={{fontFamily:'var(--font-display)',fontSize:'28px',color:'var(--color-text)'}}>Station not found</h2><Link to="/stations" style={{color:'var(--color-accent)',fontSize:'14px'}}>← All Stations</Link></main>

  const isActive  = activeStation?.id === station.id
  const isPlaying = isActive && playing

  return (
    <main style={{ paddingTop:'68px' }}>
      {/* Hero */}
      <div style={{ background:`linear-gradient(135deg, ${station.color_hex}22 0%, rgba(0,0,0,0) 60%), var(--color-surface)`, borderBottom:'1px solid var(--color-border)', padding:'64px 24px 48px' }}>
        <div style={{ maxWidth:'1280px', margin:'0 auto', display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexWrap:'wrap', gap:'24px' }}>
          <div>
            <Link to="/stations" style={{ fontSize:'12px', color:'var(--color-text-dim)', display:'inline-flex', alignItems:'center', gap:'6px', marginBottom:'24px' }}>← All Stations</Link>
            <div style={{ display:'flex', alignItems:'center', gap:'20px', marginBottom:'16px' }}>
              <div style={{ width:'80px', height:'80px', borderRadius:'18px', background:`${station.color_hex}18`, border:`2px solid ${station.color_hex}44`, display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden', flexShrink:0 }}>
                {station.cover_image
                  ? <img src={station.cover_image} alt={station.name} style={{ width:'100%', height:'100%', objectFit:'contain', padding:'6px' }} />
                  : <span style={{ fontFamily:'var(--font-display)', fontWeight:900, fontSize:'18px', color:station.color_hex }}>{station.frequency}</span>
                }
              </div>
              <div>
                <h1 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(28px,4vw,48px)', fontWeight:900, color:'var(--color-text)', letterSpacing:'-0.04em' }}>{station.name}</h1>
                <p style={{ fontSize:'14px', color:'var(--color-text-muted)', fontStyle:'italic' }}>"{station.tagline}"</p>
              </div>
            </div>
            <p style={{ fontSize:'13px', color:'var(--color-text-dim)' }}>📍 {station.location}</p>
          </div>

          <button onClick={() => play(station)} disabled={!station.stream_url} style={{
            display:'flex', alignItems:'center', gap:'10px',
            padding:'14px 28px', borderRadius:'12px', fontSize:'15px', fontWeight:700, cursor: station.stream_url?'pointer':'not-allowed',
            background:isPlaying ? station.color_hex : `${station.color_hex}20`,
            color: isPlaying ? '#fff' : station.color_hex,
            border:`2px solid ${station.color_hex}55`,
            transition:'all 0.25s', opacity: station.stream_url ? 1 : 0.5,
            boxShadow: isPlaying ? `0 0 24px ${station.color_hex}44` : 'none',
          }}>
            {isPlaying ? '❙❙ Pause Stream' : '▶ Listen Live'}
            {isActive && <span style={{ width:'8px', height:'8px', borderRadius:'50%', background: isPlaying?'#4EFF8C':station.color_hex, animation:'pulse-live 1.4s infinite' }} />}
          </button>
        </div>
      </div>

      <div className="station-body-grid" style={{ maxWidth:'1280px', margin:'0 auto', padding:'48px 24px 80px', display:'grid', gridTemplateColumns:'1fr 360px', gap:'40px' }}>
        {/* Left */}
        <div>
          {station.description && (
            <div style={{ marginBottom:'40px' }}>
              <h2 style={{ fontFamily:'var(--font-display)', fontSize:'22px', fontWeight:700, color:'var(--color-text)', marginBottom:'12px', letterSpacing:'-0.03em' }}>About {station.name}</h2>
              <p style={{ color:'var(--color-text-muted)', lineHeight:1.75, fontSize:'15px' }}>{station.description}</p>
            </div>
          )}

          {/* Social media */}
          {(station.social_facebook || station.social_twitter || station.social_instagram || station.social_youtube) && (
            <div style={{ marginBottom:'48px' }}>
              <h2 style={{ fontFamily:'var(--font-display)', fontSize:'22px', fontWeight:700, color:'var(--color-text)', marginBottom:'16px', letterSpacing:'-0.03em' }}>Follow {station.name}</h2>
              <div style={{ display:'flex', flexWrap:'wrap', gap:'12px' }}>
                {station.social_facebook && (
                  <a href={station.social_facebook} target="_blank" rel="noopener noreferrer" style={{ display:'flex', alignItems:'center', gap:'10px', padding:'10px 18px', borderRadius:'10px', background:'var(--color-surface)', border:'1px solid var(--color-border)', color:'var(--color-text-muted)', fontSize:'13px', fontWeight:500, transition:'all 0.2s', textDecoration:'none' }}
                    onMouseEnter={e=>{e.currentTarget.style.color='#1877F2';e.currentTarget.style.borderColor='#1877F244';e.currentTarget.style.background='#1877F211';e.currentTarget.style.transform='translateY(-2px)'}}
                    onMouseLeave={e=>{e.currentTarget.style.color='var(--color-text-muted)';e.currentTarget.style.borderColor='var(--color-border)';e.currentTarget.style.background='var(--color-surface)';e.currentTarget.style.transform='none'}}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                    Facebook
                  </a>
                )}
                {station.social_twitter && (
                  <a href={station.social_twitter} target="_blank" rel="noopener noreferrer" style={{ display:'flex', alignItems:'center', gap:'10px', padding:'10px 18px', borderRadius:'10px', background:'var(--color-surface)', border:'1px solid var(--color-border)', color:'var(--color-text-muted)', fontSize:'13px', fontWeight:500, transition:'all 0.2s', textDecoration:'none' }}
                    onMouseEnter={e=>{e.currentTarget.style.color='var(--color-text)';e.currentTarget.style.borderColor='#ffffff33';e.currentTarget.style.background='var(--color-surface-2)';e.currentTarget.style.transform='translateY(-2px)'}}
                    onMouseLeave={e=>{e.currentTarget.style.color='var(--color-text-muted)';e.currentTarget.style.borderColor='var(--color-border)';e.currentTarget.style.background='var(--color-surface)';e.currentTarget.style.transform='none'}}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                    X / Twitter
                  </a>
                )}
                {station.social_instagram && (
                  <a href={station.social_instagram} target="_blank" rel="noopener noreferrer" style={{ display:'flex', alignItems:'center', gap:'10px', padding:'10px 18px', borderRadius:'10px', background:'var(--color-surface)', border:'1px solid var(--color-border)', color:'var(--color-text-muted)', fontSize:'13px', fontWeight:500, transition:'all 0.2s', textDecoration:'none' }}
                    onMouseEnter={e=>{e.currentTarget.style.color='#E1306C';e.currentTarget.style.borderColor='#E1306C44';e.currentTarget.style.background='#E1306C11';e.currentTarget.style.transform='translateY(-2px)'}}
                    onMouseLeave={e=>{e.currentTarget.style.color='var(--color-text-muted)';e.currentTarget.style.borderColor='var(--color-border)';e.currentTarget.style.background='var(--color-surface)';e.currentTarget.style.transform='none'}}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                    Instagram
                  </a>
                )}
                {station.social_youtube && (
                  <a href={station.social_youtube} target="_blank" rel="noopener noreferrer" style={{ display:'flex', alignItems:'center', gap:'10px', padding:'10px 18px', borderRadius:'10px', background:'var(--color-surface)', border:'1px solid var(--color-border)', color:'var(--color-text-muted)', fontSize:'13px', fontWeight:500, transition:'all 0.2s', textDecoration:'none' }}
                    onMouseEnter={e=>{e.currentTarget.style.color='#FF0000';e.currentTarget.style.borderColor='#FF000044';e.currentTarget.style.background='#FF000011';e.currentTarget.style.transform='translateY(-2px)'}}
                    onMouseLeave={e=>{e.currentTarget.style.color='var(--color-text-muted)';e.currentTarget.style.borderColor='var(--color-border)';e.currentTarget.style.background='var(--color-surface)';e.currentTarget.style.transform='none'}}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                    YouTube
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Articles */}
          {articles.length > 0 && (
            <div>
              <h2 style={{ fontFamily:'var(--font-display)', fontSize:'22px', fontWeight:700, color:'var(--color-text)', marginBottom:'20px', letterSpacing:'-0.03em' }}>Latest from {station.name}</h2>
              <div className="station-articles-grid" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px' }}>
                {articles.map(a => (
                  <Link key={a.id} to={`/news/${a.slug}`} style={{ display:'block', background:'var(--color-surface)', borderRadius:'12px', overflow:'hidden', border:'1px solid var(--color-border)', transition:'all 0.2s' }}
                    onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-3px)';e.currentTarget.style.borderColor='var(--color-border-light)'}}
                    onMouseLeave={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.borderColor='var(--color-border)'}}
                  >
                    <div style={{ height:'120px', background:'var(--color-surface-2)', overflow:'hidden' }}>
                      {a.cover_image ? <img src={a.cover_image} alt={a.title} style={{width:'100%',height:'100%',objectFit:'cover'}}/> : <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100%',opacity:0.1,fontSize:'28px'}}>📻</div>}
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
          )}
        </div>

        {/* Right — Today's schedule */}
        <div>
          <div className="station-sidebar-sticky" style={{ background:'var(--color-surface)', borderRadius:'16px', border:'1px solid var(--color-border)', overflow:'hidden', position:'sticky', top:'88px' }}>
            <div style={{ padding:'20px 20px 16px', borderBottom:'1px solid var(--color-border)', background:'var(--color-surface-2)' }}>
              <h3 style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'16px', color:'var(--color-text)' }}>Today's Schedule</h3>
              <p style={{ fontSize:'12px', color:'var(--color-text-dim)', marginTop:'4px' }}>{new Date().toLocaleDateString('en-NG',{weekday:'long',day:'numeric',month:'long'})}</p>
            </div>
            <div style={{ maxHeight:'500px', overflowY:'auto' }}>
              {programmes.length === 0
                ? <p style={{ padding:'24px', fontSize:'13px', color:'var(--color-text-muted)', textAlign:'center' }}>No programmes scheduled today.</p>
                : programmes.map(p => {
                    const live = isOnAir(p.start_time, p.end_time)
                    return (
                      <div key={p.id} style={{ display:'flex', gap:'14px', padding:'14px 20px', borderBottom:'1px solid var(--color-border)', background: live?`${station.color_hex}10`:'transparent' }}>
                        <div style={{ minWidth:'80px' }}>
                          <p style={{ fontSize:'11px', fontWeight:600, color: live?'var(--color-accent)':'var(--color-text-dim)' }}>{formatTime(p.start_time)}</p>
                          <p style={{ fontSize:'10px', color:'var(--color-text-dim)' }}>{formatTime(p.end_time)}</p>
                        </div>
                        <div style={{ flex:1, minWidth:0 }}>
                          <p style={{ fontWeight:600, fontSize:'13px', color:'var(--color-text)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{p.title}</p>
                          {p.host && <p style={{ fontSize:'11px', color:'var(--color-text-dim)', marginTop:'2px' }}>{p.host}</p>}
                        </div>
                        {live && <LiveBadge />}
                      </div>
                    )
                  })
              }
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media(max-width:900px){
          .station-body-grid{ grid-template-columns:1fr !important; }
          .station-sidebar-sticky{ position:static !important; }
        }
        @media(max-width:560px){ .station-articles-grid{ grid-template-columns:1fr !important; } }
      `}</style>
    </main>
  )
}
