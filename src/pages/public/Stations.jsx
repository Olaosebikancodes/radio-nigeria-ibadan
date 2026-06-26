import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Play, Pause } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { STATIONS_SEED } from '../../lib/utils'
import { usePlayer } from '../../context/PlayerContext'
import { StationCardSkeleton } from '../../components/ui/Skeleton'

export default function Stations() {
  const [stations, setStations] = useState([])
  const [loading, setLoading]   = useState(true)
  const { play, activeStation, playing } = usePlayer()

  useEffect(() => {
    // Fetches only stations where active=true, ordered by sort_order.
    // If no stations are returned from the database, it falls back to STATIONS_SEED
    // (a hardcoded list in src/lib/utils.js) so the page never appears empty.
    supabase.from('stations').select('*').eq('active',true).order('sort_order')
      .then(({ data }) => { setStations(data?.length ? data : STATIONS_SEED); setLoading(false) })
  }, [])

  return (
    <main className="inner-page-main">
      <style>{`
        .inner-page-main { padding-top: 140px; }
        @media (max-width: 768px) { .inner-page-main { padding-top: 104px; } }
        @media (max-width: 400px) { .inner-page-main { padding-top: 88px; } }
      `}</style>
      <div style={{ background:`linear-gradient(to bottom, rgba(0,92,46,0.12), transparent)`, borderBottom:'1px solid var(--color-border)', padding:'60px 24px 48px' }}>
        <div style={{ maxWidth:'1280px', margin:'0 auto' }}>
          <p style={{ fontSize:'17px', fontWeight:600, color:'var(--color-brand-light)', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'10px' }}>FRCN South West Zone</p>
          <h1 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(32px,5vw,56px)', fontWeight:900, color:'var(--color-text)', letterSpacing:'0.04em', marginBottom:'12px' }}>SOUTH WEST FM STATIONS</h1>
          <p style={{ fontSize:'18px', color:'var(--color-text-muted)', maxWidth:'560px' }}>Ibadan Zonal Station.</p>
        </div>
      </div>

      <div style={{ maxWidth:'1280px', margin:'0 auto', padding:'48px 24px 80px' }}>
        {loading
          ? <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'20px' }} className="stations-grid">{Array(7).fill(0).map((_,i)=><StationCardSkeleton key={i}/>)}</div>
          : <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'20px' }} className="stations-grid">
              {stations.map(s => {
                const isActive = activeStation?.id===s.id || activeStation?.slug===s.slug
                const isPlaying = isActive && playing
                return (
                  <div key={s.id??s.slug} style={{ background:'var(--color-surface)', borderRadius:'20px', border:`2px solid ${isActive?s.color_hex+'66':'var(--color-border)'}`, padding:'28px', transition:'all 0.3s var(--ease-out-expo)', position:'relative', overflow:'hidden', boxShadow:isActive?`0 0 32px ${s.color_hex}22`:'none' }}>
                    <div style={{ position:'absolute', top:'-30px', right:'-30px', width:'120px', height:'120px', borderRadius:'50%', background:s.color_hex, opacity:0.07, filter:'blur(30px)' }} />

                    <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:'20px' }}>
                      <div style={{ width:'64px', height:'64px', borderRadius:'14px', background:`${s.color_hex}12`, border:`1px solid ${s.color_hex}30`, display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden', flexShrink:0 }}>
                        {s.cover_image
                          ? <img src={s.cover_image} alt={s.name} style={{ width:'100%', height:'100%', objectFit:'contain', padding:'4px' }} />
                          : <span style={{ fontFamily:'var(--font-display)', fontWeight:900, fontSize:'18px', color:s.color_hex }}>{s.frequency}</span>
                        }
                      </div>
                      {isActive && (
                        <div style={{ display:'flex', alignItems:'flex-end', gap:'2px', height:'20px' }}>
                          {[1,2,3,4].map(i=>(
                            <div key={i} style={{ width:'3px', borderRadius:'2px', background:s.color_hex, animation:isPlaying?`wave-bar 0.8s ease-in-out ${i*0.1}s infinite`:'none', height:`${[8,16,12,14][i-1]}px`, opacity:0.8, transformOrigin:'bottom' }}/>
                          ))}
                        </div>
                      )}
                    </div>

                    <h3 style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'20px', color:'var(--color-text)', letterSpacing:'-0.03em', marginBottom:'6px' }}>{s.name}</h3>
                    <p style={{ fontSize:'17px', color:'var(--color-text-muted)', marginBottom:'4px', fontStyle:'italic' }}>"{s.tagline}"</p>
                    <p style={{ fontSize:'15px', color:'var(--color-text-dim)', marginBottom:'20px', display:'flex', alignItems:'center', gap:'5px' }}><MapPin size={14}/>{s.location}</p>

                    <div style={{ display:'flex', gap:'8px' }}>
                      <button onClick={()=>play(s)} style={{ flex:1, padding:'10px', borderRadius:'10px', fontSize:'14px', fontWeight:600, cursor:'pointer', background:isPlaying?s.color_hex:`${s.color_hex}15`, color:isPlaying?'#fff':s.color_hex, border:`1px solid ${s.color_hex}44`, transition:'all 0.2s', display:'flex', alignItems:'center', justifyContent:'center', gap:'6px' }}>
                        {isPlaying ? <><Pause size={14}/>Pause</> : <><Play size={14}/>Listen Live</>}
                      </button>
                      <Link to={`/stations/${s.slug}`} style={{ display:'flex', alignItems:'center', justifyContent:'center', padding:'10px 14px', borderRadius:'10px', fontSize:'14px', fontWeight:500, background:'var(--color-surface-2)', color:'var(--color-text-muted)', border:'1px solid var(--color-border)', transition:'all 0.2s', whiteSpace:'nowrap' }}>More</Link>
                    </div>
                  </div>
                )
              })}
            </div>
        }
      </div>
      <style>{`
        @media(max-width:1100px){ .stations-grid{ grid-template-columns:repeat(3,1fr) !important; } }
        @media(max-width:760px) { .stations-grid{ grid-template-columns:repeat(2,1fr) !important; } }
        @media(max-width:480px) { .stations-grid{ grid-template-columns:1fr !important; } }
      `}</style>
    </main>
  )
}
