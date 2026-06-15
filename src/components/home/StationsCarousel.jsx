import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { STATIONS_SEED } from '../../lib/utils'
import { usePlayer } from '../../context/PlayerContext'

function StationChip({ station }) {
  const { play, activeStation, playing } = usePlayer()
  const isActive  = activeStation?.id === station.id || activeStation?.slug === station.slug
  const isPlaying = isActive && playing

  return (
    <div style={{
      flex: '0 0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center',
      gap: '8px', padding: '14px 10px', borderRadius: '14px', width: '120px',
      background: 'var(--color-surface)',
      border: `1px solid ${isActive ? station.color + '66' : 'var(--color-border)'}`,
      transition: 'all 0.25s var(--ease-out-expo)', cursor: 'pointer',
      boxShadow: isActive ? `0 0 20px ${station.color}25` : 'none',
      position: 'relative', overflow: 'hidden',
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = station.color + '77'; e.currentTarget.style.transform = 'translateY(-3px)' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = isActive ? station.color + '66' : 'var(--color-border)'; e.currentTarget.style.transform = 'none' }}
    >
      {/* Glow blob */}
      <div style={{ position: 'absolute', top: '-16px', right: '-16px', width: '60px', height: '60px', borderRadius: '50%', background: station.color, opacity: isActive ? 0.12 : 0.05, filter: 'blur(16px)' }} />

      {/* Frequency badge */}
      <div style={{ width: '44px', height: '44px', borderRadius: '11px', background: `${station.color}20`, border: `1px solid ${station.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {isPlaying
          ? <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '16px' }}>
              {[1,2,3].map(i => <div key={i} style={{ width: '3px', borderRadius: '2px', background: station.color, animation: `wave-bar 0.7s ease-in-out ${i*0.1}s infinite`, transformOrigin: 'bottom', height: `${[8,14,10][i-1]}px` }} />)}
            </div>
          : <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '11px', color: station.color }}>{station.frequency}</span>
        }
      </div>

      {/* Name */}
      <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text)', textAlign: 'center', lineHeight: 1.3, letterSpacing: '-0.01em' }}>{station.name.replace(' FM','')}<span style={{ color: station.color }}> FM</span></p>
      <p style={{ fontSize: '9px', color: 'var(--color-text-dim)', textAlign: 'center', lineHeight: 1.3 }}>{station.location.split(',')[0]}</p>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: '4px', width: '100%' }}>
        <button onClick={() => play(station)} style={{
          flex: 1, padding: '5px 0', borderRadius: '6px', fontSize: '11px', fontWeight: 700, cursor: 'pointer',
          background: isPlaying ? station.color : `${station.color}18`,
          color: isPlaying ? '#fff' : station.color,
          border: `1px solid ${station.color}44`, transition: 'all 0.2s',
        }}>
          {isPlaying ? '❙❙' : '▶'}
        </button>
        <Link to={`/stations/${station.slug}`} onClick={e => e.stopPropagation()} style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: '28px', borderRadius: '6px', fontSize: '11px',
          background: 'var(--color-surface-2)', border: '1px solid var(--color-border)',
          color: 'var(--color-text-dim)', transition: 'all 0.2s',
        }}>→</Link>
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
          <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-brand-light)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Our Frequencies</p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(22px,3vw,30px)', fontWeight: 900, color: 'var(--color-text)', letterSpacing: '-0.04em' }}>8 Stations, One Network</h2>
        </div>
        <Link to="/stations" style={{ fontSize: '12px', color: 'var(--color-accent)', fontWeight: 600, whiteSpace: 'nowrap' }}>View all →</Link>
      </div>

      {/* Single scrollable row */}
      <div style={{
        display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '8px',
        scrollbarWidth: 'none', msOverflowStyle: 'none',
      }}>
        {loading
          ? Array(8).fill(0).map((_, i) => (
              <div key={i} className="skeleton" style={{ flex: '0 0 120px', height: '160px', borderRadius: '14px' }} />
            ))
          : stations.map(s => <StationChip key={s.id ?? s.slug} station={s} />)
        }
      </div>

      <style>{`::-webkit-scrollbar { display: none; }`}</style>
    </section>
  )
}
