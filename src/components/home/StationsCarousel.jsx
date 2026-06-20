import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Play, Pause, MoreHorizontal } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { STATIONS_SEED } from '../../lib/utils'
import { usePlayer } from '../../context/PlayerContext'

function StationChip({ station }) {
  const { play, activeStation, playing } = usePlayer()
  const isActive  = activeStation?.id === station.id || activeStation?.slug === station.slug
  const isPlaying = isActive && playing

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      gap: '10px', padding: '16px 12px', borderRadius: '16px',
      background: 'var(--color-surface)',
      border: `1px solid ${isActive ? station.color + '66' : 'var(--color-border)'}`,
      transition: 'all 0.25s var(--ease-out-expo)', cursor: 'pointer',
      boxShadow: isActive ? `0 0 20px ${station.color}25` : 'none',
      position: 'relative', overflow: 'hidden',
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = station.color + '77'; e.currentTarget.style.transform = 'translateY(-3px)' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = isActive ? station.color + '66' : 'var(--color-border)'; e.currentTarget.style.transform = 'none' }}
    >
      <div style={{ position: 'absolute', top: '-16px', right: '-16px', width: '60px', height: '60px', borderRadius: '50%', background: station.color, opacity: isActive ? 0.12 : 0.05, filter: 'blur(16px)' }} />

      <div style={{ width: '72px', height: '72px', borderRadius: '16px', background: `${station.color}18`, border: `1.5px solid ${station.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
        {station.cover_image
          ? <img src={station.cover_image} alt={station.name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '8px' }} />
          : <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '13px', color: station.color }}>{station.frequency}</span>
        }
        {isPlaying && (
          <div style={{ position: 'absolute', inset: 0, background: `${station.color}CC`, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '20px' }}>
              {[1,2,3,4].map(i => <div key={i} style={{ width: '3px', borderRadius: '2px', background: '#fff', animation: `wave-bar 0.7s ease-in-out ${i*0.1}s infinite`, transformOrigin: 'bottom', height: `${[10,18,13,16][i-1]}px` }} />)}
            </div>
          </div>
        )}
      </div>

      <p style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text)', textAlign: 'center', lineHeight: 1.3, letterSpacing: '-0.01em' }}>{station.name.replace(' FM','')}<span style={{ color: station.color }}> FM</span></p>
      <p style={{ fontSize: '14px', color: 'var(--color-text-dim)', textAlign: 'center', lineHeight: 1.3 }}>{station.location.split(',')[0]}</p>

      <div style={{ display: 'flex', gap: '4px', width: '100%' }}>
        <button onClick={() => play(station)} style={{
          flex: 1, padding: '8px 0', borderRadius: '6px', fontSize: '14px', fontWeight: 700, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
          background: isPlaying ? station.color : `${station.color}18`,
          color: isPlaying ? '#fff' : station.color,
          border: `1px solid ${station.color}44`, transition: 'all 0.2s',
        }}>
          {isPlaying ? <><Pause size={13}/>Pause</> : <><Play size={13}/>Listen</>}
        </button>
        <Link to={`/stations/${station.slug}`} onClick={e => e.stopPropagation()} style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
          padding: '8px 10px', borderRadius: '6px', fontSize: '14px', fontWeight: 600,
          background: 'var(--color-surface-2)', border: '1px solid var(--color-border)',
          color: 'var(--color-text-dim)', transition: 'all 0.2s',
        }}><MoreHorizontal size={13}/>More</Link>
      </div>
    </div>
  )
}

export default function StationsCarousel() {
  const [stations, setStations] = useState([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    supabase.from('stations').select('*').eq('active', true).order('sort_order')
      .then(({ data }) => { setStations(data?.length ? data : STATIONS_SEED); setLoading(false) })
  }, [])

  return (
    <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '48px 24px 56px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-brand-light)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Our Frequencies</p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(22px,3vw,30px)', fontWeight: 900, color: 'var(--color-text)', letterSpacing: '-0.04em' }}>8 Stations, One Network</h2>
        </div>
        <Link to="/stations" style={{ fontSize: '14px', color: 'var(--color-accent)', fontWeight: 600, whiteSpace: 'nowrap' }}>View all →</Link>
      </div>

      <div className="stations-home-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
        {loading
          ? Array(8).fill(0).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: '178px', borderRadius: '16px' }} />
            ))
          : stations.map(s => <StationChip key={s.id ?? s.slug} station={s} />)
        }
      </div>

      <style>{`
        .stations-home-grid .station-chip { width: 100% !important; flex: unset !important; }
        @media (max-width: 900px)  { .stations-home-grid { grid-template-columns: repeat(3, 1fr) !important; } }
        @media (max-width: 640px)  { .stations-home-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 400px)  { .stations-home-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  )
}
