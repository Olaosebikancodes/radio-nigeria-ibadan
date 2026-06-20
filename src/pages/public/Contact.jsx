import { MapPin, Phone, Mail, Radio } from 'lucide-react'

export default function Contact() {
  return (
    <main className="inner-page-main" style={{ paddingTop:'140px' }}>
      <style>{`
        @media(max-width:768px){ .inner-page-main { padding-top: 104px !important; } }
        @media(max-width:400px){ .inner-page-main { padding-top: 88px !important; } }
        @media(max-width:640px){ .contact-info-grid { max-width: 100% !important; } }
      `}</style>
      <div style={{ background:`linear-gradient(to bottom, rgba(0,92,46,0.12), transparent)`, borderBottom:'1px solid var(--color-border)', padding:'60px 24px 48px' }}>
        <div style={{ maxWidth:'1280px', margin:'0 auto' }}>
          <p style={{ fontSize:'17px', fontWeight:600, color:'var(--color-brand-light)', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'10px' }}>Reach Us</p>
          <h1 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(32px,5vw,56px)', fontWeight:900, color:'var(--color-text)', letterSpacing:'-0.04em' }}>Contact Us</h1>
        </div>
      </div>

      <div style={{ maxWidth:'800px', margin:'0 auto', padding:'48px 24px 80px', display:'flex', flexDirection:'column', gap:'20px' }}>
        <h2 style={{ fontFamily:'var(--font-display)', fontSize:'22px', fontWeight:700, color:'var(--color-text)', letterSpacing:'-0.03em' }}>Station Information</h2>

        {[
          { icon:<MapPin size={20}/>,  label:'Address',       value:'Broadcasting House, Oba-Adebimpe Road, Dugbe, Ibadan, Oyo State, Nigeria' },
          { icon:<Phone size={20}/>,   label:'Phone',         value:'+234 (0)2 241 2345' },
          { icon:<Mail size={20}/>,    label:'Email',         value:'info@radionigeriaibadan.gov.ng' },
          { icon:<Radio size={20}/>,   label:'Headquarters',  value:'Federal Radio Corporation of Nigeria, Abuja' },
        ].map(({ icon, label, value }) => (
          <div key={label} style={{ display:'flex', gap:'16px', padding:'20px', background:'var(--color-surface)', borderRadius:'14px', border:'1px solid var(--color-border)' }}>
            <div style={{ color:'var(--color-brand-light)', flexShrink:0, marginTop:'2px' }}>{icon}</div>
            <div>
              <p style={{ fontSize:'17px', fontWeight:700, color:'var(--color-text-dim)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'4px' }}>{label}</p>
              <p style={{ fontSize:'18px', color:'var(--color-text-muted)', lineHeight:1.5 }}>{value}</p>
            </div>
          </div>
        ))}

        <div style={{ background:'var(--color-surface)', borderRadius:'14px', border:'1px solid var(--color-border)' }}>
          <div style={{ padding:'20px' }}>
            <p style={{ fontSize:'17px', fontWeight:700, color:'var(--color-text-dim)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'4px' }}>Office Hours</p>
            <p style={{ fontSize:'17px', color:'var(--color-text-muted)' }}>Mon – Fri: 8:00 AM – 5:00 PM</p>
            <p style={{ fontSize:'17px', color:'var(--color-text-muted)' }}>On-Air: 24 hours a day, 7 days a week</p>
          </div>
        </div>
      </div>
    </main>
  )
}
