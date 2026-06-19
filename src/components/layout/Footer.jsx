import { Link } from 'react-router-dom'
import { STATIONS_SEED, SOCIAL_LINKS } from '../../lib/utils'

const FacebookIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
const YoutubeIcon  = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>

const LINKS = {
  'Info': [
    { label:'About Us', to:'/about' },
    { label:'Contact',  to:'/contact' },
    { label:'FRCN HQ',  to:'https://radionigeria.gov.ng', ext:true },
  ],
}

const SOCIALS = [
  { href: SOCIAL_LINKS.facebook, icon: <FacebookIcon />, label: 'Facebook', hoverColor: '#1877F2' },
  { href: SOCIAL_LINKS.youtube,  icon: <YoutubeIcon />,  label: 'YouTube',  hoverColor: '#FF0000' },
]

export default function Footer() {
  return (
    <footer style={{ borderTop:'1px solid var(--color-border)', marginTop:'80px', backgroundImage:'url(https://tfxpqxxzopsycpnmdyke.supabase.co/storage/v1/object/public/images/IZS%20Building.JPG.jpeg)', backgroundSize:'cover', backgroundPosition:'center', backgroundRepeat:'no-repeat', color:'var(--color-text)' }}>
      <div style={{ maxWidth:'1280px', margin:'0 auto', padding:'56px 24px 32px' }}>

        <div style={{ display:'grid', gridTemplateColumns:'1.4fr 1fr 1.2fr', gap:'40px', marginBottom:'48px' }}>

          <div>
            <div style={{ marginBottom:'14px' }}>
              <img src="https://tfxpqxxzopsycpnmdyke.supabase.co/storage/v1/object/public/images/Logo%201.png" alt="Radio Nigeria" style={{ height:'56px', width:'auto', objectFit:'contain' }} />
            </div>
            <p style={{ fontSize:'15px', color:'var(--color-text-muted)', lineHeight:1.7, marginBottom:'16px', maxWidth:'240px' }}>
              Uplifting the People & Uniting the Nation. Broadcasting from Dugbe, Ibadan since 1955.
            </p>
            <p style={{ fontSize:'13px', color:'var(--color-text-dim)', lineHeight:1.7, marginBottom:'20px' }}>
              Broadcasting House,<br />Oba-Adebimpe Road, Dugbe,<br />Ibadan, Oyo State.
            </p>

            <div style={{ display:'flex', gap:'8px' }}>
              {SOCIALS.map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" title={s.label} style={{ display:'flex', alignItems:'center', justifyContent:'center', width:'36px', height:'36px', borderRadius:'8px', background:'var(--color-surface-2)', border:'1px solid var(--color-border)', color:'var(--color-text-muted)', transition:'all 0.2s', cursor:'pointer' }}
                  onMouseEnter={e=>{ e.currentTarget.style.color=s.hoverColor; e.currentTarget.style.borderColor=s.hoverColor+'55'; e.currentTarget.style.background=s.hoverColor+'15'; e.currentTarget.style.transform='translateY(-2px)' }}
                  onMouseLeave={e=>{ e.currentTarget.style.color='var(--color-text-muted)'; e.currentTarget.style.borderColor='var(--color-border)'; e.currentTarget.style.background='var(--color-surface-2)'; e.currentTarget.style.transform='none' }}
                >{s.icon}</a>
              ))}
            </div>
          </div>

          {Object.entries(LINKS).map(([heading, items]) => (
            <div key={heading}>
              <p style={{ fontSize:'12px', fontWeight:700, color:'var(--color-text-dim)', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'14px' }}>{heading}</p>
              <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:'10px' }}>
                {items.map(({ label, to, ext }) => (
                  <li key={label}>
                    {ext
                      ? <a href={to} target="_blank" rel="noopener noreferrer" style={{ fontSize:'15px', color:'var(--color-text-muted)', transition:'color 0.2s' }} onMouseEnter={e=>e.target.style.color='var(--color-accent)'} onMouseLeave={e=>e.target.style.color='var(--color-text-muted)'}>{label} ↗</a>
                      : <Link to={to} style={{ fontSize:'15px', color:'var(--color-text-muted)', transition:'color 0.2s' }} onMouseEnter={e=>e.target.style.color='var(--color-accent)'} onMouseLeave={e=>e.target.style.color='var(--color-text-muted)'}>{label}</Link>
                    }
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <p style={{ fontSize:'12px', fontWeight:700, color:'var(--color-text-dim)', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'14px' }}>Our Stations</p>
            <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
              {STATIONS_SEED.map(s => (
                <Link key={s.slug} to={`/stations/${s.slug}`} style={{ display:'flex', alignItems:'center', gap:'9px' }}
                  onMouseEnter={e => e.currentTarget.querySelector('.sname').style.color='var(--color-accent)'}
                  onMouseLeave={e => e.currentTarget.querySelector('.sname').style.color='var(--color-text-muted)'}
                >
                  <div style={{ width:'8px', height:'8px', borderRadius:'50%', background:s.color, flexShrink:0 }} />
                  <p className="sname" style={{ fontSize:'14px', color:'var(--color-text-muted)', fontWeight:500, transition:'color 0.2s' }}>{s.name}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div style={{ height:'1px', background:'var(--color-border)', marginBottom:'24px' }} />

        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'10px' }}>
          <p style={{ fontSize:'13px', color:'var(--color-text-dim)' }}>
            © {new Date().getFullYear()} Federal Radio Corporation of Nigeria — Ibadan Zonal Station. All rights reserved.
          </p>
          <p style={{ fontSize:'13px', color:'var(--color-text-dim)' }}>
            Built by <span style={{ color:'var(--color-accent)' }}>Prisac Labs</span>
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          footer > div > div:first-of-type { grid-template-columns: 1fr 1fr !important; gap: 28px !important; }
        }
        @media (max-width: 560px) {
          footer > div > div:first-of-type { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  )
}
