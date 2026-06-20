export default function Hero() {
  return (
    <section className="hero-section" style={{ paddingBottom: '32px' }}>
      <img
        src="https://tfxpqxxzopsycpnmdyke.supabase.co/storage/v1/object/public/images/izs-ts1552243779(1).png"
        alt="Radio Nigeria Ibadan Zonal Station"
        style={{ width: '100%', display: 'block', objectFit: 'cover' }}
      />
      <style>{`
        .hero-section { padding-top: 160px; }
        @media (max-width: 768px) { .hero-section { padding-top: 104px; } }
        @media (max-width: 400px) { .hero-section { padding-top: 88px; } }
      `}</style>
    </section>
  )
}
