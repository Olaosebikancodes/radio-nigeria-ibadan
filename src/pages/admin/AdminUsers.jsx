import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import AdminLayout from '../../components/layout/AdminLayout'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

const inputStyle = { width:'100%', padding:'9px 12px', borderRadius:'8px', fontSize:'13px', background:'var(--color-surface-2)', border:'1px solid var(--color-border)', color:'var(--color-text)', outline:'none', fontFamily:'var(--font-body)' }
const EMPTY = { name:'', role:'admin', station_id:'', email:'', password:'' }

// Staff Accounts page — manage admin accounts.
// Creates both a Supabase Auth user (login credentials) AND a staff row in the database.
//
// When a new account is created, Supabase sends a confirmation email to the staff member.
// They must confirm it before they can log in. If confirmation is a problem, you can
// disable email confirmation in: Supabase dashboard → Authentication → Providers → Email.
//
// "Remove" only deletes the staff row — it does NOT delete the Supabase Auth account.
// To fully delete a user, also go to Supabase → Authentication → Users and delete them there.
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
    // Step 1: Create the Supabase Auth account (handles password hashing, email confirmation)
    const { data, error } = await supabase.auth.signUp({ email:form.email, password:form.password })
    if (error) { toast.error(error.message); setSaving(false); return }
    const userId = data.user?.id
    if (!userId) { toast.error('Could not get user ID — account may already exist'); setSaving(false); return }
    // Step 2: Create the staff record linking the auth user to a role and station
    const { error: staffErr } = await supabase.from('staff').insert({ user_id:userId, name:form.name, role:form.role, station_id:form.station_id||null })
    setSaving(false)
    if (staffErr) { toast.error(staffErr.message); return }
    toast.success(`Account created — ${form.email} will receive a confirmation email`); setShowForm(false); setForm(EMPTY); fetchAll()
  }

  // Removes the staff row only. The Supabase Auth account remains — delete it manually
  // in the Supabase dashboard if the person should have no access at all.
  const removeStaff = async (id, name) => {
    if (!confirm(`Remove ${name} from staff?`)) return
    await supabase.from('staff').delete().eq('id',id)
    toast.success('Staff removed'); fetchAll()
  }

  const ROLE_COLOR = 'rgba(240,165,0,0.15)'
  const ROLE_TEXT  = 'var(--color-accent)'

  return (
    <AdminLayout>
      <div className="admin-content">
        <style>{`
          .admin-content { padding: 32px; }
          @media(max-width:640px){ .admin-content { padding: 16px; } }
          @media(max-width:640px){ .staff-form-grid { grid-template-columns: 1fr !important; } }
          @media(max-width:640px){ .staff-header { flex-wrap: wrap; gap: 12px; } }
          @media(max-width:480px){ .staff-row { flex-wrap: wrap; gap: 10px; } }
          @media(max-width:480px){ .staff-row-right { flex-wrap: wrap; } }
        `}</style>
        <div className="staff-header" style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'28px' }}>
          <div>
            <h1 style={{ fontFamily:'var(--font-display)', fontSize:'28px', fontWeight:700, color:'var(--color-text)', letterSpacing:'-0.03em' }}>Staff Accounts</h1>
            <p style={{ fontSize:'13px', color:'var(--color-text-muted)', marginTop:'4px' }}>{staff.length} staff member{staff.length!==1?'s':''}</p>
          </div>
          <button onClick={()=>setShowForm(s=>!s)} style={{ padding:'10px 20px', borderRadius:'10px', fontSize:'13px', fontWeight:600, cursor:'pointer', background:'var(--color-brand)', color:'#fff', border:'none' }}>{showForm?'Cancel':'+ Add Staff'}</button>
        </div>

        {showForm && (
          <div style={{ background:'var(--color-surface)', borderRadius:'16px', border:'1px solid var(--color-border)', padding:'24px', marginBottom:'24px' }}>
            <h2 style={{ fontFamily:'var(--font-display)', fontSize:'18px', fontWeight:700, color:'var(--color-text)', marginBottom:'20px' }}>New Staff Account</h2>
            <div className="staff-form-grid" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px' }}>
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

        <div style={{ background:'var(--color-surface)', borderRadius:'16px', border:'1px solid var(--color-border)', overflow:'hidden' }}>
          {loading ? <p style={{padding:'24px',color:'var(--color-text-muted)'}}>Loading…</p>
            : staff.length===0 ? <p style={{padding:'24px',color:'var(--color-text-muted)',textAlign:'center'}}>No staff accounts yet.</p>
            : staff.map(s=>(
              <div key={s.id} className="staff-row" style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 20px', borderBottom:'1px solid var(--color-border)' }}
                onMouseEnter={e=>e.currentTarget.style.background='var(--color-surface-2)'}
                onMouseLeave={e=>e.currentTarget.style.background='transparent'}
              >
                <div style={{ display:'flex', alignItems:'center', gap:'14px' }}>
                  <div style={{ width:'40px', height:'40px', borderRadius:'10px', background:`${ROLE_TEXT}20`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'16px', fontWeight:700, fontFamily:'var(--font-display)', color:ROLE_TEXT }}>
                    {s.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p style={{ fontSize:'14px', fontWeight:600, color:'var(--color-text)' }}>{s.name}</p>
                    <p style={{ fontSize:'12px', color:'var(--color-text-dim)', marginTop:'2px' }}>{s.stations?.name ?? 'Zonal (All Stations)'}</p>
                  </div>
                </div>
                <div className="staff-row-right" style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                  <span style={{ fontSize:'11px', fontWeight:600, padding:'4px 12px', borderRadius:'999px', background:ROLE_COLOR, color:ROLE_TEXT }}>Admin</span>
                  {s.user_id!==me?.user_id && (
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
