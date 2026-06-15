export function Skeleton({ width='100%', height='20px', radius='6px', style={} }) {
  return <div className="skeleton" style={{ width, height, borderRadius:radius, flexShrink:0, ...style }} />
}

export function ArticleCardSkeleton() {
  return (
    <div style={{ background:'var(--color-surface)', borderRadius:'12px', overflow:'hidden', border:'1px solid var(--color-border)' }}>
      <Skeleton height="200px" radius="0" />
      <div style={{ padding:'20px', display:'flex', flexDirection:'column', gap:'10px' }}>
        <Skeleton width="60px" height="20px" />
        <Skeleton height="22px" />
        <Skeleton height="22px" width="80%" />
        <Skeleton height="14px" />
        <Skeleton height="14px" width="70%" />
      </div>
    </div>
  )
}

export function StationCardSkeleton() {
  return (
    <div style={{ background:'var(--color-surface)', borderRadius:'16px', padding:'24px', border:'1px solid var(--color-border)' }}>
      <Skeleton width="48px" height="48px" radius="12px" style={{ marginBottom:'16px' }} />
      <Skeleton height="22px" width="70%" style={{ marginBottom:'8px' }} />
      <Skeleton height="14px" width="50%" />
    </div>
  )
}
