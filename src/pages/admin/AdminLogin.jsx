import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

// Admin login page — accessible at /admin/login
// Login uses email + password from Supabase Auth.
// To reset a staff password: go to the Supabase dashboard → Authentication → Users,
// find the user, and use "Send password reset email" or set a new password manually.
// The account must also have a matching row in the "staff" table to work properly.
export default function AdminLogin() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const { signIn } = useAuth()
  const navigate   = useNavigate()

  const submit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true)
    const { error: err } = await signIn(email, password)
    if (err) { setError(err.message); setLoading(false) }
    else navigate('/admin')
  }

  const inputStyle = { width:'100%', padding:'12px 14px', borderRadius:'10px', fontSize:'14px', background:'var(--color-surface-2)', border:'1px solid var(--color-border)', color:'var(--color-text)', outline:'none', transition:'border-color 0.2s', fontFamily:'var(--font-body)' }

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--color-bg)' }}>
      <div style={{ width:'100%', maxWidth:'400px', padding:'24px' }}>
        <div style={{ textAlign:'center', marginBottom:'40px' }}>
          <div style={{ width:'52px', height:'52px', borderRadius:'14px', background:'linear-gradient(135deg, var(--color-brand-light), var(--color-brand-dark))', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'20px', fontWeight:900, color:'#fff', fontFamily:'var(--font-display)', margin:'0 auto 16px', boxShadow:'0 0 20px rgba(0,92,46,0.35)' }}>RN</div>
          <h1 style={{ fontFamily:'var(--font-display)', fontSize:'24px', fontWeight:700, color:'var(--color-text)', letterSpacing:'-0.03em' }}>Admin Panel</h1>
          <p style={{ fontSize:'13px', color:'var(--color-text-muted)', marginTop:'6px' }}>Radio Nigeria Ibadan Zonal Station</p>
        </div>

        <div style={{ background:'var(--color-surface)', borderRadius:'16px', padding:'28px', border:'1px solid var(--color-border)' }}>
          <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
            <div>
              <label style={{ fontSize:'12px', fontWeight:600, color:'var(--color-text-muted)', display:'block', marginBottom:'6px' }}>Email Address</label>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required placeholder="staff@radionigeriaibadan.gov.ng" style={inputStyle} onFocus={e=>e.target.style.borderColor='var(--color-brand-light)'} onBlur={e=>e.target.style.borderColor='var(--color-border)'} />
            </div>
            <div>
              <label style={{ fontSize:'12px', fontWeight:600, color:'var(--color-text-muted)', display:'block', marginBottom:'6px' }}>Password</label>
              <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required placeholder="••••••••" style={inputStyle} onFocus={e=>e.target.style.borderColor='var(--color-brand-light)'} onBlur={e=>e.target.style.borderColor='var(--color-border)'} />
            </div>
            {error && <p style={{ fontSize:'13px', color:'var(--color-live)', background:'rgba(255,59,48,0.08)', padding:'10px 12px', borderRadius:'8px', border:'1px solid rgba(255,59,48,0.2)' }}>{error}</p>}
            <button type="submit" disabled={loading} style={{ padding:'13px', borderRadius:'10px', fontSize:'14px', fontWeight:700, cursor:loading?'not-allowed':'pointer', background:'var(--color-brand)', color:'#fff', border:'none', transition:'background 0.2s', opacity:loading?0.6:1 }}>
              {loading ? 'Signing in…' : 'Sign In →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
