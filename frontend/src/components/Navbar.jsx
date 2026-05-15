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
        {/* Wordmark */}
        <Link to="/projects" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 26,
            height: 26,
            borderRadius: 7,
            background: 'linear-gradient(135deg, var(--brand), #7c8ff8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 12px var(--brand-glow)',
          }}>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <rect x="1" y="1" width="4.5" height="4.5" rx="1" fill="white" />
              <rect x="7.5" y="1" width="4.5" height="4.5" rx="1" fill="white" opacity="0.5" />
              <rect x="1" y="7.5" width="4.5" height="4.5" rx="1" fill="white" opacity="0.5" />
              <rect x="7.5" y="7.5" width="4.5" height="4.5" rx="1" fill="white" />
            </svg>
          </div>
          <span style={{
            fontSize: 14,
            fontWeight: 600,
            color: 'var(--text-0)',
            letterSpacing: '-0.03em',
          }}>
            TaskFlow
          </span>
        </Link>

        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* User info */}
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
                background: 'linear-gradient(135deg, var(--brand), #7c8ff8)',
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