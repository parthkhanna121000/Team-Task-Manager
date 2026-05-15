const StatCard = ({ label, value, sub, accent = 'var(--txt-2)' }) => (
  <div style={{
    background: 'var(--bg-2)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding: '16px 18px',
    borderLeft: `3px solid ${accent}`,
  }}>
    <p style={{
      fontFamily: 'IBM Plex Mono, monospace',
      fontSize: 10,
      color: 'var(--txt-3)',
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      marginBottom: 8,
    }}>
      {label}
    </p>
    <p style={{
      fontFamily: 'IBM Plex Mono, monospace',
      fontSize: 30,
      fontWeight: 500,
      color: accent,
      lineHeight: 1,
      marginBottom: sub ? 6 : 0,
    }}>
      {value}
    </p>
    {sub && (
      <p style={{
        fontSize: 11,
        color: 'var(--txt-3)',
        fontFamily: 'IBM Plex Mono, monospace',
      }}>
        {sub}
      </p>
    )}
  </div>
);

export default StatCard;