import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { usePlayer } from '../../context/PlayerContext'
import { Skeleton } from '../../components/ui/Skeleton'

function normalizeUrl(url) {
  if (!url) return ''
  return /^https?:\/\//i.test(url) ? url : `https://${url}`
}

function AdvertCard({ ad }) {
  const href = normalizeUrl(ad.link_url)
  const inner = ad.image_url
    ? <img src={ad.image_url} alt={ad.title} style={{ width:'100%', height:'180px', objectFit:'cover', display:'block' }} />
    : <div style={{ height:'180px', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--color-surface-2)', fontSize:'13px', color:'var(--color-text-muted)' }}>{ad.title}</div>
  const cardStyle = { borderRadius:'14px', overflow:'hidden', border:'1px solid var(--color-border)', background:'var(--color-surface)', display:'block', textDecoration:'none', transition:'transform 0.2s' }
  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" style={cardStyle}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)' }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'none' }}>
        {inner}
      </a>
    )
  }
  return <div style={cardStyle}>{inner}</div>
}

export default function StationDetail() {
  const { slug } = useParams()
  const [station, setStation] = useState(null)
  const [adverts, setAdverts] = useState([])
  const [loading, setLoading] = useState(true)
  const { play, activeStation, playing } = usePlayer()

  useEffect(() => {
    const load = async () => {
      const { data: s } = await supabase.from('stations').select('*').eq('slug', slug).single()
      setStation(s ?? null)
      if (s) {
        const { data: ads } = await supabase
          .from('adverts')
          .select('*')
          .eq('active', true)
          .or(`station_id.eq.${s.id},station_id.is.null`)
          .order('sort_order')
        setAdverts(ads || [])
      }
      setLoading(false)
    }
    load()
  }, [slug])

  if (loading) return <main style={{ paddingTop:'104px', maxWidth:'1280px', margin:'0 auto', padding:'100px 24px' }}><Skeleton height="60px" width="50%" style={{marginBottom:'16px'}}/><Skeleton height="20px" width="30%"/></main>
  if (!station) return <main style={{ paddingTop:'104px', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'60vh', gap:'16px' }}><p style={{fontSize:'48px'}}>📻</p><h2 style={{fontFamily:'var(--font-display)',fontSize:'28px',color:'var(--color-text)'}}>Station not found</h2><Link to="/stations" style={{color:'var(--color-accent)',fontSize:'14px'}}>← All Stations</Link></main>

  const isActive  = activeStation?.id === station.id
  const isPlaying = isActive && playing

  return (
    <main style={{ paddingTop:'104px' }}>
      {/* Hero */}
      <div style={{ background:`linear-gradient(135deg, ${station.color_hex}22 0%, rgba(0,0,0,0) 60%), var(--color-surface)`, borderBottom:'1px solid var(--color-border)', padding:'48px 24px 40px' }}>
        <div style={{ maxWidth:'1280px', margin:'0 auto' }}>
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
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'16px' }}>
            <p style={{ fontSize:'13px', color:'var(--color-text-dim)' }}>📍 {station.location}</p>
            <button onClick={() => play(station)} disabled={!station.stream_url} style={{
              display:'flex', alignItems:'center', gap:'10px',
              padding:'12px 24px', borderRadius:'12px', fontSize:'14px', fontWeight:700, cursor: station.stream_url?'pointer':'not-allowed',
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
      </div>

      <div style={{ maxWidth:'1280px', margin:'0 auto', padding:'48px 24px 80px' }}>
        {/* About */}
        <div style={{ marginBottom:'40px' }}>
          <h2 style={{ fontFamily:'var(--font-display)', fontSize:'22px', fontWeight:700, color:'var(--color-text)', marginBottom:'12px', letterSpacing:'-0.03em' }}>About {station.name}</h2>
          {station.description
            ? <p style={{ color:'var(--color-text-muted)', lineHeight:1.75, fontSize:'15px' }}>{station.description}</p>
            : <p style={{ color:'var(--color-text-dim)', lineHeight:1.75, fontSize:'15px', fontStyle:'italic' }}>{station.name} is one of the Radio Nigeria network stations serving listeners across the region with news, music, and community programming around the clock.</p>
          }
        </div>

        {/* Social media */}
        {(station.social_facebook || station.social_youtube) && (
          <div style={{ marginBottom:'40px' }}>
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

        {/* Adverts */}
        {adverts.length > 0 && (
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px' }} className="advert-grid">
            {adverts.map(ad => <AdvertCard key={ad.id} ad={ad} />)}
          </div>
        )}
      </div>

      <style>{`
        @media(max-width:600px){ .advert-grid{ grid-template-columns:1fr !important; } }
      `}</style>
    </main>
  )
}
