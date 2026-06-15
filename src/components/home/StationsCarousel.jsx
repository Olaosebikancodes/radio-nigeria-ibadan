import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { STATIONS_SEED } from '../../lib/utils'
import { usePlayer } from '../../context/PlayerContext'
import { StationCardSkeleton } from '../ui/Skeleton'

function StationCard({ station }) {
  const { play, activeStation, playing } = usePlayer()
  const isActive = activeStation?.id === station.id

  return (
    <div style={{
      background:'var(--color-surface)', borderRadius:'16px',
      border:`1px solid ${isActive ? station.color_hex+'55' : 'var(--color-border)'}`,
      padding:'24px', transition:'all 0.3s var(--ease-out-expo)',
      boxShadow: isActive ? `0 0 24px ${station.color_hex}22` : 'none',
      cursor:'pointer', position:'relative', overflow:'hidden',
    }}
      onMouseEnter={e=>{ e.currentTarget.style.borderColor = station.color_hex+'66'; e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow=`0 12px 32px ${station.color_hex}22` }}
      onMouseLeave={e=>{ e.currentTarget.style.borderColor = isActive ? station.color_hex+'55' : 'var(--color-border)'; e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow= isActive ? `0 0 24px ${station.color_hex}22` : 'none' }}
    >
      {/* Color blob */}
      <div style={{ position:'absolute', top:'-20px', right:'-20px', width:'80px', height:'80px', borderRadius:'50%', background:station.color_hex, opacity:0.08, filter:'blur(20px)' }} />

      {/* Frequency badge */}
      <div style={{
        display:'inline-flex', alignItems:'center', justifyContent:'center',
        width:'48px', height:'48px', borderRadius:'12px', marginBottom:'16px',
        background:`${station.color_hex}20`, border:`1px solid ${station.color_hex}40`,
      }}>
        <span style={{ fontFamily:'var(--font-display)', fontWeight:900, fontSize:'13px', color:station.color_hex }}>
          {station.frequency}
        </span>
      </div>

      <p style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'16px', color:'var(--color-text)', marginBottom:'4px', letterSpacing:'-0.02em' }}>{station.name}</p>
      <p style={{ fontSize:'12px', color:'var(--color-text-muted)', marginBottom:'4px' }}>{station.tagline}</p>
      <p style={{ fontSize:'11px', color:'var(--color-text-dim)', marginBottom:'20px' }}>{station.location}</p>

      <div style={{ display:'flex', gap:'8px' }}>
        <button onClick={() => play(station)} style={{
          flex:1, padding:'8px', borderRadius:'8px', fontSize:'12px', fontWeight:600, cursor:'pointer',
          background: isActive && playing ? station.color_hex : 'transparent',
          color: isActive && playing ? '#fff' : station.color_hex,
          border:`1px solid ${station.color_hex}55`,
          transition:'all 0.2s',
        }}>
          {isActive && playing ? '❙❙ Pause' : '▶ Listen'}
        </button>
        <Link to={`/stations/${station.slug}`} style={{
          display:'flex', alignItems:'center', justifyContent:'center',
          width:'36px', height:'36px', borderRadius:'8px',
          background:'var(--color-surface-2)', border:'1px solid var(--color-border)',
          color:'var(--color-text-muted)', fontSize:'13px',
          transition:'all 0.2s',
        }}>→</Link>
      </div>
    </div>
  )
}

export default function StationsCarousel() {
  const [stations, setStations] = useState([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    supabase.from('stations').select('*').eq('active',true).order('sort_order')
      .then(({ data }) => { setStations(data?.length ? data : STATIONS_SEED); setLoading(false) })
  }, [])

  return (
    <section style={{ maxWidth:'1280px', margin:'0 auto', padding:'80px 24px' }}>
      <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:'40px', flexWrap:'wrap', gap:'16px' }}>
        <div>
          <p style={{ fontSize:'11px', fontWeight:600, color:'var(--color-brand-light)', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'8px' }}>Our Frequencies</p>
          <h2 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(28px,4vw,40px)', fontWeight:900, color:'var(--color-text)', letterSpacing:'-0.04em' }}>7 Stations, One Network</h2>
        </div>
        <Link to="/stations" style={{ fontSize:'13px', color:'var(--color-accent)', fontWeight:600 }}>View all →</Link>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(220px, 1fr))', gap:'16px' }}>
        {loading
          ? Array(7).fill(0).map((_,i) => <StationCardSkeleton key={i} />)
          : stations.map(s => <StationCard key={s.id ?? s.slug} station={s} />)
        }
      </div>
    </section>
  )
}
