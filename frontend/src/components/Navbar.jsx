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
    <>
      {/* CSS Keyframes for Shiny Button Animation */}
      <style>
        {`
          @keyframes shine {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          .shining-btn {
            position: relative;
            overflow: hidden;
            transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .shining-btn::after {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(
              90deg,
              transparent,
              rgba(255, 255, 255, 0.4),
              transparent
            );
            transition: none;
          }
          .shining-btn:hover::after {
            animation: shine 0.75s ease-in-out;
          }
          .shining-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(15, 23, 42, 0.15);
          }
        `}
      </style>

      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(255, 255, 255, 0.75)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.8)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
      }}>
        <nav style={{
          maxWidth: 1180,
          margin: '0 auto',
          padding: '0 24px',
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          {/* Wordmark with Animated Glow Icon */}
          <Link to="/projects" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(99, 102, 241, 0.4)',
              transition: 'transform 0.2s ease',
            }}>
              <svg width="15" height="15" viewBox="0 0 13 13" fill="none">
                <rect x="1" y="1" width="4.5" height="4.5" rx="1" fill="white" />
                <rect x="7.5" y="1" width="4.5" height="4.5" rx="1" fill="white" opacity="0.5" />
                <rect x="1" y="7.5" width="4.5" height="4.5" rx="1" fill="white" opacity="0.5" />
                <rect x="7.5" y="7.5" width="4.5" height="4.5" rx="1" fill="white" />
              </svg>
            </div>
            <span style={{
              fontSize: 16,
              fontWeight: 800,
              color: '#0f172a',
              letterSpacing: '-0.03em',
              fontFamily: 'system-ui, -apple-system, sans-serif',
            }}>
              TaskFlow
            </span>
          </Link>

          {user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {/* Frosted User Info Badge */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '6px 14px 6px 6px',
                borderRadius: 9999,
                background: 'rgba(255, 255, 255, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.9)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
              }}>
                <div style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 11,
                  fontWeight: 700,
                  color: '#fff',
                  letterSpacing: '0.02em',
                  flexShrink: 0,
                  boxShadow: '0 2px 6px rgba(99, 102, 241, 0.3)',
                }}>
                  {initials}
                </div>
                <span style={{
                  fontSize: 13,
                  color: '#1e293b',
                  fontWeight: 600,
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                }}>
                  {user.name.split(' ')[0]}
                </span>
              </div>

              {/* Shiny Animated Sign Out Button */}
              <button
                onClick={handleLogout}
                className="shining-btn"
                style={{
                  padding: '8px 18px',
                  borderRadius: 14,
                  background: 'linear-gradient(135deg, #0f172a 0%, #334155 100%)',
                  color: '#ffffff',
                  border: 'none',
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  boxShadow: '0 4px 12px rgba(15, 23, 42, 0.1)',
                }}
              >
                Sign out
              </button>
            </div>
          )}
        </nav>
      </header>
    </>
  );
};

export default Navbar;