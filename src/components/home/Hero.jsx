export default function Hero() {
  return (
    <section style={{ position: 'relative', paddingTop: '104px', minHeight: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
      {/* Background */}
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse 70% 60% at 30% 50%, rgba(0,92,46,0.2) 0%, transparent 65%), radial-gradient(ellipse 50% 50% at 80% 30%, rgba(240,165,0,0.05) 0%, transparent 60%), var(--color-bg)` }} />
      <div style={{ position: 'absolute', inset: 0, opacity: 0.025, backgroundImage: `linear-gradient(var(--color-text) 1px, transparent 1px), linear-gradient(90deg, var(--color-text) 1px, transparent 1px)`, backgroundSize: '60px 60px' }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1280px', margin: '0 auto', padding: '48px 24px', width: '100%' }}>

        {/* LEFT */}
        <div style={{ animation: 'fade-up 0.7s var(--ease-out-expo) both', maxWidth: '600px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '5px 14px', borderRadius: '999px', background: 'rgba(0,92,46,0.15)', border: '1px solid rgba(0,92,46,0.35)', fontSize: '11px', color: 'var(--color-brand-light)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '24px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4EFF8C', animation: 'pulse-live 1.4s infinite' }} />
            Broadcasting Since 1955 · Dugbe, Ibadan
          </div>

          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(28px, 4vw, 52px)', lineHeight: 1.1, letterSpacing: '-0.04em', color: 'var(--color-text)', marginBottom: '16px' }}>
            Uplifting the People,<br />
            <em style={{ color: 'var(--color-accent)', fontStyle: 'italic' }}>Uniting the Nation</em>
          </h1>

          <p style={{ fontSize: 'clamp(14px, 1.5vw, 17px)', color: 'var(--color-text-muted)', lineHeight: 1.7, marginBottom: '36px', maxWidth: '440px' }}>
            Federal Radio Corporation of Nigeria — Ibadan Zonal Station. 8 FM stations serving the South West and beyond.
          </p>

          {/* Waveform */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '28px', marginTop: '36px' }}>
            {Array.from({ length: 18 }).map((_, i) => (
              <div key={i} style={{ width: '4px', borderRadius: '3px', background: `linear-gradient(to top, var(--color-brand-light), var(--color-accent))`, animation: `wave-bar ${0.7 + (i % 4) * 0.15}s ease-in-out ${i * 0.06}s infinite`, transformOrigin: 'bottom', height: `${12 + Math.floor(Math.sin(i * 0.8) * 10 + 10)}px`, opacity: 0.45 }} />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 480px) {
          .hero-logo { height: 52px !important; }
        }
      `}</style>
    </section>
  )
}
