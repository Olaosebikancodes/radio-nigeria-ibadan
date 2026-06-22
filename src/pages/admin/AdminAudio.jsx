import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import AdminLayout from '../../components/layout/AdminLayout'
import { formatDuration, formatDate } from '../../lib/utils'
import toast from 'react-hot-toast'

const inputStyle = { width:'100%', padding:'9px 12px', borderRadius:'8px', fontSize:'13px', background:'var(--color-surface-2)', border:'1px solid var(--color-border)', color:'var(--color-text)', outline:'none', fontFamily:'var(--font-body)' }
const EMPTY = { title:'', description:'', station_id:'', programme_id:'', published:false }

export default function AdminAudio() {
  const [items, setItems]         = useState([])
  const [stations, setStations]   = useState([])
  const [programmes, setProgrammes] = useState([])
  const [loading, setLoading]     = useState(true)
  const [showForm, setShowForm]   = useState(false)
  const [form, setForm]           = useState(EMPTY)
  const [audioFile, setAudioFile] = useState(null)
  const [coverFile, setCoverFile] = useState(null)
  const [uploading, setUploading] = useState(false)

  const fetchAll = async () => {
    setLoading(true)
    const [{ data:audio }, { data:stats }, { data:progs }] = await Promise.all([
      supabase.from('audio_content').select('*, stations(name)').order('created_at',{ascending:false}).limit(30),
      supabase.from('stations').select('id,name').eq('active',true).order('sort_order'),
      supabase.from('programmes').select('id,title,station_id').eq('active',true).order('title'),
    ])
    setItems(audio||[]); setStations(stats||[]); setProgrammes(progs||[]); setLoading(false)
  }
  useEffect(() => { fetchAll() }, [])

  const filteredProgs = form.station_id ? programmes.filter(p=>p.station_id===form.station_id) : programmes

  const submit = async () => {
    if (!form.title.trim()) { toast.error('Title required'); return }
    if (!audioFile && !form.audio_url) { toast.error('Audio file required'); return }
    setUploading(true)
    let audio_url = form.audio_url || ''
    let cover_image = form.cover_image || ''
    let duration_sec = null

    if (audioFile) {
      const path = `audio/${Date.now()}_${audioFile.name.replace(/\s/g,'_')}`
      const { error } = await supabase.storage.from('audio').upload(path, audioFile, { upsert:true })
      if (error) { toast.error('Audio upload failed: ' + error.message); setUploading(false); return }
      const { data: { publicUrl } } = supabase.storage.from('audio').getPublicUrl(path)
      audio_url = publicUrl
      const a = document.createElement('audio')
      a.src = URL.createObjectURL(audioFile)
      await new Promise(r => { a.onloadedmetadata = () => { duration_sec = Math.round(a.duration); r() }; setTimeout(r, 3000) })
    }

    if (coverFile) {
      const path = `covers/audio_${Date.now()}.${coverFile.name.split('.').pop()}`
      const { error } = await supabase.storage.from('images').upload(path, coverFile, { upsert:true })
      if (!error) {
        const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(path)
        cover_image = publicUrl
      }
    }

    const payload = { ...form, audio_url, cover_image, duration_sec, station_id:form.station_id||null, programme_id:form.programme_id||null, published_at: form.published ? new Date().toISOString() : null }
    const { error } = await supabase.from('audio_content').insert(payload)
    setUploading(false)
    if (error) { toast.error(error.message); return }
    toast.success('Audio uploaded'); setShowForm(false); setForm(EMPTY); setAudioFile(null); setCoverFile(null); fetchAll()
  }

  const togglePublish = async (id, current) => {
    await supabase.from('audio_content').update({ published:!current, published_at:!current?new Date().toISOString():null }).eq('id',id)
    toast.success(!current?'Published':'Unpublished'); fetchAll()
  }

  const del = async (id) => {
    if (!confirm('Delete this audio item?')) return
    await supabase.from('audio_content').delete().eq('id',id)
    toast.success('Deleted'); fetchAll()
  }

  return (
    <AdminLayout>
      <div style={{ padding:'32px' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'28px' }}>
          <div>
            <h1 style={{ fontFamily:'var(--font-display)', fontSize:'28px', fontWeight:700, color:'var(--color-text)', letterSpacing:'-0.03em' }}>Audio Archive</h1>
            <p style={{ fontSize:'13px', color:'var(--color-text-muted)', marginTop:'4px' }}>{items.length} item{items.length!==1?'s':''}</p>
          </div>
          <button onClick={()=>setShowForm(s=>!s)} style={{ padding:'10px 20px', borderRadius:'10px', fontSize:'13px', fontWeight:600, cursor:'pointer', background:'var(--color-brand)', color:'#fff', border:'none' }}>
            {showForm ? 'Cancel' : '+ Upload Audio'}
          </button>
        </div>

        {showForm && (
          <div style={{ background:'var(--color-surface)', borderRadius:'16px', border:'1px solid var(--color-border)', padding:'24px', marginBottom:'28px' }}>
            <h2 style={{ fontFamily:'var(--font-display)', fontSize:'18px', fontWeight:700, color:'var(--color-text)', marginBottom:'20px' }}>Upload New Audio</h2>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px' }}>
              <div style={{ gridColumn:'span 2' }}>
                <label style={{ fontSize:'12px', fontWeight:600, color:'var(--color-text-muted)', display:'block', marginBottom:'6px' }}>Title *</label>
                <input value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} style={inputStyle} placeholder="Episode or segment title" />
              </div>
              <div style={{ gridColumn:'span 2' }}>
                <label style={{ fontSize:'12px', fontWeight:600, color:'var(--color-text-muted)', display:'block', marginBottom:'6px' }}>Description</label>
                <textarea value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} rows={2} style={{ ...inputStyle, resize:'vertical' }} placeholder="Brief description…" />
              </div>
              <div>
                <label style={{ fontSize:'12px', fontWeight:600, color:'var(--color-text-muted)', display:'block', marginBottom:'6px' }}>Station</label>
                <select value={form.station_id} onChange={e=>setForm(f=>({...f,station_id:e.target.value,programme_id:''}))} style={inputStyle}>
                  <option value="">No station</option>
                  {stations.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize:'12px', fontWeight:600, color:'var(--color-text-muted)', display:'block', marginBottom:'6px' }}>Programme</label>
                <select value={form.programme_id} onChange={e=>setForm(f=>({...f,programme_id:e.target.value}))} style={inputStyle}>
                  <option value="">No programme</option>
                  {filteredProgs.map(p=><option key={p.id} value={p.id}>{p.title}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize:'12px', fontWeight:600, color:'var(--color-text-muted)', display:'block', marginBottom:'6px' }}>Audio File * (MP3/WAV)</label>
                <input type="file" accept="audio/*" onChange={e=>setAudioFile(e.target.files[0])} style={{ fontSize:'12px', color:'var(--color-text-muted)' }} />
                {audioFile && <p style={{ fontSize:'11px', color:'var(--color-text-dim)', marginTop:'4px' }}>Selected: {audioFile.name}</p>}
              </div>
              <div>
                <label style={{ fontSize:'12px', fontWeight:600, color:'var(--color-text-muted)', display:'block', marginBottom:'6px' }}>Cover Image (optional)</label>
                <input type="file" accept="image/*" onChange={e=>setCoverFile(e.target.files[0])} style={{ fontSize:'12px', color:'var(--color-text-muted)' }} />
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                <input type="checkbox" id="publish" checked={form.published} onChange={e=>setForm(f=>({...f,published:e.target.checked}))} style={{ accentColor:'var(--color-brand)', width:'16px', height:'16px' }} />
                <label htmlFor="publish" style={{ fontSize:'13px', color:'var(--color-text-muted)', cursor:'pointer' }}>Publish immediately</label>
              </div>
            </div>
            <div style={{ display:'flex', gap:'10px', marginTop:'20px' }}>
              <button onClick={submit} disabled={uploading} style={{ padding:'10px 20px', borderRadius:'8px', fontSize:'13px', fontWeight:600, cursor:uploading?'wait':'pointer', background:'var(--color-brand)', color:'#fff', border:'none', opacity:uploading?0.6:1 }}>
                {uploading ? 'Uploading…' : 'Upload & Save'}
              </button>
              <button onClick={()=>{setShowForm(false);setForm(EMPTY);setAudioFile(null);setCoverFile(null)}} style={{ padding:'10px 20px', borderRadius:'8px', fontSize:'13px', fontWeight:600, cursor:'pointer', background:'var(--color-surface-2)', color:'var(--color-text-muted)', border:'1px solid var(--color-border)' }}>Cancel</button>
            </div>
          </div>
        )}

        <div style={{ background:'var(--color-surface)', borderRadius:'16px', border:'1px solid var(--color-border)', overflow:'hidden' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 130px 90px 90px 100px', gap:'14px', padding:'12px 20px', background:'var(--color-surface-2)', borderBottom:'1px solid var(--color-border)' }}>
            {['Title','Station','Duration','Date','Actions'].map(h=><p key={h} style={{ fontSize:'10px', fontWeight:700, color:'var(--color-text-dim)', textTransform:'uppercase', letterSpacing:'0.08em' }}>{h}</p>)}
          </div>
          {loading ? <p style={{padding:'24px',color:'var(--color-text-muted)'}}>Loading…</p>
            : items.length===0 ? <p style={{padding:'24px',color:'var(--color-text-muted)',textAlign:'center'}}>No audio uploaded yet.</p>
            : items.map(item=>(
              <div key={item.id} style={{ display:'grid', gridTemplateColumns:'1fr 130px 90px 90px 100px', gap:'14px', padding:'14px 20px', borderBottom:'1px solid var(--color-border)', alignItems:'center' }}
                onMouseEnter={e=>e.currentTarget.style.background='var(--color-surface-2)'}
                onMouseLeave={e=>e.currentTarget.style.background='transparent'}
              >
                <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                  <div style={{ width:'36px', height:'36px', borderRadius:'8px', background:'var(--color-surface-2)', flexShrink:0, overflow:'hidden' }}>
                    {item.cover_image ? <img src={item.cover_image} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/> : <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100%',fontSize:'16px'}}>ðŸŽ™ï¸</div>}
                  </div>
                  <div>
                    <p style={{ fontSize:'13px', fontWeight:500, color:'var(--color-text)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:'200px' }}>{item.title}</p>
                    <span style={{ fontSize:'11px', fontWeight:600, padding:'2px 8px', borderRadius:'999px', background:item.published?'rgba(52,199,89,0.12)':'rgba(255,165,0,0.12)', color:item.published?'var(--color-success)':'var(--color-warning)' }}>{item.published?'Published':'Draft'}</span>
                  </div>
                </div>
                <p style={{ fontSize:'12px', color:'var(--color-text-muted)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{item.stations?.name||'"”'}</p>
                <p style={{ fontSize:'12px', color:'var(--color-text-dim)' }}>{formatDuration(item.duration_sec)}</p>
                <p style={{ fontSize:'12px', color:'var(--color-text-dim)' }}>{formatDate(item.created_at)}</p>
                <div style={{ display:'flex', gap:'8px' }}>
                  <button onClick={()=>togglePublish(item.id,item.published)} style={{ fontSize:'11px', fontWeight:600, color:item.published?'var(--color-text-dim)':'var(--color-success)', background:'none', border:'none', cursor:'pointer' }}>{item.published?'Unpublish':'Publish'}</button>
                  <button onClick={()=>del(item.id)} style={{ fontSize:'11px', fontWeight:600, color:'var(--color-live)', background:'none', border:'none', cursor:'pointer' }}>Del</button>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </AdminLayout>
  )
}
