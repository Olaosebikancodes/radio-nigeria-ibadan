import { Link } from 'react-router-dom'

function WaveSVG() {
  return (
    <svg viewBox="0 0 1440 120" style={{ position:'absolute', bottom:0, left:0, right:0, width:'100%' }} preserveAspectRatio="none">
      <path d="M0,60 C240,120 480,0 720,60 C960,120 1200,0 1440,60 L1440,120 L0,120 Z"
        fill="var(--color-bg)" />
    </svg>
  )
}

function AnimatedBars() {
  return (
    <div style={{ display:'flex', alignItems:'flex-end', gap:'5px', height:'60px' }}>
      {Array.from({ length: 28 }).map((_, i) => (
        <div key={i} style={{
          width:'4px', borderRadius:'3px',
          background:`linear-gradient(to top, var(--color-brand-light), var(--color-accent))`,
          opacity: 0.3 + Math.random() * 0.5,
          animation:`wave-bar ${0.7 + (i % 5) * 0.2}s ease-in-out ${i * 0.07}s infinite`,
          transformOrigin:'bottom',
          height:`${20 + Math.floor(Math.sin(i * 0.7) * 20 + 20)}px`,
        }} />
      ))}
    </div>
  )
}

export default function Hero() {
  return (
    <section style={{
      position:'relative', minHeight:'100vh',
      display:'flex', alignItems:'center', justifyContent:'center',
      overflow:'hidden', paddingTop:'68px',
    }}>
      {/* Background gradient */}
      <div style={{
        position:'absolute', inset:0,
        background:`radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,92,46,0.25) 0%, transparent 70%),
                    radial-gradient(ellipse 40% 40% at 80% 60%, rgba(240,165,0,0.06) 0%, transparent 60%),
                    var(--color-bg)`,
      }} />

      {/* Subtle grid */}
      <div style={{
        position:'absolute', inset:0, opacity:0.03,
        backgroundImage:`linear-gradient(var(--color-text) 1px, transparent 1px),
                         linear-gradient(90deg, var(--color-text) 1px, transparent 1px)`,
        backgroundSize:'60px 60px',
      }} />

      {/* Content */}
      <div style={{ position:'relative', zIndex:1, maxWidth:'900px', margin:'0 auto', padding:'0 24px', textAlign:'center' }}>

        {/* Label */}
        <div style={{ display:'inline-flex', alignItems:'center', gap:'8px', padding:'6px 16px', borderRadius:'999px',
          background:'rgba(0,92,46,0.15)', border:'1px solid rgba(0,92,46,0.35)',
          fontSize:'12px', color:'var(--color-brand-light)', fontWeight:600, letterSpacing:'0.06em',
          textTransform:'uppercase', marginBottom:'32px', animation:'fade-up 0.6s var(--ease-out-expo) both',
        }}>
          <span style={{ width:'6px', height:'6px', borderRadius:'50%', background:'#4EFF8C', animation:'pulse-live 1.4s infinite' }} />
          Broadcasting from Dugbe, Ibadan since 1955
        </div>

        {/* Heading */}
        <h1 style={{
          fontSize:'clamp(42px, 7vw, 88px)', fontFamily:'var(--font-display)',
          fontWeight:900, lineHeight:1.05, letterSpacing:'-0.04em',
          color:'var(--color-text)', marginBottom:'24px',
          animation:'fade-up 0.7s var(--ease-out-expo) 0.1s both',
        }}>
          Uplifting the People,<br />
          <em style={{ color:'var(--color-accent)', fontStyle:'italic' }}>Uniting the Nation</em>
        </h1>

        {/* Subtext */}
        <p style={{
          fontSize:'clamp(16px, 2.5vw, 20px)', color:'var(--color-text-muted)', maxWidth:'560px',
          margin:'0 auto 40px', lineHeight:1.65,
          animation:'fade-up 0.7s var(--ease-out-expo) 0.2s both',
        }}>
          Federal Radio Corporation of Nigeria — Ibadan Zonal Station.
          7 FM stations serving the South West.
        </p>

        {/* CTAs */}
        <div style={{
          display:'flex', flexWrap:'wrap', gap:'12px', justifyContent:'center',
          animation:'fade-up 0.7s var(--ease-out-expo) 0.3s both',
        }}>
          <Link to="/live" style={{
            display:'inline-flex', alignItems:'center', gap:'8px',
            padding:'14px 28px', borderRadius:'10px', fontSize:'15px', fontWeight:600,
            background:'var(--color-brand)', color:'#fff',
            transition:'all 0.25s var(--ease-out-expo)',
            boxShadow:'0 0 24px rgba(0,92,46,0.3)',
            letterSpacing:'-0.02em',
          }}
            onMouseEnter={e=>{ e.currentTarget.style.background='var(--color-brand-light)'; e.currentTarget.style.transform='translateY(-2px)'; }}
            onMouseLeave={e=>{ e.currentTarget.style.background='var(--color-brand)'; e.currentTarget.style.transform='translateY(0)'; }}
          >
            <span style={{ width:'8px', height:'8px', borderRadius:'50%', background:'#4EFF8C', animation:'pulse-live 1.4s infinite' }} />
            Listen Live Now
          </Link>

          <Link to="/news" style={{
            display:'inline-flex', alignItems:'center', gap:'8px',
            padding:'14px 28px', borderRadius:'10px', fontSize:'15px', fontWeight:600,
            background:'transparent', color:'var(--color-text)',
            border:'1px solid var(--color-border-light)',
            transition:'all 0.25s var(--ease-out-expo)',
            letterSpacing:'-0.02em',
          }}
            onMouseEnter={e=>{ e.currentTarget.style.background='var(--color-surface-2)'; e.currentTarget.style.transform='translateY(-2px)'; }}
            onMouseLeave={e=>{ e.currentTarget.style.background='transparent'; e.currentTarget.style.transform='translateY(0)'; }}
          >
            Latest News →
          </Link>
        </div>

        {/* Waveform */}
        <div style={{ marginTop:'56px', display:'flex', justifyContent:'center', animation:'fade-up 0.8s var(--ease-out-expo) 0.4s both' }}>
          <AnimatedBars />
        </div>
      </div>

      <WaveSVG />
    </section>
  )
}
