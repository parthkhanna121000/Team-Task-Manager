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
    <header style={{
      background: 'var(--bg-2)',
      borderBottom: '1px solid var(--border)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}>
      <nav style={{
        maxWidth: 1160,
        margin: '0 auto',
        padding: '0 20px',
        height: 52,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Logo — text only, styled like a dev's personal project */}
        <Link to="/projects" style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
          <span style={{
            fontFamily: 'IBM Plex Mono, monospace',
            fontSize: 15,
            fontWeight: 500,
            color: 'var(--amber-text)',
            letterSpacing: '-0.02em',
          }}>
            ttm
          </span>
          <span style={{
            fontFamily: 'IBM Plex Mono, monospace',
            fontSize: 15,
            fontWeight: 400,
            color: 'var(--txt-3)',
            marginLeft: 2,
          }}>
            /
          </span>
          <span style={{
            fontFamily: 'IBM Plex Sans, sans-serif',
            fontSize: 13,
            fontWeight: 400,
            color: 'var(--txt-2)',
            marginLeft: 6,
            letterSpacing: 0,
          }}>
            Team Task Manager
          </span>
        </Link>

        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: 'var(--amber-dim)',
                border: '1px solid rgba(217,119,6,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 11,
                fontWeight: 600,
                color: 'var(--amber-text)',
                fontFamily: 'IBM Plex Mono, monospace',
              }}>
                {initials}
              </div>
              <span style={{
                color: 'var(--txt-2)',
                fontSize: 13,
                fontFamily: 'IBM Plex Sans, sans-serif',
              }}>
                {user.name}
              </span>
            </div>

            <div style={{ width: 1, height: 16, background: 'var(--border-2)' }} />

            <button
              onClick={handleLogout}
              style={{
                fontSize: 12,
                color: 'var(--txt-3)',
                fontFamily: 'IBM Plex Mono, monospace',
                padding: '4px 0',
                transition: 'color 120ms',
              }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--txt)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--txt-3)'}
            >
              sign out
            </button>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;