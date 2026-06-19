import { Mic, Newspaper, Wrench, Monitor, TrendingUp, FolderOpen, Wallet, ClipboardList, Package } from 'lucide-react'

export default function About() {
  const timeline = [
    { year:'1933', event:'Colonial government introduces Radio Distribution System in Nigeria via Dept. of Post & Telegraph.' },
    { year:'1943', event:'Radio Distribution System opens in Ibadan, expanding beyond Lagos.' },
    { year:'1955', event:'Radio Nigeria Ibadan comes on stream on April 1st with a shortwave transmitter at Oke-Are, Ibadan.' },
    { year:'1957', event:'Nigerian Broadcasting Corporation (NBC) established by Act of Parliament No. 39 of 1956. Ibadan equipped with 10Kw MW and 5Kw SW transmitters.' },
    { year:'1960', event:'Radio Nigeria begins commercial service, supporting Nigeria\'s growing industries at independence.' },
    { year:'1963', event:'Rev. Victor Badejo becomes the first Nigerian General Director of the Corporation.' },
    { year:'1978', event:'NBC reorganised by Decree No. 8 into the Federal Radio Corporation of Nigeria (FRCN).' },
    { year:'2001', event:'Premier 93.5 FM commissioned on October 30th by the late First Lady, Chief Stella Obasanjo.' },
    { year:'2007', event:'Amuludun 99.1 FM established on October 10th — a dedicated pure Yoruba language station.' },
  ]

  const departments = [
    { name:'Programmes',          icon:<Mic size={22}/>,         desc:'Develops, produces, and schedules all on-air content including music, talk shows, dramas, documentaries, and community programming.' },
    { name:'News & Current Affairs', icon:<Newspaper size={22}/>,  desc:'Gathers, reports, edits, and broadcasts news bulletins in English and Yoruba. Covers local, national, and international stories.' },
    { name:'Engineering Services',icon:<Wrench size={22}/>,      desc:'Maintains all broadcast equipment — transmitters, studio consoles, recording gear, and transmission infrastructure.' },
    { name:'ICT',                 icon:<Monitor size={22}/>,     desc:'Manages digital infrastructure including servers, computers, digital audio workstations, streaming, and internal networks.' },
    { name:'Marketing',           icon:<TrendingUp size={22}/>,  desc:'Handles advertising sales, sponsorships, commercial spots, and all revenue generation for the station.' },
    { name:'Administration',      icon:<FolderOpen size={22}/>,  desc:'Manages HR, correspondence, office operations, staff welfare, and general management functions.' },
    { name:'Finance & Accounts',  icon:<Wallet size={22}/>,      desc:'Handles budgeting, payroll, expenditure tracking, and financial reporting to FRCN headquarters.' },
    { name:'Audit',               icon:<ClipboardList size={22}/>, desc:'Internal oversight of financial transactions and compliance with regulatory and government financial standards.' },
    { name:'Procurement',         icon:<Package size={22}/>,     desc:'Manages purchasing of equipment, supplies, and services following due government process.' },
  ]

  return (
    <main style={{ paddingTop:'140px' }}>
      {/* Hero */}
      <div style={{ background:`linear-gradient(to bottom, rgba(0,92,46,0.15), transparent)`, borderBottom:'1px solid var(--color-border)', padding:'80px 24px 60px' }}>
        <div style={{ maxWidth:'800px', margin:'0 auto', textAlign:'center' }}>
          <p style={{ fontSize:'17px', fontWeight:600, color:'var(--color-brand-light)', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'16px' }}>Est. 1955 · Dugbe, Ibadan</p>
          <h1 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(36px,6vw,64px)', fontWeight:900, color:'var(--color-text)', letterSpacing:'-0.04em', marginBottom:'20px' }}>
            Broadcasting Nigeria's Voice, <em style={{ color:'var(--color-accent)', fontStyle:'italic' }}>Since 1955</em>
          </h1>
          <p style={{ fontSize:'17px', color:'var(--color-text-muted)', lineHeight:1.7, maxWidth:'600px', margin:'0 auto' }}>
            The Federal Radio Corporation of Nigeria — Ibadan Zonal Station is the Southwest arm of the FRCN, responsible for broadcasting across Oyo, Ogun, Ondo, Osun, Edo, Lagos and beyond.
          </p>
        </div>
      </div>

      {/* Mission / Vision */}
      <div style={{ maxWidth:'1280px', margin:'0 auto', padding:'64px 24px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'24px' }}>
          {[
            { label:'Our Mission', color:'var(--color-brand)', text:'To inform, educate, and entertain through the creation and maintenance of broadcast outfits that serve as models in Nigeria and Africa in terms of standards, professionalism, and character.' },
            { label:'Our Vision', color:'var(--color-accent)', text:'To be an impartial, credible, creative, and digitized medium in the forefront of Nigeria\'s national development, unity, and progress.' },
          ].map(({ label, color, text }) => (
            <div key={label} style={{ background:'var(--color-surface)', borderRadius:'16px', padding:'32px', border:'1px solid var(--color-border)', borderLeft:`3px solid ${color}` }}>
              <p style={{ fontSize:'17px', fontWeight:700, color, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'14px' }}>{label}</p>
              <p style={{ fontSize:'17px', color:'var(--color-text-muted)', lineHeight:1.75 }}>{text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* History Timeline */}
      <div style={{ background:'var(--color-surface)', borderTop:'1px solid var(--color-border)', borderBottom:'1px solid var(--color-border)' }}>
        <div style={{ maxWidth:'800px', margin:'0 auto', padding:'64px 24px' }}>
          <h2 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(26px,4vw,36px)', fontWeight:900, color:'var(--color-text)', letterSpacing:'-0.04em', marginBottom:'48px', textAlign:'center' }}>Our History</h2>
          <div style={{ position:'relative', paddingLeft:'32px' }}>
            <div style={{ position:'absolute', left:'6px', top:0, bottom:0, width:'2px', background:`linear-gradient(to bottom, var(--color-brand), transparent)` }} />
            {timeline.map(({ year, event }) => (
              <div key={year} style={{ position:'relative', marginBottom:'36px' }}>
                <div style={{ position:'absolute', left:'-29px', top:'3px', width:'14px', height:'14px', borderRadius:'50%', background:'var(--color-brand)', border:'2px solid var(--color-bg)', boxShadow:'0 0 8px rgba(0,92,46,0.4)' }} />
                <p style={{ fontSize:'17px', fontWeight:700, color:'var(--color-accent)', letterSpacing:'0.08em', marginBottom:'6px' }}>{year}</p>
                <p style={{ fontSize:'18px', color:'var(--color-text-muted)', lineHeight:1.7 }}>{event}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Departments */}
      <div style={{ maxWidth:'1280px', margin:'0 auto', padding:'64px 24px 80px' }}>
        <div style={{ textAlign:'center', marginBottom:'48px' }}>
          <p style={{ fontSize:'17px', fontWeight:600, color:'var(--color-brand-light)', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'10px' }}>Structure</p>
          <h2 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(26px,4vw,40px)', fontWeight:900, color:'var(--color-text)', letterSpacing:'-0.04em' }}>Our Departments</h2>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:'16px' }}>
          {departments.map(({ name, icon, desc }) => (
            <div key={name} style={{ background:'var(--color-surface)', borderRadius:'14px', padding:'24px', border:'1px solid var(--color-border)', transition:'border-color 0.2s' }}
              onMouseEnter={e=>e.currentTarget.style.borderColor='var(--color-border-light)'}
              onMouseLeave={e=>e.currentTarget.style.borderColor='var(--color-border)'}
            >
              <div style={{ color:'var(--color-brand-light)', marginBottom:'14px' }}>{icon}</div>
              <h3 style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'18px', color:'var(--color-text)', marginBottom:'8px', letterSpacing:'-0.02em' }}>{name}</h3>
              <p style={{ fontSize:'17px', color:'var(--color-text-muted)', lineHeight:1.65 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      <style>{`@media(max-width:640px){main>div:nth-child(2)>div{grid-template-columns:1fr !important;}}`}</style>
    </main>
  )
}
