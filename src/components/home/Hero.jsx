import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { STATIONS_SEED, timeAgo } from '../../lib/utils'
import { usePlayer } from '../../context/PlayerContext'

function ListenModal({ onClose }) {
  const [stations, setStations] = useState([])
  const { play, activeStation, playing } = usePlayer()

  useEffect(() => {
    supabase.from('stations').select('*').eq('active', true).order('sort_order')
      .then(({ data }) => setStations(data?.length ? data : STATIONS_SEED))
  }, [])

  return (
    // Full-screen backdrop
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 500,
      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'flex-end',
      animation: 'fade-up 0.2s var(--ease-out-expo)',
    }}>
      {/* Sheet — stops click propagation */}
      <div onClick={e => e.stopPropagation()} style={{
        width: '100%', maxWidth: '480px', margin: '0 auto',
        background: 'var(--color-surface)',
        borderRadius: '20px 20px 0 0',
        border: '1px solid var(--color-border-light)',
        borderBottom: 'none',
        boxShadow: '0 -20px 60px rgba(0,0,0,0.5)',
        overflow: 'hidden',
        maxHeight: '85vh', display: 'flex', flexDirection: 'column',
      }}>
        {/* Handle + header */}
        <div style={{ padding: '12px 20px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
          <div style={{ width: '36px', height: '4px', borderRadius: '2px', background: 'var(--color-border-light)' }} />
          <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid var(--color-border)' }}>
            <div>
              <p style={{ fontSize: '16px', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>Select a Station</p>
              <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '2px' }}>8 FM stations · South West Zone</p>
            </div>
            <button onClick={onClose} style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', color: 'var(--color-text-muted)', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
          </div>
        </div>

        {/* Station list — scrollable */}
        <div style={{ overflowY: 'auto', flex: 1 }}>
          {stations.map(s => {
            const isActive  = activeStation?.id === s.id || activeStation?.slug === s.slug
            const isPlaying = isActive && playing
            return (
              <button key={s.slug} onClick={() => { play(s); onClose() }} style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: '14px',
                padding: '14px 20px',
                background: isActive ? `${s.color}12` : 'transparent',
                border: 'none', borderBottom: '1px solid var(--color-border)',
                cursor: 'pointer', textAlign: 'left', transition: 'background 0.15s',
              }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'var(--color-surface-2)' }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
              >
                {/* Freq badge */}
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${s.color}20`, border: `1px solid ${s.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {isPlaying
                    ? <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '18px' }}>
                        {[1,2,3].map(i => <div key={i} style={{ width: '3px', borderRadius: '2px', background: s.color, animation: `wave-bar 0.7s ease-in-out ${i*0.1}s infinite`, transformOrigin: 'bottom', height: `${[8,16,11][i-1]}px` }} />)}
                      </div>
                    : <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '12px', color: s.color }}>{s.frequency}</span>
                  }
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.name}</p>
                  <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '2px' }}>{s.tagline}</p>
                  <p style={{ fontSize: '11px', color: 'var(--color-text-dim)', marginTop: '1px' }}>📍 {s.location}</p>
                </div>

                {/* Status */}
                <div style={{ flexShrink: 0 }}>
                  {isActive
                    ? <span style={{ fontSize: '11px', fontWeight: 700, color: s.color, background: `${s.color}15`, padding: '4px 10px', borderRadius: '999px', border: `1px solid ${s.color}33` }}>{isPlaying ? 'On Air' : 'Paused'}</span>
                    : <span style={{ fontSize: '18px', color: 'var(--color-text-dim)' }}>▶</span>
                  }
                </div>
              </button>
            )
          })}
          {/* bottom safe area */}
          <div style={{ height: '24px' }} />
        </div>
      </div>
    </div>
  )
}

