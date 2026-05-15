import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="glass" style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      borderBottom: '1px solid var(--border-0)',
      borderTop: 'none',
      borderLeft: 'none',
      borderRight: 'none',
    }}>
      <nav style={{
        maxWidth: 1180,
        margin: '0 auto',
        padding: '0 24px',
        height: 56,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>

        {/* ── Logo + Wordmark ── */}
        <Link to="/projects" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>

          {/* Icon mark */}
          <div style={{
            width: 30,
            height: 30,
            borderRadius: 8,
            background: '#3C3489',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
              {/* Top-left: completed task */}
              <rect x="1" y="1" width="6" height="6" rx="1.5" fill="#AFA9EC"/>
              <path d="M2.5 4.5l1.5 1.5L7 3" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              {/* Top-right: in-progress task */}
              <rect x="9" y="1" width="6" height="6" rx="1.5" fill="none" stroke="#AFA9EC" strokeWidth="1"/>
              <rect x="10" y="3" width="4" height="1.5" rx="0.75" fill="#AFA9EC"/>
              <rect x="10" y="5" width="2.5" height="1.5" rx="0.75" fill="#AFA9EC" opacity="0.5"/>
              {/* Bottom-left: in-progress task */}
              <rect x="1" y="9" width="6" height="6" rx="1.5" fill="none" stroke="#AFA9EC" strokeWidth="1"/>
              <rect x="2" y="11" width="4" height="1.5" rx="0.75" fill="#AFA9EC"/>
              <rect x="2" y="13" width="2.5" height="1.5" rx="0.75" fill="#AFA9EC" opacity="0.5"/>
              {/* Bottom-right: team dots */}
              <rect x="9" y="9" width="6" height="6" rx="1.5" fill="#534AB7" opacity="0.7"/>
              <circle cx="11.2" cy="12" r="1.4" fill="#EEEDFE"/>
              <circle cx="13.8" cy="12" r="1.4" fill="#EEEDFE"/>
            </svg>
          </div>

          {/* Two-line wordmark */}
          <div style={{ lineHeight: 1, userSelect: 'none' }}>
            <span style={{
              fontSize: 13,
              fontWeight: 600,
              color: 'var(--text-0)',
              letterSpacing: '-0.03em',
              display: 'block',
            }}>
              Team Task
            </span>
            <span style={{
              fontSize: 10,
              fontWeight: 500,
              color: '#7F77DD',
              letterSpacing: '-0.01em',
              display: 'block',
              marginTop: 1,
            }}>
              Manager
            </span>
          </div>
        </Link>

        {/* ── User area ── */}
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>

            {/* User pill */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 9,
              padding: '5px 12px 5px 6px',
              borderRadius: 100,
              background: 'var(--surface-3)',
              border: '1px solid var(--border-1)',
            }}>
              <div style={{
                width: 26,
                height: 26,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #534AB7, #7F77DD)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 10,
                fontWeight: 700,
                color: '#fff',
                letterSpacing: '0.02em',
                flexShrink: 0,
              }}>
                {initials}
              </div>
              <span style={{
                fontSize: 13,
                color: 'var(--text-1)',
                fontWeight: 500,
              }}>
                {user.name.split(' ')[0]}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="btn btn-ghost btn-sm"
              style={{ fontSize: 12.5 }}
            >
              Sign out
            </button>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;