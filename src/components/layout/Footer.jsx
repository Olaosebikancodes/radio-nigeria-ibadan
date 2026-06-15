import { Link } from 'react-router-dom'
import { STATIONS_SEED } from '../../lib/utils'

const LINKS = {
  'Explore': [
    { label:'Home',       to:'/' },
    { label:'Stations',   to:'/stations' },
    { label:'Live Radio', to:'/live' },
    { label:'News',       to:'/news' },
    { label:'Programmes', to:'/programmes' },
    { label:'Audio',      to:'/audio' },
  ],
  'About': [
    { label:'About Us',   to:'/about' },
    { label:'Contact',    to:'/contact' },
    { label:'FRCN',       to:'https://radionigeria.gov.ng', ext:true },
  ],
}

function Divider() {
  return <div style={{ height:'1px', background:'var(--color-border)', margin:'0 0 32px' }} />
}

export default function Footer() {
  return (
    <footer style={{ background:'var(--color-surface)', borderTop:'1px solid var(--color-border)', marginTop:'80px' }}>
      <div style={{ maxWidth:'1280px', margin:'0 auto', padding:'60px 24px 32px' }}>

        {/* Top grid */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1.4fr', gap:'48px', marginBottom:'48px' }}>

          {/* Brand */}
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'16px' }}>
              <div style={{
                width:'36px', height:'36px', borderRadius:'8px',
                background:'linear-gradient(135deg, var(--color-brand-light), var(--color-brand-dark))',
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:'14px', fontWeight:900, color:'#fff', fontFamily:'var(--font-display)',
              }}>RN</div>
              <div>
                <p style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'14px', color:'var(--color-text)' }}>Radio Nigeria</p>
                <p style={{ fontSize:'10px', color:'var(--color-text-muted)', letterSpacing:'0.06em', textTransform:'uppercase' }}>Ibadan Zonal Station</p>
              </div>
            </div>
            <p style={{ fontSize:'13px', color:'var(--color-text-muted)', lineHeight:1.7, maxWidth:'220px' }}>
              Uplifting the People & Uniting the Nation. Broadcasting from Dugbe, Ibadan since 1955.
            </p>
            <p style={{ marginTop:'16px', fontSize:'12px', color:'var(--color-text-dim)' }}>
              Broadcasting House, Oba-Adebimpe Rd,<br />Dugbe, Ibadan, Oyo State.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([heading, items]) => (
            <div key={heading}>
              <p style={{ fontSize:'11px', fontWeight:600, color:'var(--color-text-dim)', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'16px' }}>{heading}</p>
              <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:'10px' }}>
                {items.map(({ label, to, ext }) => (
                  <li key={label}>
                    {ext
                      ? <a href={to} target="_blank" rel="noopener noreferrer" style={{ fontSize:'13px', color:'var(--color-text-muted)', transition:'color 0.2s' }}
                          onMouseEnter={e=>e.target.style.color='var(--color-accent)'}
                          onMouseLeave={e=>e.target.style.color='var(--color-text-muted)'}
                        >{label} ↗</a>
                      : <Link to={to} style={{ fontSize:'13px', color:'var(--color-text-muted)', transition:'color 0.2s' }}
                          onMouseEnter={e=>e.target.style.color='var(--color-accent)'}
                          onMouseLeave={e=>e.target.style.color='var(--color-text-muted)'}
                        >{label}</Link>
                    }
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Stations */}
          <div>
            <p style={{ fontSize:'11px', fontWeight:600, color:'var(--color-text-dim)', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'16px' }}>Our Stations</p>
            <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
              {STATIONS_SEED.map(s => (
                <Link key={s.slug} to={`/stations/${s.slug}`} style={{ display:'flex', alignItems:'center', gap:'10px' }}
                  onMouseEnter={e => e.currentTarget.querySelector('.sname').style.color='var(--color-accent)'}
                  onMouseLeave={e => e.currentTarget.querySelector('.sname').style.color='var(--color-text-muted)'}
                >
                  <div style={{ width:'24px', height:'24px', borderRadius:'6px', background:s.color, flexShrink:0, opacity:0.85 }} />
                  <div>
                    <p className="sname" style={{ fontSize:'12px', color:'var(--color-text-muted)', fontWeight:500, transition:'color 0.2s', lineHeight:1.2 }}>{s.name}</p>
                    <p style={{ fontSize:'10px', color:'var(--color-text-dim)' }}>{s.location}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <Divider />

        {/* Bottom */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'12px' }}>
          <p style={{ fontSize:'12px', color:'var(--color-text-dim)' }}>
            © {new Date().getFullYear()} Federal Radio Corporation of Nigeria — Ibadan Zonal Station. All rights reserved.
          </p>
          <p style={{ fontSize:'12px', color:'var(--color-text-dim)' }}>
            Site by <span style={{ color:'var(--color-accent)' }}>Prisac Labs</span>
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          footer > div > div:first-of-type {
            grid-template-columns: 1fr 1fr !important;
            gap: 32px !important;
          }
        }
        @media (max-width: 560px) {
          footer > div > div:first-of-type {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  )
}