function NewsPanel() {
  const [articles, setArticles] = useState([])
  const [active, setActive]     = useState(0)

  useEffect(() => {
    supabase.from('articles')
      .select('id,title,slug,cover_image,category,published_at,created_at')
      .eq('published', true).order('published_at', { ascending: false }).limit(6)
      .then(({ data }) => setArticles(data || []))
  }, [])

  useEffect(() => {
    if (articles.length < 2) return
    const t = setInterval(() => setActive(a => (a + 1) % articles.length), 4000)
    return () => clearInterval(t)
  }, [articles.length])

  if (articles.length === 0) return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-surface)', borderRadius: '20px', border: '1px solid var(--color-border)', minHeight: '300px' }}>
      <div style={{ textAlign: 'center', opacity: 0.4 }}>
        <p style={{ fontSize: '32px', marginBottom: '8px' }}>📰</p>
        <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>News coming soon</p>
      </div>
    </div>
  )

  const article = articles[active]

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {/* Featured card */}
      <Link to={`/news/${article.slug}`} style={{
        display: 'block', borderRadius: '16px', overflow: 'hidden',
        border: '1px solid var(--color-border)', position: 'relative',
        height: '210px', transition: 'transform 0.3s var(--ease-out-expo)', flexShrink: 0,
      }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.01)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        <div style={{ position: 'absolute', inset: 0, background: article.cover_image ? 'none' : 'linear-gradient(135deg, var(--color-surface-2), var(--color-surface-3))' }}>
          {article.cover_image && <img src={article.cover_image} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.2) 55%, transparent 100%)' }} />
        </div>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px' }}>
          <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{article.category || 'News'}</span>
          <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '15px', color: '#fff', marginTop: '4px', lineHeight: 1.3 }}>{article.title}</p>
          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.55)', marginTop: '4px' }}>{timeAgo(article.published_at || article.created_at)}</p>
        </div>
      </Link>

      {/* Headline list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {articles.slice(0, 4).map((a, i) => (
          <button key={a.id} onClick={() => setActive(i)} style={{
            display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px',
            borderRadius: '10px', border: `1px solid ${active === i ? 'var(--color-border-light)' : 'transparent'}`,
            background: active === i ? 'var(--color-surface-2)' : 'transparent',
            cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left',
          }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: active === i ? 'var(--color-accent)' : 'var(--color-text-dim)', flexShrink: 0, transition: 'background 0.2s' }} />
            <p style={{ fontSize: '12px', color: active === i ? 'var(--color-text)' : 'var(--color-text-muted)', fontWeight: active === i ? 600 : 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.title}</p>
          </button>
        ))}
      </div>
    </div>
  )
}

export default function Hero() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <section style={{ position: 'relative', paddingTop: '68px', minHeight: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
      {/* Background */}
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse 70% 60% at 30% 50%, rgba(0,92,46,0.2) 0%, transparent 65%), radial-gradient(ellipse 50% 50% at 80% 30%, rgba(240,165,0,0.05) 0%, transparent 60%), var(--color-bg)` }} />
      <div style={{ position: 'absolute', inset: 0, opacity: 0.025, backgroundImage: `linear-gradient(var(--color-text) 1px, transparent 1px), linear-gradient(90deg, var(--color-text) 1px, transparent 1px)`, backgroundSize: '60px 60px' }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1280px', margin: '0 auto', padding: '48px 24px', width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'center' }}>

        {/* LEFT */}
        <div style={{ animation: 'fade-up 0.7s var(--ease-out-expo) both' }}>
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

          {/* CTAs */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button onClick={() => setModalOpen(true)} style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '13px 22px', borderRadius: '10px', fontSize: '14px', fontWeight: 700,
              background: 'var(--color-brand)', color: '#fff', border: 'none', cursor: 'pointer',
              transition: 'all 0.2s var(--ease-out-expo)',
              boxShadow: '0 0 20px rgba(0,92,46,0.3)',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-brand-light)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--color-brand)'; e.currentTarget.style.transform = 'none' }}
            >
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#4EFF8C', animation: 'pulse-live 1.4s infinite' }} />
              Listen Live
              <span style={{ fontSize: '11px' }}>▼</span>
            </button>

            <Link to="/news" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '13px 22px', borderRadius: '10px', fontSize: '14px', fontWeight: 600,
              background: 'transparent', color: 'var(--color-text)',
              border: '1px solid var(--color-border-light)',
              transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-surface-2)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.transform = 'none' }}
            >Latest News →</Link>
          </div>

          {/* Waveform */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '28px', marginTop: '36px' }}>
            {Array.from({ length: 18 }).map((_, i) => (
              <div key={i} style={{ width: '4px', borderRadius: '3px', background: `linear-gradient(to top, var(--color-brand-light), var(--color-accent))`, animation: `wave-bar ${0.7 + (i % 4) * 0.15}s ease-in-out ${i * 0.06}s infinite`, transformOrigin: 'bottom', height: `${12 + Math.floor(Math.sin(i * 0.8) * 10 + 10)}px`, opacity: 0.45 }} />
            ))}
          </div>
        </div>

        {/* RIGHT — News */}
        <div style={{ animation: 'fade-up 0.7s var(--ease-out-expo) 0.15s both' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-live)', animation: 'pulse-live 1.4s infinite' }} />
              <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-dim)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Latest Headlines</p>
            </div>
            <Link to="/news" style={{ fontSize: '12px', color: 'var(--color-accent)', fontWeight: 600 }}>See all →</Link>
          </div>
          <NewsPanel />
        </div>
      </div>

      {/* Station picker modal */}
      {modalOpen && <ListenModal onClose={() => setModalOpen(false)} />}

      <style>{`
        @media (max-width: 900px) {
          section > div[style*="grid-template-columns"] {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
            padding: 32px 20px 48px !important;
            min-height: unset !important;
          }
        }
      `}</style>
    </section>
  )
}
