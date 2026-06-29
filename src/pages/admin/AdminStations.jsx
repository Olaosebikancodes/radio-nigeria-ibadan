import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import AdminLayout from '../../components/layout/AdminLayout'
import toast from 'react-hot-toast'

const inputStyle = { width:'100%', padding:'9px 12px', borderRadius:'8px', fontSize:'13px', background:'var(--color-surface-2)', border:'1px solid var(--color-border)', color:'var(--color-text)', outline:'none', fontFamily:'var(--font-body)' }

// Stations page — where station info is managed.
// Key field to keep updated: "Live Stream URL" — this is the direct audio link
// (MP3, AAC, or M3U8) that powers the Listen Live button on the public site.
// If a stream is down or silent, check that URL first.
//
// The "sort_order" column in the database controls the order stations appear on the public site.
export default function AdminStations() {
  const [stations, setStations] = useState([])
  const [editing, setEditing]   = useState(null)
  const [form, setForm]         = useState({})
  const [saving, setSaving]     = useState(false)

  const fetchAll = async () => {
    const { data } = await supabase.from('stations').select('*').order('sort_order')
    setStations(data||[])
  }
  useEffect(() => { fetchAll() }, [])

  const startEdit = (s) => { setEditing(s.id); setForm({ name:s.name, frequency:s.frequency||'', tagline:s.tagline||'', description:s.description||'', location:s.location||'', stream_url:s.stream_url||'', color_hex:s.color_hex||'#005C2E', social_facebook:s.social_facebook||'', social_youtube:s.social_youtube||'' }) }

  const save = async () => {
    setSaving(true)
    const { error } = await supabase.from('stations').update(form).eq('id', editing)
    setSaving(false)
    if (error) { toast.error(error.message); return }
    toast.success('Station updated'); setEditing(null); setForm({}); fetchAll()
  }

  return (
    <AdminLayout>
      <div className="admin-content">
        <style>{`
          .admin-content { padding: 32px; }
          @media(max-width:640px){ .admin-content { padding: 16px; } }
          @media(max-width:640px){ .station-edit-grid { grid-template-columns: 1fr !important; } }
          @media(max-width:640px){ .station-edit-grid > div[style*="span 2"] { grid-column: span 1 !important; } }
          @media(max-width:640px){ .social-grid { grid-template-columns: 1fr !important; } }
          @media(max-width:640px){ .station-header-row { flex-wrap: wrap; gap: 12px; } }
        `}</style>
        <div style={{ marginBottom:'28px' }}>
          <h1 style={{ fontFamily:'var(--font-display)', fontSize:'28px', fontWeight:700, color:'var(--color-text)', letterSpacing:'-0.03em' }}>Stations</h1>
          <p style={{ fontSize:'13px', color:'var(--color-text-muted)', marginTop:'4px' }}>Update station info, stream URLs, and descriptions.</p>
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
          {stations.map(s => (
            <div key={s.id} style={{ background:'var(--color-surface)', borderRadius:'14px', border:`1px solid ${editing===s.id?s.color_hex+'55':'var(--color-border)'}`, overflow:'hidden', transition:'border-color 0.2s' }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'18px 20px', cursor:'pointer' }} onClick={()=>{ editing===s.id?setEditing(null):startEdit(s) }}>
                <div style={{ display:'flex', alignItems:'center', gap:'14px' }}>
                  <div style={{ width:'40px', height:'40px', borderRadius:'10px', background:`${s.color_hex}25`, border:`1px solid ${s.color_hex}40`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <span style={{ fontFamily:'var(--font-display)', fontWeight:900, fontSize:'12px', color:s.color_hex }}>{s.frequency}</span>
                  </div>
                  <div>
                    <p style={{ fontSize:'15px', fontWeight:700, color:'var(--color-text)', fontFamily:'var(--font-display)' }}>{s.name}</p>
                    <p style={{ fontSize:'12px', color:'var(--color-text-muted)' }}>{s.location} · <span style={{ color: s.stream_url ? 'var(--color-success)' : 'var(--color-live)', fontWeight:600 }}>{s.stream_url ? '— Stream set' : '— No stream URL'}</span></p>
                  </div>
                </div>
                <span style={{ fontSize:’12px’, color:’var(--color-accent)’, fontWeight:600 }}>{editing===s.id ? ‘Cancel’ : ‘Edit’}</span>
              </div>

              {editing===s.id && (
                <div style={{ borderTop:'1px solid var(--color-border)', padding:'20px', display:'flex', flexDirection:'column', gap:'14px' }}>
                  <div className="station-edit-grid" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px' }}>
                    <div>
                      <label style={{ fontSize:'12px', fontWeight:600, color:'var(--color-text-muted)', display:'block', marginBottom:'6px' }}>Station Name</label>
                      <input value={form.name||''} onChange={e=>setForm(f=>({...f,name:e.target.value}))} style={inputStyle} />
                    </div>
                    <div>
                      <label style={{ fontSize:'12px', fontWeight:600, color:'var(--color-text-muted)', display:'block', marginBottom:'6px' }}>Frequency (MHz)</label>
                      <input value={form.frequency||''} onChange={e=>setForm(f=>({...f,frequency:e.target.value}))} style={inputStyle} placeholder="e.g. 93.5" />
                    </div>
                    <div>
                      <label style={{ fontSize:'12px', fontWeight:600, color:'var(--color-text-muted)', display:'block', marginBottom:'6px' }}>Tagline / Slogan</label>
                      <input value={form.tagline||''} onChange={e=>setForm(f=>({...f,tagline:e.target.value}))} style={inputStyle} placeholder="Your station's motto" />
                    </div>
                    <div>
                      <label style={{ fontSize:'12px', fontWeight:600, color:'var(--color-text-muted)', display:'block', marginBottom:'6px' }}>Location</label>
                      <input value={form.location||''} onChange={e=>setForm(f=>({...f,location:e.target.value}))} style={inputStyle} placeholder="e.g. Ibadan, Oyo State" />
                    </div>
                    <div style={{ gridColumn:'span 2' }}>
                      <label style={{ fontSize:'12px', fontWeight:600, color:'var(--color-text-muted)', display:'block', marginBottom:'6px' }}>Live Stream URL</label>
                      <input value={form.stream_url||''} onChange={e=>setForm(f=>({...f,stream_url:e.target.value}))} style={inputStyle} placeholder="https://stream.example.com/station.mp3" />
                      <p style={{ fontSize:'11px', color:'var(--color-text-dim)', marginTop:'4px' }}>Must be a direct audio stream URL (MP3, AAC, or M3U8)</p>
                    </div>
                    <div style={{ gridColumn:'span 2' }}>
                      <label style={{ fontSize:'12px', fontWeight:600, color:'var(--color-text-muted)', display:'block', marginBottom:'6px' }}>Description</label>
                      <textarea value={form.description||''} onChange={e=>setForm(f=>({...f,description:e.target.value}))} rows={3} style={{ ...inputStyle, resize:'vertical' }} placeholder="About this station…" />
                    </div>
                    <div>
                      <label style={{ fontSize:'12px', fontWeight:600, color:'var(--color-text-muted)', display:'block', marginBottom:'6px' }}>Brand Color</label>
                      <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                        <input type="color" value={form.color_hex||'#005C2E'} onChange={e=>setForm(f=>({...f,color_hex:e.target.value}))} style={{ width:'40px', height:'36px', borderRadius:'6px', border:'1px solid var(--color-border)', cursor:'pointer', background:'none', padding:'2px' }} />
                        <input value={form.color_hex||''} onChange={e=>setForm(f=>({...f,color_hex:e.target.value}))} style={{ ...inputStyle, flex:1 }} placeholder="#005C2E" />
                      </div>
                    </div>
                  </div>

                  <div style={{ borderTop:'1px solid var(--color-border)', paddingTop:'14px' }}>
                    <p style={{ fontSize:'12px', fontWeight:700, color:'var(--color-text-dim)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'12px' }}>Social Media Handles</p>
                    <div className="social-grid" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px' }}>
                      <div>
                        <label style={{ fontSize:'12px', fontWeight:600, color:'var(--color-text-muted)', display:'block', marginBottom:'6px' }}>Facebook</label>
                        <input value={form.social_facebook||''} onChange={e=>setForm(f=>({...f,social_facebook:e.target.value}))} style={inputStyle} placeholder="https://facebook.com/stationname" />
                      </div>
                      <div>
                        <label style={{ fontSize:'12px', fontWeight:600, color:'var(--color-text-muted)', display:'block', marginBottom:'6px' }}>YouTube</label>
                        <input value={form.social_youtube||''} onChange={e=>setForm(f=>({...f,social_youtube:e.target.value}))} style={inputStyle} placeholder="https://youtube.com/@stationname" />
                      </div>
                    </div>
                  </div>
                  <div style={{ display:'flex', gap:'10px', paddingTop:'4px' }}>
                    <button onClick={save} disabled={saving} style={{ padding:'10px 20px', borderRadius:'8px', fontSize:'13px', fontWeight:600, cursor:'pointer', background:'var(--color-brand)', color:'#fff', border:'none', opacity:saving?0.6:1 }}>{saving?'Saving…':'Save Changes'}</button>
                    <button onClick={()=>{setEditing(null);setForm({})}} style={{ padding:'10px 20px', borderRadius:'8px', fontSize:'13px', fontWeight:600, cursor:'pointer', background:'var(--color-surface-2)', color:'var(--color-text-muted)', border:'1px solid var(--color-border)' }}>Cancel</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
}
