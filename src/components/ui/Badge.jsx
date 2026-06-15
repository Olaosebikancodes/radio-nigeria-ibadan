const CATEGORY_COLORS = {
  politics:'#C0392B', sports:'#2980B9', entertainment:'#8E44AD',
  health:'#27AE60', agriculture:'#F39C12', education:'#16A085', general:'#555',
}

export function Badge({ label, category }) {
  return (
    <span style={{
      display:'inline-block', padding:'3px 10px', borderRadius:'999px',
      fontSize:'10px', fontWeight:600, letterSpacing:'0.06em', textTransform:'uppercase',
      background: category ? `${CATEGORY_COLORS[category] ?? '#555'}22` : 'var(--color-surface-2)',
      color: category ? (CATEGORY_COLORS[category] ?? '#aaa') : 'var(--color-text-muted)',
      border:`1px solid ${category ? `${CATEGORY_COLORS[category] ?? '#555'}44` : 'var(--color-border)'}`,
    }}>
      {label}
    </span>
  )
}

export function LiveBadge() {
  return (
    <span style={{
      display:'inline-flex', alignItems:'center', gap:'5px',
      padding:'3px 10px', borderRadius:'999px', fontSize:'10px', fontWeight:700,
      letterSpacing:'0.08em', textTransform:'uppercase',
      background:'rgba(255,59,48,0.15)', color:'var(--color-live)',
      border:'1px solid rgba(255,59,48,0.3)',
    }}>
      <span style={{ width:'5px', height:'5px', borderRadius:'50%', background:'var(--color-live)', animation:'pulse-live 1.4s ease-in-out infinite' }} />
      On Air
    </span>
  )
}
