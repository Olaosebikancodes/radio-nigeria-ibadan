import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import AdminLayout from '../../components/layout/AdminLayout'
import { DAYS, formatTime } from '../../lib/utils'
import toast from 'react-hot-toast'

const inputStyle = { width:'100%', padding:'9px 12px', borderRadius:'8px', fontSize:'13px', background:'var(--color-surface-2)', border:'1px solid var(--color-border)', color:'var(--color-text)', outline:'none', fontFamily:'var(--font-body)' }

const EMPTY = { title:'', host:'', language:'English', station_id:'', days:[], start_time:'06:00', end_time:'07:00' }

export default function AdminProgrammes() {
  const [programmes, setProgrammes] = useState([])
  const [stations, setStations]     = useState([])
  const [loading, setLoading]       = useState(true)
  const [showForm, setShowForm]     = useState(false)
  const [form, setForm]             = useState(EMPTY)
  const [editing, setEditing]       = useState(null)
  const [dayFilter, setDayFilter]   = useState('all')

  const fetchAll = async () => {
    setLoading(true)
    const [{ data:progs }, { data:stats }] = await Promise.all([
      supabase.from('programmes').select('*, stations(id,name,color_hex)').eq('active',true).order('start_time'),
      supabase.from('stations').select('id,name,color_hex').eq('active',true).order('sort_order'),
    ])
    setProgrammes(progs||[]); setStations(stats||[]); setLoading(false)
  }
  useEffect(() => { fetchAll() }, [])

  const toggleDay = (d) => setForm(f => ({ ...f, days: f.days.includes(d) ? f.days.filter(x=>x!==d) : [...f.days, d] }))

  const submit = async () => {
    if (!form.title||!form.station_id||!form.days.length) { toast.error('Title, station, and days required'); return }
    const payload = { ...form }
    const { error } = editing
      ? await supabase.from('programmes').update(payload).eq('id',editing)
      : await supabase.from('programmes').insert(payload)
    if (error) { toast.error(error.message); return }
    toast.success(editing?'Updated':'Programme added')
    setShowForm(false); setForm(EMPTY); setEditing(null); fetchAll()
  }

  const del = async (id, title) => {
    if (!confirm(`Delete "${title}"?`)) return
    await supabase.from('programmes').update({ active:false }).eq('id',id)
    toast.success('Deleted'); fetchAll()
  }

  const startEdit = (p) => {
    setForm({ title:p.title, host:p.host||'', language:p.language||'English', station_id:p.station_id, days:p.days||[], start_time:p.start_time, end_time:p.end_time })
    setEditing(p.id); setShowForm(true)
  }

  const filtered = dayFilter==='all' ? programmes : programmes.filter(p=>p.days?.includes(dayFilter))

  return (
    <AdminLayout>
      <div style={{ padding:'32px' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'28px' }}>
          <h1 style={{ fontFamily:'var(--font-display)', fontSize:'28px', fontWeight:700, color:'var(--color-text)', letterSpacing:'-0.03em' }}>Programme Schedule</h1>
          <button onClick={()=>{ setShowForm(true); setEditing(null); setForm(EMPTY) }} style={{ padding:'10px 20px', borderRadius:'10px', fontSize:'13px', fontWeight:600, cursor:'pointer', background:'var(--color-brand)', color:'#fff', border:'none' }}>+ Add Programme</button>
        </div>

        <div style={{ display:'flex', gap:'6px', flexWrap:'wrap', marginBottom:'20px' }}>
          {['all',...DAYS].map(d=>(
            <button key={d} onClick={()=>setDayFilter(d)} style={{ padding:'6px 14px', borderRadius:'999px', fontSize:'11px', fontWeight:600, cursor:'pointer', textTransform:'capitalize', background:dayFilter===d?'var(--color-brand)':'var(--color-surface)', color:dayFilter===d?'#fff':'var(--color-text-muted)', border:`1px solid ${dayFilter===d?'var(--color-brand)':'var(--color-border)'}`, transition:'all 0.15s' }}>{d==='all'?'All':d.slice(0,3).charAt(0).toUpperCase()+d.slice(1,3)}</button>
          ))}
        </div>

        <div style={{ background:'var(--color-surface)', borderRadius:'16px', border:'1px solid var(--color-border)', overflow:'hidden', marginBottom: showForm?'28px':0 }}>
          {loading ? <p style={{padding:'24px',color:'var(--color-text-muted)'}}>Loadingâ€¦</p>
            : filtered.length===0 ? <p style={{padding:'24px',color:'var(--color-text-muted)',textAlign:'center'}}>No programmes scheduled.</p>
            : filtered.map(p=>(
              <div key={p.id} style={{ display:'grid', gridTemplateColumns:'100px 1fr 120px 100px 120px 80px', gap:'12px', padding:'14px 20px', borderBottom:'1px solid var(--color-border)', alignItems:'center' }}
                onMouseEnter={e=>e.currentTarget.style.background='var(--color-surface-2)'}
                onMouseLeave={e=>e.currentTarget.style.background='transparent'}
              >
                <p style={{ fontSize:'12px', fontWeight:600, color:'var(--color-accent)' }}>{formatTime(p.start_time)}</p>
                <div>
                  <p style={{ fontSize:'13px', fontWeight:500, color:'var(--color-text)' }}>{p.title}</p>
                  {p.host && <p style={{ fontSize:'11px', color:'var(--color-text-dim)' }}>{p.host}</p>}
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
                  <div style={{ width:'6px', height:'6px', borderRadius:'50%', background:p.stations?.color_hex||'#555', flexShrink:0 }} />
                  <p style={{ fontSize:'11px', color:'var(--color-text-muted)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{p.stations?.name||'â€”'}</p>
                </div>
                <p style={{ fontSize:'11px', color:'var(--color-text-dim)' }}>{p.language||'â€”'}</p>
                <div style={{ display:'flex', gap:'3px', flexWrap:'wrap' }}>
                  {p.days?.slice(0,4).map(d=><span key={d} style={{ fontSize:'9px', fontWeight:700, padding:'2px 5px', borderRadius:'4px', background:'var(--color-surface-2)', color:'var(--color-text-dim)', textTransform:'uppercase' }}>{d.slice(0,2)}</span>)}
                  {p.days?.length>4 && <span style={{ fontSize:'9px', color:'var(--color-text-dim)' }}>+{p.days.length-4}</span>}
                </div>
                <div style={{ display:'flex', gap:'8px' }}>
                  <button onClick={()=>startEdit(p)} style={{ fontSize:'11px', fontWeight:600, color:'var(--color-accent)', background:'none', border:'none', cursor:'pointer' }}>Edit</button>
                  <button onClick={()=>del(p.id,p.title)} style={{ fontSize:'11px', fontWeight:600, color:'var(--color-live)', background:'none', border:'none', cursor:'pointer' }}>Del</button>
                </div>
              </div>
            ))
          }
        </div>

        {showForm && (
          <div style={{ background:'var(--color-surface)', borderRadius:'16px', border:'1px solid var(--color-border)', padding:'24px' }}>
            <h2 style={{ fontFamily:'var(--font-display)', fontSize:'18px', fontWeight:700, color:'var(--color-text)', marginBottom:'20px' }}>{editing?'Edit':'New'} Programme</h2>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px' }}>
              <div style={{ gridColumn:'span 2' }}>
                <label style={{ fontSize:'12px', fontWeight:600, color:'var(--color-text-muted)', display:'block', marginBottom:'6px' }}>Title *</label>
                <input value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} style={inputStyle} placeholder="e.g. Morning Digest" />
              </div>
              <div>
                <label style={{ fontSize:'12px', fontWeight:600, color:'var(--color-text-muted)', display:'block', marginBottom:'6px' }}>Host</label>
                <input value={form.host} onChange={e=>setForm(f=>({...f,host:e.target.value}))} style={inputStyle} placeholder="Presenter name" />
              </div>
              <div>
                <label style={{ fontSize:'12px', fontWeight:600, color:'var(--color-text-muted)', display:'block', marginBottom:'6px' }}>Station *</label>
                <select value={form.station_id} onChange={e=>setForm(f=>({...f,station_id:e.target.value}))} style={inputStyle}>
                  <option value="">Select station</option>
                  {stations.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize:'12px', fontWeight:600, color:'var(--color-text-muted)', display:'block', marginBottom:'6px' }}>Start Time *</label>
                <input type="time" value={form.start_time} onChange={e=>setForm(f=>({...f,start_time:e.target.value}))} style={inputStyle} />
              </div>
              <div>
                <label style={{ fontSize:'12px', fontWeight:600, color:'var(--color-text-muted)', display:'block', marginBottom:'6px' }}>End Time *</label>
                <input type="time" value={form.end_time} onChange={e=>setForm(f=>({...f,end_time:e.target.value}))} style={inputStyle} />
              </div>
              <div>
                <label style={{ fontSize:'12px', fontWeight:600, color:'var(--color-text-muted)', display:'block', marginBottom:'6px' }}>Language</label>
                <select value={form.language} onChange={e=>setForm(f=>({...f,language:e.target.value}))} style={inputStyle}>
                  {['English','Yoruba','Mixed','Edo','Igala','Urobho'].map(l=><option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div style={{ gridColumn:'span 2' }}>
                <label style={{ fontSize:'12px', fontWeight:600, color:'var(--color-text-muted)', display:'block', marginBottom:'8px' }}>Days *</label>
                <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
                  {DAYS.map(d=>(
                    <button key={d} onClick={()=>toggleDay(d)} type="button" style={{ padding:'6px 14px', borderRadius:'999px', fontSize:'11px', fontWeight:600, cursor:'pointer', textTransform:'capitalize', background:form.days.includes(d)?'var(--color-brand)':'var(--color-surface-2)', color:form.days.includes(d)?'#fff':'var(--color-text-muted)', border:`1px solid ${form.days.includes(d)?'var(--color-brand)':'var(--color-border)'}` }}>{d.slice(0,3).charAt(0).toUpperCase()+d.slice(1,3)}</button>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ display:'flex', gap:'10px', marginTop:'20px' }}>
              <button onClick={submit} style={{ padding:'10px 20px', borderRadius:'8px', fontSize:'13px', fontWeight:600, cursor:'pointer', background:'var(--color-brand)', color:'#fff', border:'none' }}>Save</button>
              <button onClick={()=>{setShowForm(false);setForm(EMPTY);setEditing(null)}} style={{ padding:'10px 20px', borderRadius:'8px', fontSize:'13px', fontWeight:600, cursor:'pointer', background:'var(--color-surface-2)', color:'var(--color-text-muted)', border:'1px solid var(--color-border)' }}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
