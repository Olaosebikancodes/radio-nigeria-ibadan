import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import AdminLayout from '../../components/layout/AdminLayout'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

const inputStyle = { width:'100%', padding:'9px 12px', borderRadius:'8px', fontSize:'13px', background:'var(--color-surface-2)', border:'1px solid var(--color-border)', color:'var(--color-text)', outline:'none', fontFamily:'var(--font-body)' }
const EMPTY = { name:'', role:'editor', station_id:'', email:'', password:'' }

export default function AdminUsers() {
  const [staff, setStaff]       = useState([])
  const [stations, setStations] = useState([])
  const [loading, setLoading]   = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm]         = useState(EMPTY)
  const [saving, setSaving]     = useState(false)
  const { staff: me } = useAuth()

  const fetchAll = async () => {
    setLoading(true)
    const [{ data:s }, { data:stats }] = await Promise.all([
      supabase.from('staff').select('*, stations(name)').order('created_at'),
      supabase.from('stations').select('id,name').eq('active',true).order('sort_order'),
    ])
    setStaff(s||[]); setStations(stats||[]); setLoading(false)
  }
  useEffect(() => { fetchAll() }, [])

  const createUser = async () => {
    if (!form.name||!form.email||!form.password) { toast.error('Name, email, and password required'); return }
    setSaving(true)
    const { data, error } = await supabase.auth.admin.createUser({ email:form.email, password:form.password, email_confirm:true })
    if (error) { toast.error(error.message); setSaving(false); return }
    const { error: staffErr } = await supabase.from('staff').insert({ user_id:data.user.id, name:form.name, role:form.role, station_id:form.station_id||null })
    setSaving(false)
    if (staffErr) { toast.error(staffErr.message); return }
    toast.success('Staff account created'); setShowForm(false); setForm(EMPTY); fetchAll()
  }

  const removeStaff = async (id, name) => {
    if (!confirm(`Remove ${name} from staff?`)) return
    await supabase.from('staff').delete().eq('id',id)
    toast.success('Staff removed'); fetchAll()
  }

  const ROLE_COLORS = { admin:'rgba(240,165,0,0.15)', editor:'rgba(52,199,89,0.1)', station_manager:'rgba(26,107,154,0.12)' }
  const ROLE_TEXT   = { admin:'var(--color-accent)', editor:'var(--color-success)', station_manager:'#5BA8D4' }

  return (
    <AdminLayout>
      <div style={{ padding:'32px' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'28px' }}>
          <div>
            <h1 style={{ fontFamily:'var(--font-display)', fontSize:'28px', fontWeight:700, color:'var(--color-text)', letterSpacing:'-0.03em' }}>Staff Accounts</h1>
            <p style={{ fontSize:'13px', color:'var(--color-text-muted)', marginTop:'4px' }}>{staff.length} staff member{staff.length!==1?'s':''}</p>
          </div>
          {me?.role==='admin' && <button onClick={()=>setShowForm(s=>!s)} style={{ padding:'10px 20px', borderRadius:'10px', fontSize:'13px', fontWeight:600, cursor:'pointer', background:'var(--color-brand)', color:'#fff', border:'none' }}>{showForm?'Cancel':'+ Add Staff'}</button>}
        </div>

        {/* Role legend */}
        <div style={{ display:'flex', gap:'12px', marginBottom:'20px', flexWrap:'wrap' }}>
          {Object.entries(ROLE_COLORS).map(([role,bg])=>(
            <div key={role} style={{ display:'flex', alignItems:'center', gap:'6px', padding:'4px 12px', borderRadius:'999px', background:bg, border:`1px solid ${ROLE_TEXT[role]}33` }}>
              <span style={{ width:'6px', height:'6px', borderRadius:'50%', background:ROLE_TEXT[role] }} />
              <span style={{ fontSize:'11px', fontWeight:600, color:ROLE_TEXT[role], textTransform:'capitalize' }}>{role.replace('_',' ')}</span>
            </div>
          ))}
        </div>

        {/* Create form */}
        {showForm && (
          <div style={{ background:'var(--color-surface)', borderRadius:'16px', border:'1px solid var(--color-border)', padding:'24px', marginBottom:'24px' }}>
            <h2 style={{ fontFamily:'var(--font-display)', fontSize:'18px', fontWeight:700, color:'var(--color-text)', marginBottom:'20px' }}>New Staff Account</h2>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px' }}>
              <div>
                <label style={{ fontSize:'12px', fontWeight:600, color:'var(--color-text-muted)', display:'block', marginBottom:'6px' }}>Full Name *</label>
                <input value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} style={inputStyle} placeholder="John Adebayo" />
              </div>
              <div>
                <label style={{ fontSize:'12px', fontWeight:600, color:'var(--color-text-muted)', display:'block', marginBottom:'6px' }}>Email Address *</label>
                <input type="email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} style={inputStyle} placeholder="staff@radionigeriaibadan.gov.ng" />
              </div>
              <div>
                <label style={{ fontSize:'12px', fontWeight:600, color:'var(--color-text-muted)', display:'block', marginBottom:'6px' }}>Temporary Password *</label>
                <input type="password" value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))} style={inputStyle} placeholder="Min. 8 characters" />
              </div>
              <div>
                <label style={{ fontSize:'12px', fontWeight:600, color:'var(--color-text-muted)', display:'block', marginBottom:'6px' }}>Role</label>
                <select value={form.role} onChange={e=>setForm(f=>({...f,role:e.target.value}))} style={inputStyle}>
                  <option value="editor">Editor — news &amp; audio only</option>
                  <option value="station_manager">Station Manager — own station</option>
                  <option value="admin">Admin — full access</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize:'12px', fontWeight:600, color:'var(--color-text-muted)', display:'block', marginBottom:'6px' }}>Assigned Station</label>
                <select value={form.station_id} onChange={e=>setForm(f=>({...f,station_id:e.target.value}))} style={inputStyle}>
                  <option value="">Zonal (all stations)</option>
                  {stations.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display:'flex', gap:'10px', marginTop:'20px' }}>
              <button onClick={createUser} disabled={saving} style={{ padding:'10px 20px', borderRadius:'8px', fontSize:'13px', fontWeight:600, cursor:'pointer', background:'var(--color-brand)', color:'#fff', border:'none', opacity:saving?0.6:1 }}>{saving?'Creating…':'Create Account'}</button>
              <button onClick={()=>{setShowForm(false);setForm(EMPTY)}} style={{ padding:'10px 20px', borderRadius:'8px', fontSize:'13px', fontWeight:600, cursor:'pointer', background:'var(--color-surface-2)', color:'var(--color-text-muted)', border:'1px solid var(--color-border)' }}>Cancel</button>
            </div>
          </div>
        )}

        {/* Staff list */}
        <div style={{ background:'var(--color-surface)', borderRadius:'16px', border:'1px solid var(--color-border)', overflow:'hidden' }}>
          {loading ? <p style={{padding:'24px',color:'var(--color-text-muted)'}}>Loading…</p>
            : staff.length===0 ? <p style={{padding:'24px',color:'var(--color-text-muted)',textAlign:'center'}}>No staff accounts yet.</p>
            : staff.map(s=>(
              <div key={s.id} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 20px', borderBottom:'1px solid var(--color-border)' }}
                onMouseEnter={e=>e.currentTarget.style.background='var(--color-surface-2)'}
                onMouseLeave={e=>e.currentTarget.style.background='transparent'}
              >
                <div style={{ display:'flex', alignItems:'center', gap:'14px' }}>
                  <div style={{ width:'40px', height:'40px', borderRadius:'10px', background:`${ROLE_TEXT[s.role] ?? '#555'}20`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'16px', fontWeight:700, fontFamily:'var(--font-display)', color:ROLE_TEXT[s.role] }}>
                    {s.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p style={{ fontSize:'14px', fontWeight:600, color:'var(--color-text)' }}>{s.name}</p>
                    <p style={{ fontSize:'12px', color:'var(--color-text-dim)', marginTop:'2px' }}>{s.stations?.name ?? 'Zonal (All Stations)'}</p>
                  </div>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                  <span style={{ fontSize:'11px', fontWeight:600, padding:'4px 12px', borderRadius:'999px', background:ROLE_COLORS[s.role], color:ROLE_TEXT[s.role], textTransform:'capitalize' }}>{s.role?.replace('_',' ')}</span>
                  {me?.role==='admin' && s.user_id!==me?.user_id && (
                    <button onClick={()=>removeStaff(s.id,s.name)} style={{ fontSize:'11px', fontWeight:600, color:'var(--color-live)', background:'none', border:'none', cursor:'pointer' }}>Remove</button>
                  )}
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </AdminLayout>
  )
}
