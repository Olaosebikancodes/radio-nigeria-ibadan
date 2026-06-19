import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'

export default function Contact() {
  const [form, setForm] = useState({ name:'', email:'', subject:'', message:'' })
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)

  const handle = e => setForm(f => ({...f, [e.target.name]: e.target.value}))

  const submit = async (e) => {
    e.preventDefault()
    setSending(true)
    const { error } = await supabase.from('contact_messages').insert({
      name: form.name, email: form.email, subject: form.subject, message: form.message,
    })
    setSending(false)
    if (error) { toast.error('Failed to send. Please try again.'); return }
    setSent(true)
  }

  const inputStyle = { width:'100%', padding:'11px 14px', borderRadius:'10px', fontSize:'14px', background:'var(--color-surface-2)', border:'1px solid var(--color-border)', color:'var(--color-text)', outline:'none', transition:'border-color 0.2s', fontFamily:'var(--font-body)' }

  return (
    <main style={{ paddingTop:'104px' }}>
      <div style={{ background:`linear-gradient(to bottom, rgba(0,92,46,0.12), transparent)`, borderBottom:'1px solid var(--color-border)', padding:'60px 24px 48px' }}>
        <div style={{ maxWidth:'1280px', margin:'0 auto' }}>
          <p style={{ fontSize:'11px', fontWeight:600, color:'var(--color-brand-light)', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'10px' }}>Reach Us</p>
          <h1 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(32px,5vw,56px)', fontWeight:900, color:'var(--color-text)', letterSpacing:'-0.04em' }}>Contact Us</h1>
        </div>
      </div>

      <div style={{ maxWidth:'1280px', margin:'0 auto', padding:'48px 24px 80px', display:'grid', gridTemplateColumns:'1.2fr 1fr', gap:'48px' }}>
        {/* Form */}
        <div>
          <h2 style={{ fontFamily:'var(--font-display)', fontSize:'22px', fontWeight:700, color:'var(--color-text)', marginBottom:'24px', letterSpacing:'-0.03em' }}>Send a Message</h2>
          {sent ? (
            <div style={{ background:'rgba(0,92,46,0.12)', border:'1px solid rgba(0,92,46,0.3)', borderRadius:'14px', padding:'32px', textAlign:'center' }}>
              <p style={{ fontSize:'32px', marginBottom:'12px' }}>✅</p>
              <p style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'20px', color:'var(--color-text)', marginBottom:'8px' }}>Message sent!</p>
              <p style={{ fontSize:'14px', color:'var(--color-text-muted)' }}>We'll get back to you as soon as possible.</p>
              <button onClick={() => { setSent(false); setForm({name:'',email:'',subject:'',message:''}) }} style={{ marginTop:'20px', padding:'10px 24px', borderRadius:'8px', fontSize:'13px', fontWeight:600, cursor:'pointer', background:'var(--color-brand)', color:'#fff', border:'none' }}>Send another</button>
            </div>
          ) : (
            <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
              <div className="contact-name-row" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
                <div>
                  <label style={{ fontSize:'12px', fontWeight:600, color:'var(--color-text-muted)', display:'block', marginBottom:'6px' }}>Full Name</label>
                  <input name="name" value={form.name} onChange={handle} required placeholder="Adeola Johnson" style={inputStyle} onFocus={e=>e.target.style.borderColor='var(--color-brand-light)'} onBlur={e=>e.target.style.borderColor='var(--color-border)'} />
                </div>
                <div>
                  <label style={{ fontSize:'12px', fontWeight:600, color:'var(--color-text-muted)', display:'block', marginBottom:'6px' }}>Email</label>
                  <input name="email" type="email" value={form.email} onChange={handle} required placeholder="adeola@example.com" style={inputStyle} onFocus={e=>e.target.style.borderColor='var(--color-brand-light)'} onBlur={e=>e.target.style.borderColor='var(--color-border)'} />
                </div>
              </div>
              <div>
                <label style={{ fontSize:'12px', fontWeight:600, color:'var(--color-text-muted)', display:'block', marginBottom:'6px' }}>Subject</label>
                <input name="subject" value={form.subject} onChange={handle} required placeholder="Programme feedback, Advert enquiry…" style={inputStyle} onFocus={e=>e.target.style.borderColor='var(--color-brand-light)'} onBlur={e=>e.target.style.borderColor='var(--color-border)'} />
              </div>
              <div>
                <label style={{ fontSize:'12px', fontWeight:600, color:'var(--color-text-muted)', display:'block', marginBottom:'6px' }}>Message</label>
                <textarea name="message" value={form.message} onChange={handle} required rows={6} placeholder="Write your message here…" style={{...inputStyle, resize:'vertical'}} onFocus={e=>e.target.style.borderColor='var(--color-brand-light)'} onBlur={e=>e.target.style.borderColor='var(--color-border)'} />
              </div>
              <button type="submit" disabled={sending} style={{ padding:'13px 28px', borderRadius:'10px', fontSize:'14px', fontWeight:700, cursor:sending?'not-allowed':'pointer', background:'var(--color-brand)', color:'#fff', border:'none', transition:'background 0.2s', alignSelf:'flex-start', opacity:sending?0.7:1 }} onMouseEnter={e=>{ if(!sending) e.currentTarget.style.background='var(--color-brand-light)' }} onMouseLeave={e=>e.currentTarget.style.background='var(--color-brand)'}>
                {sending ? 'Sending…' : 'Send Message →'}
              </button>
            </form>
          )}
        </div>

        {/* Info */}
        <div style={{ display:'flex', flexDirection:'column', gap:'20px' }}>
          <h2 style={{ fontFamily:'var(--font-display)', fontSize:'22px', fontWeight:700, color:'var(--color-text)', letterSpacing:'-0.03em' }}>Station Information</h2>

          {[
            { icon:'📍', label:'Address', value:'Broadcasting House, Oba-Adebimpe Road, Dugbe, Ibadan, Oyo State, Nigeria' },
            { icon:'📞', label:'Phone', value:'+234 (0)2 241 2345' },
            { icon:'📧', label:'Email', value:'info@radionigeriaibadan.gov.ng' },
            { icon:'📻', label:'Headquarters', value:'Federal Radio Corporation of Nigeria, Abuja' },
          ].map(({ icon, label, value }) => (
            <div key={label} style={{ display:'flex', gap:'16px', padding:'20px', background:'var(--color-surface)', borderRadius:'14px', border:'1px solid var(--color-border)' }}>
              <span style={{ fontSize:'22px', flexShrink:0 }}>{icon}</span>
              <div>
                <p style={{ fontSize:'11px', fontWeight:700, color:'var(--color-text-dim)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'4px' }}>{label}</p>
                <p style={{ fontSize:'14px', color:'var(--color-text-muted)', lineHeight:1.5 }}>{value}</p>
              </div>
            </div>
          ))}

          <div style={{ background:'var(--color-surface)', borderRadius:'14px', border:'1px solid var(--color-border)', overflow:'hidden' }}>
            <div style={{ padding:'20px', borderBottom:'1px solid var(--color-border)' }}>
              <p style={{ fontSize:'11px', fontWeight:700, color:'var(--color-text-dim)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'4px' }}>Office Hours</p>
              <p style={{ fontSize:'13px', color:'var(--color-text-muted)' }}>Mon – Fri: 8:00 AM – 5:00 PM</p>
              <p style={{ fontSize:'13px', color:'var(--color-text-muted)' }}>On-Air: 24 hours a day, 7 days a week</p>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @media(max-width:800px){ main>div:last-child{ grid-template-columns:1fr !important; } }
        @media(max-width:560px){ .contact-name-row{ grid-template-columns:1fr !important; } }
      `}</style>
    </main>
  )
}
