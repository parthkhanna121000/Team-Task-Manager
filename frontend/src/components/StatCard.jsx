import React from 'react';

const StatCard = ({ label, value, sub, accent = '#38bdf8' }) => {
  const effectiveAccent =
    accent === '#0f172a' || accent === '#f8fafc' || accent === '#ffffff'
      ? '#ededed'
      : accent;

  // Detect trend context for dynamic accent coloring
  const isPositive = typeof sub === 'string' && (sub.includes('+') || sub.includes('↑') || sub.toLowerCase().includes('ahead'));
  const isNegative = typeof sub === 'string' && (sub.includes('-') || sub.includes('↓') || sub.toLowerCase().includes('behind') || sub.toLowerCase().includes('overdue'));
  
  const subAccent = isPositive ? '#10b981' : isNegative ? '#f43f5e' : effectiveAccent;

  return (
    <div
      className="cyber-stat-card"
      style={{
        '--accent-color': effectiveAccent,
        background: '#09090b',
        border: '1px solid #1e293b',
        borderRadius: '18px',
        padding: '22px 24px',
        position: 'relative',
        overflow: 'hidden',
        boxSizing: 'border-box',
        cursor: 'default',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', 'SF Pro Display', Roboto, sans-serif",
      }}
    >
      <style>{`
        .cyber-stat-card {
          transition: transform 0.22s cubic-bezier(0.16, 1, 0.3, 1),
                      border-color 0.22s ease,
                      box-shadow 0.22s ease;
        }

        .cyber-stat-card:hover {
          transform: translateY(-3px);
          border-color: var(--accent-color) !important;
          box-shadow: 0 16px 36px -12px rgba(0, 0, 0, 0.9),
                      0 0 24px color-mix(in srgb, var(--accent-color) 20%, transparent);
        }

        .cyber-stat-card:hover .stat-top-line {
          opacity: 1;
        }
      `}</style>

      {/* Top Accent Line Highlight on Hover */}
      <div
        className="stat-top-line"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: `linear-gradient(90deg, ${effectiveAccent} 0%, transparent 80%)`,
          opacity: 0.4,
          transition: 'opacity 0.22s ease',
        }}
      />

      {/* Top Ambient Glow Gradient */}
      <div
        style={{
          position: 'absolute',
          top: '-35%',
          right: '-20%',
          width: '130px',
          height: '130px',
          background: `radial-gradient(circle, ${effectiveAccent}1f 0%, transparent 70%)`,
          pointerEvents: 'none',
          borderRadius: '50%',
        }}
      />

      {/* Header & Indicator */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '14px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <span
          style={{
            fontSize: '11px',
            fontWeight: '800',
            color: '#71717a',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          {label}
        </span>
        <span
          style={{
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            backgroundColor: effectiveAccent,
            boxShadow: `0 0 10px ${effectiveAccent}`,
            flexShrink: 0,
          }}
        />
      </div>

      {/* Main Numeric Metric */}
      <div
        style={{
          fontSize: '34px',
          fontWeight: '900',
          color: '#ffffff',
          lineHeight: 1.1,
          letterSpacing: '-0.03em',
          marginBottom: sub ? '10px' : '0',
          fontVariantNumeric: 'tabular-nums',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {value}
      </div>

      {/* Subtitle / Telemetry Detail */}
      {sub && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '12px',
            color: '#94a3b8',
            fontWeight: '600',
            lineHeight: 1.4,
            position: 'relative',
            zIndex: 1,
          }}
        >
          <span style={{ color: subAccent, fontSize: '10px' }}>●</span>
          <span style={{ color: isPositive || isNegative ? subAccent : '#94a3b8' }}>
            {sub}
          </span>
        </div>
      )}
    </div>
  );
};

export default StatCard;