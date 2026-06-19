import { useEffect, useRef, useState } from 'react'
import { supabase } from '../../lib/supabase'
import AdminLayout from '../../components/layout/AdminLayout'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

const inputStyle = { width:'100%', padding:'9px 12px', borderRadius:'8px', fontSize:'13px', background:'var(--color-surface-2)', border:'1px solid var(--color-border)', color:'var(--color-text)', outline:'none', fontFamily:'var(--font-body)' }

const EMPTY = { title:'', image_url:'', link_url:'', station_id:'', active:true, sort_order:0 }

export default function AdminAdverts() {
  const { staff } = useAuth()
  const isAdmin   = staff?.role === 'admin'

  const [adverts, setAdverts]     = useState([])
  const [stations, setStations]   = useState([])
  const [form, setForm]           = useState(EMPTY)
  const [editing, setEditing]     = useState(null)
  const [saving, setSaving]       = useState(false)
  const [uploading, setUploading] = useState(false)
  const [showForm, setShowForm]   = useState(false)
  const fileInputRef = useRef(null)

  const fetchAll = async () => {
    let adsQuery = supabase.from('adverts').select('*, stations(name)').order('sort_order')
    if (!isAdmin && staff?.station_id) adsQuery = adsQuery.eq('station_id', staff.station_id)

    const [{ data: ads }, { data: stas }] = await Promise.all([
      adsQuery,
      supabase.from('stations').select('id,name').order('sort_order'),
    ])
    setAdverts(ads || [])
    setStations(stas || [])
  }

  useEffect(() => { if (staff) fetchAll() }, [staff])

  const openNew = () => {
    setEditing(null)
    setForm({ ...EMPTY, station_id: isAdmin ? '' : (staff?.station_id || '') })
    setShowForm(true)
  }
  const openEdit = (a) => {
    setEditing(a.id)
    setForm({ title:a.title, image_url:a.image_url||'', link_url:a.link_url||'', station_id:a.station_id||'', active:a.active, sort_order:a.sort_order||0 })
    setShowForm(true)
  }
  const cancel = () => { setShowForm(false); setEditing(null); setForm(EMPTY) }

  const uploadImage = async (file) => {
    if (!file) return
    const ext  = file.name.split('.').pop()
    const path = `adverts/${Date.now()}.${ext}`
    setUploading(true)
    const { error } = await supabase.storage.from('images').upload(path, file, { upsert: true })
    setUploading(false)
    if (error) { toast.error('Upload failed: ' + error.message); return }
    const { data } = supabase.storage.from('images').getPublicUrl(path)
    setForm(f => ({ ...f, image_url: data.publicUrl }))
    toast.success('Image uploaded')
  }

  const normalizeUrl = (url) => {
    if (!url) return ''
    url = url.trim()
    if (url && !/^https?:\/\//i.test(url)) return `https://${url}`
    return url
  }

  const save = async () => {
    if (!form.title.trim()) { toast.error('Title is required'); return }
    setSaving(true)
    const payload = { ...form, station_id: form.station_id || null, link_url: normalizeUrl(form.link_url) }
    const { error } = editing
      ? await supabase.from('adverts').update(payload).eq('id', editing)
      : await supabase.from('adverts').insert(payload)
    setSaving(false)
    if (error) { toast.error(error.message); return }
    toast.success(editing ? 'Advert updated' : 'Advert created')
    cancel(); fetchAll()
  }

  const toggleActive = async (a) => {
    await supabase.from('adverts').update({ active: !a.active }).eq('id', a.id)
    fetchAll()
  }

  const remove = async (id) => {
    if (!confirm('Delete this advert?')) return
    await supabase.from('adverts').delete().eq('id', id)
    toast.success('Deleted'); fetchAll()
  }

  return (
    <AdminLayout>
      <div style={{ padding:'32px' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'28px', flexWrap:'wrap', gap:'12px' }} className="admin-page-header">
          <div>
            <h1 style={{ fontFamily:'var(--font-display)', fontSize:'28px', fontWeight:700, color:'var(--color-text)', letterSpacing:'-0.03em' }}>Adverts</h1>
            <p style={{ fontSize:'13px', color:'var(--color-text-muted)', marginTop:'4px' }}>Manage advertisement slots shown on station pages.</p>
          </div>
          <button onClick={openNew} style={{ padding:'10px 20px', borderRadius:'10px', fontSize:'13px', fontWeight:600, cursor:'pointer', background:'var(--color-brand)', color:'#fff', border:'none' }}>+ New Advert</button>
        </div>

        {showForm && (
          <div style={{ background:'var(--color-surface)', borderRadius:'14px', border:'1px solid var(--color-border-light)', padding:'24px', marginBottom:'28px' }}>
            <h2 style={{ fontFamily:'var(--font-display)', fontSize:'17px', fontWeight:700, color:'var(--color-text)', marginBottom:'20px' }}>{editing ? 'Edit Advert' : 'New Advert'}</h2>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px' }}>
              <div style={{ gridColumn:'span 2' }}>
                <label style={{ fontSize:'12px', fontWeight:600, color:'var(--color-text-muted)', display:'block', marginBottom:'6px' }}>Title <span style={{ color:'var(--color-live)' }}>*</span></label>
                <input value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} style={inputStyle} placeholder="e.g. Zenith Bank — Brand Awareness" />
              </div>
              <div style={{ gridColumn:'span 2' }}>
                <label style={{ fontSize:'12px', fontWeight:600, color:'var(--color-text-muted)', display:'block', marginBottom:'8px' }}>Advert Image</label>
                <input ref={fileInputRef} type="file" accept="image/*" style={{ display:'none' }} onChange={e => uploadImage(e.target.files[0])} />
                {form.image_url
                  ? <div style={{ position:'relative', display:'inline-block' }}>
                      <img src={form.image_url} alt="preview" style={{ height:'140px', maxWidth:'100%', borderRadius:'10px', objectFit:'cover', border:'1px solid var(--color-border)', display:'block' }} />
                      <button type="button" onClick={() => { setForm(f=>({...f,image_url:''})); fileInputRef.current.value='' }}
                        style={{ position:'absolute', top:'6px', right:'6px', width:'24px', height:'24px', borderRadius:'50%', background:'rgba(0,0,0,0.7)', border:'none', color:'#fff', fontSize:'14px', cursor:'pointer', lineHeight:1, display:'flex', alignItems:'center', justifyContent:'center' }}>✕</button>
                      <button type="button" onClick={() => fileInputRef.current.click()}
                        style={{ marginTop:'8px', padding:'6px 14px', borderRadius:'7px', fontSize:'12px', fontWeight:500, cursor:'pointer', background:'var(--color-surface-2)', color:'var(--color-text-muted)', border:'1px solid var(--color-border)', display:'block' }}>
                        Replace Image
                      </button>
                    </div>
                  : <button type="button" onClick={() => fileInputRef.current.click()} disabled={uploading}
                      style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'10px', width:'100%', height:'120px', borderRadius:'10px', border:'2px dashed var(--color-border)', background:'var(--color-surface-2)', color:'var(--color-text-muted)', cursor:'pointer', fontSize:'13px', transition:'all 0.2s' }}
                      onMouseEnter={e=>{ e.currentTarget.style.borderColor='var(--color-brand)'; e.currentTarget.style.color='var(--color-brand-light)' }}
                      onMouseLeave={e=>{ e.currentTarget.style.borderColor='var(--color-border)'; e.currentTarget.style.color='var(--color-text-muted)' }}>
                      <span style={{ fontSize:'28px', opacity:0.5 }}>🖼️</span>
                      <span style={{ fontWeight:500 }}>{uploading ? 'Uploading…' : 'Click to upload image'}</span>
                      <span style={{ fontSize:'11px', opacity:0.6 }}>JPG, PNG, WebP — recommended 1200×400px</span>
                    </button>
                }
              </div>
              <div style={{ gridColumn:'span 2' }}>
                <label style={{ fontSize:'12px', fontWeight:600, color:'var(--color-text-muted)', display:'block', marginBottom:'6px' }}>Click-through URL</label>
                <input value={form.link_url} onChange={e=>setForm(f=>({...f,link_url:e.target.value}))} style={inputStyle} placeholder="https://advertiser-website.com" />
              </div>
              <div>
                <label style={{ fontSize:'12px', fontWeight:600, color:'var(--color-text-muted)', display:'block', marginBottom:'6px' }}>Show on Station</label>
                {isAdmin
                  ? <select value={form.station_id} onChange={e=>setForm(f=>({...f,station_id:e.target.value}))} style={inputStyle}>
                      <option value="">All Stations</option>
                      {stations.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  : <input value={stations.find(s=>s.id===form.station_id)?.name || 'Your Station'} readOnly style={{ ...inputStyle, opacity:0.6, cursor:'not-allowed' }} />
                }
              </div>
              <div>
                <label style={{ fontSize:'12px', fontWeight:600, color:'var(--color-text-muted)', display:'block', marginBottom:'6px' }}>Sort Order</label>
                <input type="number" value={form.sort_order} onChange={e=>setForm(f=>({...f,sort_order:+e.target.value}))} style={inputStyle} min={0} />
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                <input type="checkbox" id="active-chk" checked={form.active} onChange={e=>setForm(f=>({...f,active:e.target.checked}))} style={{ width:'16px', height:'16px', cursor:'pointer' }} />
                <label htmlFor="active-chk" style={{ fontSize:'13px', color:'var(--color-text-muted)', cursor:'pointer' }}>Active (visible on site)</label>
              </div>
            </div>
            <div style={{ display:'flex', gap:'10px', marginTop:'20px' }}>
              <button onClick={save} disabled={saving} style={{ padding:'10px 22px', borderRadius:'8px', fontSize:'13px', fontWeight:600, cursor:'pointer', background:'var(--color-brand)', color:'#fff', border:'none', opacity:saving?0.6:1 }}>{saving ? 'Saving…' : editing ? 'Save Changes' : 'Create Advert'}</button>
              <button onClick={cancel} style={{ padding:'10px 20px', borderRadius:'8px', fontSize:'13px', fontWeight:600, cursor:'pointer', background:'var(--color-surface-2)', color:'var(--color-text-muted)', border:'1px solid var(--color-border)' }}>Cancel</button>
            </div>
          </div>
        )}

        {adverts.length === 0 && !showForm
          ? <div style={{ padding:'48px', textAlign:'center', background:'var(--color-surface)', borderRadius:'14px', border:'1px solid var(--color-border)' }}>
              <p style={{ fontSize:'32px', marginBottom:'10px', opacity:0.3 }}>📢</p>
              <p style={{ fontSize:'14px', color:'var(--color-text-muted)' }}>No adverts yet. Click <strong>+ New Advert</strong> to create one.</p>
            </div>
          : <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
              {adverts.map(a => (
                <div key={a.id} style={{ display:'flex', alignItems:'center', gap:'16px', background:'var(--color-surface)', borderRadius:'12px', border:`1px solid ${a.active?'var(--color-border)':'var(--color-border)'}`, padding:'16px 20px', opacity:a.active?1:0.5, flexWrap:'wrap' }}>
                  {a.image_url && (
                    <img src={a.image_url} alt={a.title} style={{ width:'80px', height:'48px', objectFit:'cover', borderRadius:'6px', flexShrink:0, border:'1px solid var(--color-border)' }} onError={e=>e.target.style.display='none'} />
                  )}
                  {!a.image_url && (
                    <div style={{ width:'80px', height:'48px', borderRadius:'6px', background:'var(--color-surface-2)', border:'1px solid var(--color-border)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'20px', flexShrink:0 }}>📢</div>
                  )}
                  <div style={{ flex:1, minWidth:0 }}>
                    <p style={{ fontSize:'14px', fontWeight:600, color:'var(--color-text)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{a.title}</p>
                    <p style={{ fontSize:'11px', color:'var(--color-text-dim)', marginTop:'2px' }}>
                      {a.stations ? a.stations.name : 'All Stations'}
                      {a.link_url && <span> · <a href={a.link_url} target="_blank" rel="noopener noreferrer" style={{ color:'var(--color-accent)' }}>Link ↗</a></span>}
                    </p>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:'8px', flexShrink:0 }}>
                    <span style={{ fontSize:'11px', fontWeight:600, padding:'3px 10px', borderRadius:'999px', background: a.active?'rgba(52,199,89,0.12)':'rgba(255,59,48,0.1)', color: a.active?'var(--color-success)':'var(--color-live)' }}>{a.active ? 'Active' : 'Inactive'}</span>
                    <button onClick={() => toggleActive(a)} style={{ padding:'5px 12px', borderRadius:'7px', fontSize:'12px', fontWeight:500, cursor:'pointer', background:'var(--color-surface-2)', color:'var(--color-text-muted)', border:'1px solid var(--color-border)' }}>{a.active ? 'Pause' : 'Activate'}</button>
                    <button onClick={() => openEdit(a)} style={{ padding:'5px 12px', borderRadius:'7px', fontSize:'12px', fontWeight:500, cursor:'pointer', background:'var(--color-surface-2)', color:'var(--color-accent)', border:'1px solid var(--color-border)' }}>Edit</button>
                    <button onClick={() => remove(a.id)} style={{ padding:'5px 12px', borderRadius:'7px', fontSize:'12px', fontWeight:500, cursor:'pointer', background:'rgba(255,59,48,0.08)', color:'var(--color-live)', border:'1px solid rgba(255,59,48,0.2)' }}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
        }
      </div>
    </AdminLayout>
  )
}
