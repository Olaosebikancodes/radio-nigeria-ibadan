import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { todayName, formatTime, isOnAir } from '../../lib/utils'
import { LiveBadge } from '../ui/Badge'
import { Skeleton } from '../ui/Skeleton'

export default function TodaysSchedule() {
  const [programmes, setProgrammes] = useState([])
  const [loading, setLoading]       = useState(true)
  const [stationFilter, setStation] = useState('all')
  const [stations, setStations]     = useState([])
  const today = todayName()

  useEffect(() => {
    const load = async () => {
      const [{ data: progs }, { data: stats }] = await Promise.all([
        supabase.from('programmes')
          .select('*, stations(id,name,color_hex)')
          .contains('days', [today])
          .eq('active', true)
          .order('start_time'),
        supabase.from('stations').select('id,name').eq('active',true).order('sort_order'),
      ])
      setProgrammes(progs || [])
      setStations(stats || [])
      setLoading(false)
    }
    load()
  }, [])

  const filtered = stationFilter === 'all' ? programmes : programmes.filter(p => p.stations?.id === stationFilter)

  return (
    <section style={{ maxWidth:'1280px', margin:'0 auto', padding:'80px 24px' }}>
      <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:'32px', flexWrap:'wrap', gap:'16px' }}>
        <div>
          <p style={{ fontSize:'11px', fontWeight:600, color:'var(--color-brand-light)', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'8px' }}>
            {new Date().toLocaleDateString('en-NG', { weekday:'long', day:'numeric', month:'long' })}
          </p>
          <h2 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(28px,4vw,40px)', fontWeight:900, color:'var(--color-text)', letterSpacing:'-0.04em' }}>Today on Air</h2>
        </div>
        <Link to="/programmes" style={{ fontSize:'13px', color:'var(--color-accent)', fontWeight:600 }}>Full schedule →</Link>
      </div>

      {/* Station filter */}
      <div style={{ display:'flex', gap:'8px', flexWrap:'wrap', marginBottom:'24px' }}>
        {[{ id:'all', name:'All Stations' }, ...stations].map(s => (
          <button key={s.id} onClick={() => setStation(s.id)} style={{
            padding:'6px 14px', borderRadius:'999px', fontSize:'12px', fontWeight:500, cursor:'pointer',
            background: stationFilter===s.id ? 'var(--color-brand)' : 'var(--color-surface)',
            color: stationFilter===s.id ? '#fff' : 'var(--color-text-muted)',
            border:`1px solid ${stationFilter===s.id ? 'var(--color-brand)' : 'var(--color-border)'}`,
            transition:'all 0.2s',
          }}>{s.name}</button>
        ))}
      </div>

      {/* List */}
      <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
        {loading
          ? Array(5).fill(0).map((_,i) => <Skeleton key={i} height="64px" radius="10px" />)
          : filtered.length === 0
            ? <p style={{ color:'var(--color-text-muted)', padding:'32px 0', textAlign:'center' }}>No programmes scheduled for today yet.</p>
            : filtered.map(p => {
                const live = isOnAir(p.start_time, p.end_time)
                return (
                  <div key={p.id} style={{
                    display:'flex', alignItems:'center', gap:'16px',
                    padding:'14px 20px', borderRadius:'10px',
                    background: live ? 'rgba(0,92,46,0.1)' : 'var(--color-surface)',
                    border:`1px solid ${live ? 'rgba(0,92,46,0.35)' : 'var(--color-border)'}`,
                    transition:'all 0.2s',
                  }}>
                    {/* Time */}
                    <div style={{ minWidth:'100px' }}>
                      <p style={{ fontSize:'12px', fontWeight:600, color: live ? 'var(--color-accent)' : 'var(--color-text-muted)' }}>
                        {formatTime(p.start_time)} — {formatTime(p.end_time)}
                      </p>
                    </div>

                    {/* Station dot */}
                    {p.stations?.color_hex && (
                      <div style={{ width:'8px', height:'8px', borderRadius:'50%', background:p.stations.color_hex, flexShrink:0 }} />
                    )}

                    {/* Programme info */}
                    <div style={{ flex:1, minWidth:0 }}>
                      <p style={{ fontWeight:600, fontSize:'14px', color:'var(--color-text)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{p.title}</p>
                      <p style={{ fontSize:'12px', color:'var(--color-text-dim)' }}>
                        {p.host && `Hosted by ${p.host} · `}{p.language && p.language}
                      </p>
                    </div>

                    {/* Station name */}
                    <p style={{ fontSize:'11px', color:'var(--color-text-dim)', flexShrink:0 }}>{p.stations?.name}</p>

                    {live && <LiveBadge />}
                  </div>
                )
              })
        }
      </div>
    </section>
  )
}
