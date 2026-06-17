import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { DAYS, formatTime, isOnAir } from '../../lib/utils'
import { LiveBadge } from '../../components/ui/Badge'
import { Skeleton } from '../../components/ui/Skeleton'

export default function Programmes() {
  const [programmes, setProgrammes] = useState([])
  const [stations, setStations]     = useState([])
  const [loading, setLoading]       = useState(true)
  const [day, setDay]               = useState(new Date().toLocaleDateString('en-US',{weekday:'long'}).toLowerCase())
  const [stationId, setStationId]   = useState('all')

  useEffect(() => {
    Promise.all([
      supabase.from('programmes').select('*, stations(id,name,color_hex)').eq('active',true).order('start_time'),
      supabase.from('stations').select('id,name').eq('active',true).order('sort_order'),
    ]).then(([{ data:progs }, { data:stats }]) => {
      setProgrammes(progs || []); setStations(stats || []); setLoading(false)
    })
  }, [])

  const filtered = programmes.filter(p => {
    const dayMatch  = p.days?.includes(day)
    const statMatch = stationId === 'all' || p.stations?.id === stationId
    return dayMatch && statMatch
  })

  return (
    <main style={{ paddingTop:'68px' }}>
      <div style={{ background:`linear-gradient(to bottom, rgba(0,92,46,0.12), transparent)`, borderBottom:'1px solid var(--color-border)', padding:'60px 24px 40px' }}>
        <div style={{ maxWidth:'1280px', margin:'0 auto' }}>
          <p style={{ fontSize:'11px', fontWeight:600, color:'var(--color-brand-light)', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'10px' }}>On Air</p>
          <h1 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(32px,5vw,56px)', fontWeight:900, color:'var(--color-text)', letterSpacing:'-0.04em', marginBottom:'28px' }}>Programme Schedule</h1>

          {/* Day tabs */}
          <div style={{ display:'flex', gap:'6px', flexWrap:'wrap' }}>
            {DAYS.map(d => (
              <button key={d} onClick={() => setDay(d)} style={{
                padding:'8px 18px', borderRadius:'999px', fontSize:'12px', fontWeight:600, cursor:'pointer',
                textTransform:'capitalize', letterSpacing:'0.02em',
                background: day===d ? 'var(--color-brand)' : 'var(--color-surface)',
                color: day===d ? '#fff' : 'var(--color-text-muted)',
                border:`1px solid ${day===d ? 'var(--color-brand)' : 'var(--color-border)'}`,
                transition:'all 0.2s',
              }}>{d.slice(0,3).charAt(0).toUpperCase()+d.slice(1,3)}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth:'1280px', margin:'0 auto', padding:'32px 24px 80px' }}>
        {/* Station filter */}
        <div style={{ display:'flex', gap:'8px', flexWrap:'wrap', marginBottom:'28px' }}>
          {[{ id:'all', name:'All Stations' }, ...stations].map(s => (
            <button key={s.id} onClick={() => setStationId(s.id)} style={{
              padding:'6px 14px', borderRadius:'999px', fontSize:'12px', fontWeight:500, cursor:'pointer',
              background: stationId===s.id ? 'var(--color-brand)' : 'var(--color-surface)',
              color: stationId===s.id ? '#fff' : 'var(--color-text-muted)',
              border:`1px solid ${stationId===s.id ? 'var(--color-brand)' : 'var(--color-border)'}`,
              transition:'all 0.2s',
            }}>{s.name}</button>
          ))}
        </div>

        {/* Table */}
        <div style={{ background:'var(--color-surface)', borderRadius:'16px', border:'1px solid var(--color-border)', overflow:'hidden' }}>
          {/* Desktop header */}
          <div className="prog-header" style={{ display:'grid', gridTemplateColumns:'140px 8px 1fr 140px 120px', gap:'0 16px', padding:'12px 24px', background:'var(--color-surface-2)', borderBottom:'1px solid var(--color-border)' }}>
            {['Time', '', 'Programme', 'Host', 'Station'].map(h => (
              <p key={h} style={{ fontSize:'10px', fontWeight:700, color:'var(--color-text-dim)', textTransform:'uppercase', letterSpacing:'0.08em' }}>{h}</p>
            ))}
          </div>

          {/* Rows */}
          {loading
            ? Array(8).fill(0).map((_,i) => <div key={i} style={{ padding:'14px 24px' }}><Skeleton height="20px" /></div>)
            : filtered.length === 0
              ? <p style={{ padding:'48px 24px', color:'var(--color-text-muted)', textAlign:'center' }}>No programmes scheduled for {day}.</p>
              : filtered.map(p => {
                  const live = isOnAir(p.start_time, p.end_time)
                  const stationColor = p.stations?.color_hex || 'var(--color-text-dim)'
                  return (
                    <div key={p.id} className="prog-row" style={{
                      display:'grid', gridTemplateColumns:'140px 8px 1fr 140px 120px', gap:'0 16px',
                      padding:'14px 24px', alignItems:'center',
                      borderBottom:'1px solid var(--color-border)',
                      background: live ? 'rgba(0,92,46,0.08)' : 'transparent',
                      transition:'background 0.2s',
                    }}
                      onMouseEnter={e=>{ if(!live) e.currentTarget.style.background='var(--color-surface-2)' }}
                      onMouseLeave={e=>{ if(!live) e.currentTarget.style.background=live?'rgba(0,92,46,0.08)':'transparent' }}
                    >
                      <p className="prog-time" style={{ fontSize:'12px', fontWeight:600, color: live ? 'var(--color-accent)' : 'var(--color-text-muted)' }}>
                        {formatTime(p.start_time)} — {formatTime(p.end_time)}
                      </p>
                      <div className="prog-dot" style={{ width:'4px', height:'4px', borderRadius:'50%', background: stationColor, justifySelf:'center' }} />
                      <div className="prog-main">
                        <p style={{ fontWeight:600, fontSize:'14px', color:'var(--color-text)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{p.title}</p>
                        <p className="prog-host-mobile" style={{ display:'none', fontSize:'11px', color:'var(--color-text-muted)', marginTop:'2px' }}>{p.host || p.stations?.name || ''}</p>
                      </div>
                      <p className="prog-host" style={{ fontSize:'12px', color:'var(--color-text-muted)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{p.host || '—'}</p>
                      <div className="prog-station" style={{ display:'flex', alignItems:'center', gap:'6px' }}>
                        {live && <LiveBadge />}
                        <p style={{ fontSize:'11px', color:'var(--color-text-dim)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{p.stations?.name || '—'}</p>
                      </div>
                    </div>
                  )
                })
          }
        </div>
      </div>

      <style>{`
        @media (max-width: 680px) {
          .prog-header { display: none !important; }
          .prog-row {
            grid-template-columns: 90px 1fr !important;
            grid-template-rows: auto !important;
            gap: 0 12px !important;
            padding: 12px 16px !important;
          }
          .prog-dot   { display: none !important; }
          .prog-main  { grid-column: 2 !important; grid-row: 1 !important; }
          .prog-time  { grid-column: 1 !important; grid-row: 1 !important; font-size: 11px !important; }
          .prog-host    { display: none !important; }
          .prog-station { grid-column: 2 !important; grid-row: 2 !important; padding-bottom: 2px; }
          .prog-host-mobile { display: block !important; }
        }
      `}</style>
    </main>
  )
}
