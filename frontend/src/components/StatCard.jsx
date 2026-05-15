// ── StatCard.jsx ──────────────────────────────────────────────
export const StatCard = ({ label, value, sub, accent = 'var(--text-1)' }) => (
  <div style={{
    background: 'var(--surface-1)',
    border: '1px solid var(--border-0)',
    borderRadius: 'var(--r-lg)',
    padding: '18px 20px',
    position: 'relative',
    overflow: 'hidden',
    transition: 'border-color 200ms',
  }}
    onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-1)'}
    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-0)'}
  >
    {/* Accent line */}
    <div style={{
      position: 'absolute',
      top: 0, left: 0, right: 0,
      height: 2,
      background: accent,
      opacity: 0.7,
    }} />

    <p style={{
      fontSize: 11,
      fontWeight: 500,
      color: 'var(--text-2)',
      letterSpacing: '0.04em',
      textTransform: 'uppercase',
      marginBottom: 10,
    }}>
      {label}
    </p>
    <p style={{
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: 28,
      fontWeight: 500,
      color: accent,
      lineHeight: 1,
      letterSpacing: '-0.03em',
      marginBottom: sub ? 8 : 0,
    }}>
      {value}
    </p>
    {sub && (
      <p style={{ fontSize: 12, color: 'var(--text-2)' }}>{sub}</p>
    )}
  </div>
);

export default StatCard;