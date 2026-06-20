import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { STATIONS_SEED } from '../../lib/utils'
import { usePlayer } from '../../context/PlayerContext'
import { LiveBadge } from '../../components/ui/Badge'

function VolumeIcon({ level }) {
  return level > 0.5 ? 'ðŸ”Š' : level > 0 ? 'ðŸ”‰' : 'ðŸ”‡'
}

function PlayerCard({ station }) {
  const { play, stop, activeStation, playing, volume, changeVolume } = usePlayer()
  const isActive = activeStation?.id === station.id || activeStation?.slug === station.slug
  const isPlaying = isActive && playing
  const hasStream = !!station.stream_url

  return (
    <div style={{
      background:'var(--color-surface)', borderRadius:'20px',
      border:`2px solid ${isActive ? station.color_hex+'66' : 'var(--color-border)'}`,
      padding:'28px', transition:'all 0.35s var(--ease-out-expo)',
      boxShadow: isActive ? `0 0 40px ${station.color_hex}22, var(--shadow-card)` : 'var(--shadow-card)',
      position:'relative', overflow:'hidden',
    }}>
      <div style={{ position:'absolute', top:'-40px', right:'-40px', width:'160px', height:'160px', borderRadius:'50%', background:station.color_hex, opacity:isActive ? 0.12 : 0.04, filter:'blur(40px)', transition:'opacity 0.4s' }} />

      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:'24px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'14px' }}>
          <div style={{
            width:'52px', height:'52px', borderRadius:'14px', flexShrink:0,
            background:`${station.color_hex}22`, border:`1px solid ${station.color_hex}44`,
            display:'flex', alignItems:'center', justifyContent:'center',
          }}>
            <span style={{ fontFamily:'var(--font-display)', fontWeight:900, fontSize:'13px', color:station.color_hex }}>{station.frequency}</span>
          </div>
          <div>
            <h3 style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'18px', color:'var(--color-text)', letterSpacing:'-0.03em' }}>{station.name}</h3>
            <p style={{ fontSize:'12px', color:'var(--color-text-muted)', marginTop:'2px' }}>{station.tagline}</p>
          </div>
        </div>
        {isActive && <LiveBadge />}
      </div>

      <p style={{ fontSize:'12px', color:'var(--color-text-dim)', marginBottom:'20px' }}>ðŸ“ {station.location}</p>

      {isPlaying && (
        <div style={{ display:'flex', alignItems:'flex-end', gap:'3px', height:'32px', marginBottom:'20px' }}>
          {Array.from({length:20}).map((_,i) => (
            <div key={i} style={{
              flex:1, borderRadius:'2px',
              background: station.color_hex,
              animation:`wave-bar ${0.6+(i%4)*0.15}s ease-in-out ${i*0.06}s infinite`,
              transformOrigin:'bottom',
              height:`${12 + Math.floor(Math.sin(i*0.8)*10+10)}px`,
              opacity:0.7,
            }} />
          ))}
        </div>
      )}

      <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
        <button onClick={() => hasStream ? (isActive ? (isPlaying ? stop() : play(station)) : play(station)) : null}
          disabled={!hasStream}
          style={{
            width:'100%', padding:'12px', borderRadius:'12px', fontSize:'14px', fontWeight:700,
            cursor: hasStream ? 'pointer' : 'not-allowed',
            background: isPlaying ? station.color_hex : hasStream ? `${station.color_hex}22` : 'var(--color-surface-2)',
            color: isPlaying ? '#fff' : hasStream ? station.color_hex : 'var(--color-text-dim)',
            border:`1px solid ${station.color_hex}55`,
            transition:'all 0.25s var(--ease-out-expo)',
            opacity: hasStream ? 1 : 0.5,
          }}
          onMouseEnter={e=>{ if(hasStream && !isPlaying) { e.currentTarget.style.background=`${station.color_hex}33` }}}
          onMouseLeave={e=>{ if(!isPlaying) { e.currentTarget.style.background=`${station.color_hex}22` }}}
        >
          {!hasStream ? 'Stream unavailable' : isPlaying ? 'â™â™  Pause Stream' : 'â–¶  Play Stream'}
        </button>

        {isActive && (
          <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
            <span style={{ fontSize:'14px' }}><VolumeIcon level={volume} /></span>
            <input type="range" min="0" max="1" step="0.05" value={volume}
              onChange={e => changeVolume(parseFloat(e.target.value))}
              style={{ flex:1, accentColor: station.color_hex, cursor:'pointer', height:'4px' }}
            />
            <span style={{ fontSize:'11px', color:'var(--color-text-dim)', minWidth:'30px' }}>{Math.round(volume*100)}%</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default function Live() {
  const [stations, setStations] = useState([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    supabase.from('stations').select('*').eq('active',true).order('sort_order')
      .then(({ data }) => { setStations(data?.length ? data : STATIONS_SEED); setLoading(false) })
  }, [])

  return (
    <main style={{ paddingTop:'68px' }}>
      <div style={{ background:`linear-gradient(to bottom, rgba(0,92,46,0.15), transparent)`, borderBottom:'1px solid var(--color-border)', padding:'60px 24px 48px' }}>
        <div style={{ maxWidth:'1280px', margin:'0 auto' }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:'8px', marginBottom:'16px',
            padding:'5px 14px', borderRadius:'999px', background:'rgba(255,59,48,0.1)', border:'1px solid rgba(255,59,48,0.25)' }}>
            <span style={{ width:'7px', height:'7px', borderRadius:'50%', background:'var(--color-live)', animation:'pulse-live 1.4s infinite' }} />
            <span style={{ fontSize:'11px', fontWeight:700, color:'var(--color-live)', letterSpacing:'0.08em', textTransform:'uppercase' }}>Live Broadcast</span>
          </div>
          <h1 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(32px,5vw,56px)', fontWeight:900, color:'var(--color-text)', letterSpacing:'-0.04em', marginBottom:'12px' }}>
            Listen Live
          </h1>
          <p style={{ fontSize:'16px', color:'var(--color-text-muted)', maxWidth:'520px' }}>
            Stream any of our 7 FM stations live. Pick a station, hit play â€” it's that simple.
          </p>
        </div>
      </div>

      <div style={{ maxWidth:'1280px', margin:'0 auto', padding:'48px 24px 80px' }}>
        {loading
          ? <p style={{ color:'var(--color-text-muted)' }}>Loading stationsâ€¦</p>
          : <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px, 1fr))', gap:'20px' }}>
              {stations.map(s => <PlayerCard key={s.id ?? s.slug} station={s} />)}
            </div>
        }
      </div>
    </main>
  )
}
