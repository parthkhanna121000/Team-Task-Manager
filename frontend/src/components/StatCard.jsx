const StatCard = ({ label, value, sub, accent = '#0f172a' }) => (
  <div
    style={{
      background: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.9)',
      borderRadius: '20px',
      padding: '20px 24px',
      borderLeft: `4px solid ${accent}`,
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.03)',
      transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
      cursor: 'default',
      boxSizing: 'border-box',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-3px)';
      e.currentTarget.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.06)';
      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.95)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.03)';
      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.8)';
    }}
  >
    <p style={{
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontSize: '11px',
      fontWeight: '700',
      color: '#64748b',
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      marginBottom: 10,
    }}>
      {label}
    </p>
    <p style={{
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontSize: '32px',
      fontWeight: '800',
      color: accent,
      lineHeight: 1,
      marginBottom: sub ? 8 : 0,
      letterSpacing: '-0.03em',
    }}>
      {value}
    </p>
    {sub && (
      <p style={{
        fontSize: '12px',
        color: '#64748b',
        fontWeight: '600',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        margin: 0,
      }}>
        {sub}
      </p>
    )}
  </div>
);

export default StatCard;