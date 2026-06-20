import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { formatDuration, timeAgo } from '../../lib/utils'
import { usePlayer } from '../../context/PlayerContext'

function AudioCard({ item }) {
  const { play, activeStation, playing, toggle } = usePlayer()
  const isActive  = activeStation?.id === item.id
  const isPlaying = isActive && playing

  const handlePlay = () => {
    if (isActive) toggle()
    else play(item)
  }

  return (
    <div style={{ background:'var(--color-surface)', borderRadius:'14px', overflow:'hidden', border:`1px solid ${isActive ? 'var(--color-brand-light)' : 'var(--color-border)'}`, transition:'border-color 0.2s', display:'flex', flexDirection:'column' }}
      onMouseEnter={e=>{ if (!isActive) e.currentTarget.style.borderColor='var(--color-border-light)' }}
      onMouseLeave={e=>{ if (!isActive) e.currentTarget.style.borderColor='var(--color-border)' }}
    >
      <div style={{ height:'140px', background:'var(--color-surface-2)', position:'relative', overflow:'hidden' }}>
        {item.cover_image
          ? <img src={item.cover_image} alt={item.title} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
          : <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100%',opacity:0.15,fontSize:'36px'}}>ðŸŽ™ï¸</div>
        }
        <button onClick={handlePlay} style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(0,0,0,0.35)', border:'none', cursor:'pointer', opacity: isPlaying ? 1 : 0, transition:'opacity 0.2s' }}
          onMouseEnter={e=>e.currentTarget.style.opacity=1}
          onMouseLeave={e=>{ if (!isPlaying) e.currentTarget.style.opacity=0 }}
        >
          <div style={{ width:'48px', height:'48px', borderRadius:'50%', background:'var(--color-brand)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'18px', color:'#fff' }}>{isPlaying ? 'â™â™' : 'â–¶'}</div>
        </button>
        {isPlaying && (
          <div style={{ position:'absolute', bottom:'8px', left:'8px', display:'flex', alignItems:'flex-end', gap:'2px', height:'16px' }}>
            {[1,2,3,4].map(i=><div key={i} style={{ width:'3px', borderRadius:'2px', background:'var(--color-accent)', animation:`wave-bar 0.7s ease-in-out ${i*0.1}s infinite`, transformOrigin:'bottom', height:`${[8,14,10,12][i-1]}px`}}/>)}
          </div>
        )}
      </div>

      <div style={{ padding:'16px', flex:1, display:'flex', flexDirection:'column', gap:'6px' }}>
        <p style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'15px', color:'var(--color-text)', lineHeight:1.3 }}>{item.title}</p>
        {item.description && <p style={{ fontSize:'12px', color:'var(--color-text-muted)', lineHeight:1.6 }}>{item.description.slice(0,80)}â€¦</p>}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:'auto', paddingTop:'8px' }}>
          <p style={{ fontSize:'11px', color:'var(--color-text-dim)' }}>{item.stations?.name || 'Radio Nigeria'}</p>
          <div style={{ display:'flex', gap:'8px' }}>
            {item.duration_sec && <span style={{ fontSize:'11px', color:'var(--color-text-dim)' }}>â± {formatDuration(item.duration_sec)}</span>}
            <span style={{ fontSize:'11px', color:'var(--color-text-dim)' }}>{timeAgo(item.published_at||item.created_at)}</span>
          </div>
        </div>
      </div>

      <button onClick={handlePlay} style={{ margin:'0 16px 16px', padding:'9px', borderRadius:'8px', fontSize:'13px', fontWeight:600, cursor:'pointer', background:isPlaying?'var(--color-brand)':'var(--color-surface-2)', color:isPlaying?'#fff':'var(--color-text-muted)', border:'1px solid var(--color-border)', transition:'all 0.2s' }}>
        {isPlaying ? 'â™â™  Pause' : 'â–¶  Play Episode'}
      </button>
    </div>
  )
}

export default function Audio() {
  const [items, setItems]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [stationId, setStation] = useState('all')
  const [stations, setStations] = useState([])

  useEffect(() => {
    Promise.all([
      supabase.from('audio_content').select('*, stations(id,name)').eq('published',true).order('published_at',{ascending:false}).limit(24),
      supabase.from('stations').select('id,name').eq('active',true).order('sort_order'),
    ]).then(([{ data:audio }, { data:stats }]) => {
      setItems(audio||[]); setStations(stats||[]); setLoading(false)
    })
  }, [])

  const filtered = stationId==='all' ? items : items.filter(i=>i.stations?.id===stationId)

  return (
    <main style={{ paddingTop:'68px' }}>
      <div style={{ background:`linear-gradient(to bottom, rgba(0,92,46,0.12), transparent)`, borderBottom:'1px solid var(--color-border)', padding:'60px 24px 48px' }}>
        <div style={{ maxWidth:'1280px', margin:'0 auto' }}>
          <p style={{ fontSize:'11px', fontWeight:600, color:'var(--color-brand-light)', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'10px' }}>On Demand</p>
          <h1 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(32px,5vw,56px)', fontWeight:900, color:'var(--color-text)', letterSpacing:'-0.04em', marginBottom:'12px' }}>Audio Archive</h1>
          <p style={{ fontSize:'16px', color:'var(--color-text-muted)', maxWidth:'480px' }}>Listen back to your favourite programmes and special broadcasts.</p>
        </div>
      </div>

      <div style={{ maxWidth:'1280px', margin:'0 auto', padding:'32px 24px 80px' }}>
        <div style={{ display:'flex', gap:'8px', flexWrap:'wrap', marginBottom:'32px' }}>
          {[{id:'all',name:'All Stations'},...stations].map(s=>(
            <button key={s.id} onClick={()=>setStation(s.id)} style={{ padding:'6px 14px', borderRadius:'999px', fontSize:'12px', fontWeight:500, cursor:'pointer', background:stationId===s.id?'var(--color-brand)':'var(--color-surface)', color:stationId===s.id?'#fff':'var(--color-text-muted)', border:`1px solid ${stationId===s.id?'var(--color-brand)':'var(--color-border)'}`, transition:'all 0.2s' }}>{s.name}</button>
          ))}
        </div>

        {loading
          ? <p style={{color:'var(--color-text-muted)'}}>Loading audioâ€¦</p>
          : filtered.length===0
            ? <p style={{color:'var(--color-text-muted)',textAlign:'center',padding:'60px 0'}}>No audio content available yet.</p>
            : <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:'16px' }}>
                {filtered.map(item=><AudioCard key={item.id} item={item}/>)}
              </div>
        }
      </div>
    </main>
  )
}
