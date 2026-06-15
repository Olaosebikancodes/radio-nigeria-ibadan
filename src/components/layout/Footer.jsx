import { Link } from 'react-router-dom'
import { STATIONS_SEED, SOCIAL_LINKS } from '../../lib/utils'

const FacebookIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
const TwitterIcon  = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
const InstagramIcon= () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
const YoutubeIcon  = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>

const LINKS = {
  'Explore': [
    { label:'Home',       to:'/' },
    { label:'Stations',   to:'/stations' },
    { label:'Live Radio', to:'/live' },
    { label:'News',       to:'/news' },
    { label:'Programmes', to:'/programmes' },
    { label:'Audio',      to:'/audio' },
  ],
  'Info': [
    { label:'About Us', to:'/about' },
    { label:'Contact',  to:'/contact' },
    { label:'FRCN HQ',  to:'https://radionigeria.gov.ng', ext:true },
  ],
}

const SOCIALS = [
  { href: SOCIAL_LINKS.facebook,  icon: <FacebookIcon />,  label: 'Facebook',  hoverColor: '#1877F2' },
  { href: SOCIAL_LINKS.twitter,   icon: <TwitterIcon />,   label: 'X/Twitter', hoverColor: '#e2e8f0' },
  { href: SOCIAL_LINKS.instagram, icon: <InstagramIcon />, label: 'Instagram', hoverColor: '#E1306C' },
  { href: SOCIAL_LINKS.youtube,   icon: <YoutubeIcon />,   label: 'YouTube',   hoverColor: '#FF0000' },
]

export default function Footer() {
  return (
    <footer style={{ background:'var(--color-surface)', borderTop:'1px solid var(--color-border)', marginTop:'80px' }}>
      <div style={{ maxWidth:'1280px', margin:'0 auto', padding:'56px 24px 32px' }}>

        {/* Top grid */}
        <div style={{ display:'grid', gridTemplateColumns:'1.4fr 1fr 1fr 1.2fr', gap:'40px', marginBottom:'48px' }}>

          {/* Brand + social */}
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'14px' }}>
              <div style={{ width:'34px', height:'34px', borderRadius:'8px', background:'linear-gradient(135deg, var(--color-brand-light), var(--color-brand-dark))', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'13px', fontWeight:900, color:'#fff', fontFamily:'var(--font-display)' }}>RN</div>
              <div>
                <p style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'14px', color:'var(--color-text)' }}>Radio Nigeria</p>
                <p style={{ fontSize:'10px', color:'var(--color-text-muted)', letterSpacing:'0.06em', textTransform:'uppercase' }}>Ibadan Zonal Station</p>
              </div>
            </div>
            <p style={{ fontSize:'13px', color:'var(--color-text-muted)', lineHeight:1.7, marginBottom:'16px', maxWidth:'220px' }}>
              Uplifting the People & Uniting the Nation. Broadcasting from Dugbe, Ibadan since 1955.
            </p>
            <p style={{ fontSize:'11px', color:'var(--color-text-dim)', lineHeight:1.7, marginBottom:'20px' }}>
              Broadcasting House,<br />Oba-Adebimpe Road, Dugbe,<br />Ibadan, Oyo State.
            </p>

            {/* Social icons */}
            <div style={{ display:'flex', gap:'8px' }}>
              {SOCIALS.map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" title={s.label} style={{ display:'flex', alignItems:'center', justifyContent:'center', width:'34px', height:'34px', borderRadius:'8px', background:'var(--color-surface-2)', border:'1px solid var(--color-border)', color:'var(--color-text-muted)', transition:'all 0.2s', cursor:'pointer' }}
                  onMouseEnter={e=>{ e.currentTarget.style.color=s.hoverColor; e.currentTarget.style.borderColor=s.hoverColor+'55'; e.currentTarget.style.background=s.hoverColor+'15'; e.currentTarget.style.transform='translateY(-2px)' }}
                  onMouseLeave={e=>{ e.currentTarget.style.color='var(--color-text-muted)'; e.currentTarget.style.borderColor='var(--color-border)'; e.currentTarget.style.background='var(--color-surface-2)'; e.currentTarget.style.transform='none' }}
                >{s.icon}</a>
              ))}
            </div>
          </div>

          {/* Nav link columns */}
          {Object.entries(LINKS).map(([heading, items]) => (
            <div key={heading}>
              <p style={{ fontSize:'10px', fontWeight:700, color:'var(--color-text-dim)', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'14px' }}>{heading}</p>
              <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:'9px' }}>
                {items.map(({ label, to, ext }) => (
                  <li key={label}>
                    {ext
                      ? <a href={to} target="_blank" rel="noopener noreferrer" style={{ fontSize:'13px', color:'var(--color-text-muted)', transition:'color 0.2s' }} onMouseEnter={e=>e.target.style.color='var(--color-accent)'} onMouseLeave={e=>e.target.style.color='var(--color-text-muted)'}>{label} ↗</a>
                      : <Link to={to} style={{ fontSize:'13px', color:'var(--color-text-muted)', transition:'color 0.2s' }} onMouseEnter={e=>e.target.style.color='var(--color-accent)'} onMouseLeave={e=>e.target.style.color='var(--color-text-muted)'}>{label}</Link>
                    }
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Stations */}
          <div>
            <p style={{ fontSize:'10px', fontWeight:700, color:'var(--color-text-dim)', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'14px' }}>Our Stations</p>
            <div style={{ display:'flex', flexDirection:'column', gap:'7px' }}>
              {STATIONS_SEED.map(s => (
                <Link key={s.slug} to={`/stations/${s.slug}`} style={{ display:'flex', alignItems:'center', gap:'9px' }}
                  onMouseEnter={e => e.currentTarget.querySelector('.sname').style.color='var(--color-accent)'}
                  onMouseLeave={e => e.currentTarget.querySelector('.sname').style.color='var(--color-text-muted)'}
                >
                  <div style={{ width:'8px', height:'8px', borderRadius:'50%', background:s.color, flexShrink:0 }} />
                  <p className="sname" style={{ fontSize:'12px', color:'var(--color-text-muted)', fontWeight:500, transition:'color 0.2s' }}>{s.name}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div style={{ height:'1px', background:'var(--color-border)', marginBottom:'24px' }} />

        {/* Bottom bar */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'10px' }}>
          <p style={{ fontSize:'11px', color:'var(--color-text-dim)' }}>
            © {new Date().getFullYear()} Federal Radio Corporation of Nigeria — Ibadan Zonal Station. All rights reserved.
          </p>
          <p style={{ fontSize:'11px', color:'var(--color-text-dim)' }}>
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
