import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'CN';

  return (
    <>
      <style>
        {`
          @keyframes sheenSweep {
            0% { left: -120%; }
            100% { left: 180%; }
          }

          .cyber-navbar {
            position: sticky;
            top: 0;
            z-index: 100;
            background: rgba(0, 0, 0, 0.85);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border-bottom: 1px solid #1e293b;
            width: 100%;
            font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'SF Pro Display', Roboto, sans-serif;
          }

          .cyber-nav-container {
            max-width: 1240px;
            margin: 0 auto;
            padding: 0 24px;
            height: 64px;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }

          .brand-logo-badge {
            width: 30px;
            height: 30px;
            border-radius: 8px;
            background: linear-gradient(135deg, #38bdf8 0%, #10b981 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #000000;
            font-weight: 900;
            font-size: 15px;
            box-shadow: 0 0 16px rgba(56, 189, 248, 0.4);
            transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease;
          }

          .brand-logo-badge:hover {
            transform: scale(1.05);
            box-shadow: 0 0 22px rgba(16, 185, 129, 0.5);
          }

          .user-badge-container {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 4px 14px 4px 5px;
            border-radius: 9999px;
            background: #09090b;
            border: 1px solid #1e293b;
            transition: border-color 0.2s ease, transform 0.2s ease;
            cursor: pointer;
            user-select: none;
          }

          .user-badge-container:hover {
            border-color: #38bdf8;
            transform: translateY(-1px);
          }

          .btn-nav-logout {
            position: relative;
            overflow: hidden;
            padding: 8px 16px;
            border-radius: 10px;
            background: rgba(244, 63, 94, 0.1);
            color: #f43f5e;
            border: 1px solid rgba(244, 63, 94, 0.3);
            font-size: 12px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.2s ease;
            display: inline-flex;
            align-items: center;
            gap: 6px;
          }

          .btn-nav-logout::after {
            content: '';
            position: absolute;
            top: 0;
            left: -120%;
            width: 80%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
            transform: skewX(-20deg);
          }

          .btn-nav-logout:hover::after {
            animation: sheenSweep 0.75s cubic-bezier(0.16, 1, 0.3, 1);
          }

          .btn-nav-logout:hover {
            background: #f43f5e;
            color: #ffffff;
            border-color: #f43f5e;
            box-shadow: 0 4px 14px rgba(244, 63, 94, 0.35);
            transform: translateY(-1px);
          }

          .btn-nav-logout:active {
            transform: translateY(1px);
          }

          .cyber-dropdown {
            position: absolute;
            top: calc(100% + 8px);
            right: 0;
            width: 230px;
            background: #09090b;
            border: 1px solid #1e293b;
            border-radius: 16px;
            padding: 12px;
            box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.95);
            z-index: 150;
            display: flex;
            flex-direction: column;
            gap: 6px;
            animation: dropdownFade 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }

          @keyframes dropdownFade {
            from { opacity: 0; transform: translateY(-6px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>

      <header className="cyber-navbar">
        {/* Dynamic Multi-Color Ambient Glow Ribbon */}
        <div
          style={{
            height: '2px',
            width: '100%',
            background: 'linear-gradient(90deg, #f43f5e 0%, #38bdf8 35%, #f59e0b 70%, #10b981 100%)',
          }}
        />

        <nav className="cyber-nav-container">
          {/* Brand Wordmark */}
          <Link
            to="/projects"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              textDecoration: 'none',
            }}
          >
            <div className="brand-logo-badge">C</div>
            <span
              style={{
                fontSize: 18,
                fontWeight: 800,
                color: '#ffffff',
                letterSpacing: '-0.03em',
              }}
            >
              Collab<span style={{ color: '#38bdf8' }}>Nex</span>
            </span>
            <span
              style={{
                fontSize: '10px',
                fontWeight: '800',
                color: '#10b981',
                background: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                padding: '2px 8px',
                borderRadius: '6px',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}
            >
              Live
            </span>
          </Link>

          {/* User Controls & Navigation */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, position: 'relative' }}>
              {/* User Avatar Capsule */}
              <div
                className="user-badge-container"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="User navigation menu"
              >
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 11,
                    fontWeight: 800,
                    color: '#ffffff',
                    boxShadow: '0 2px 8px rgba(56, 189, 248, 0.35)',
                    flexShrink: 0,
                  }}
                >
                  {initials}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: '#f8fafc',
                      lineHeight: 1.2,
                    }}
                  >
                    {user.name.split(' ')[0]}
                  </span>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      color: '#64748b',
                      lineHeight: 1,
                    }}
                  >
                    Workspace Admin
                  </span>
                </div>
                <span
                  style={{
                    fontSize: 10,
                    color: '#94a3b8',
                    marginLeft: 2,
                    transform: menuOpen ? 'rotate(180deg)' : 'none',
                    transition: 'transform 0.2s ease',
                  }}
                >
                  ▼
                </span>
              </div>

              {/* User Menu Dropdown */}
              {menuOpen && (
                <div className="cyber-dropdown">
                  <div
                    style={{
                      padding: '8px 10px 10px',
                      borderBottom: '1px solid #1e293b',
                      marginBottom: 4,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: '#ededed',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {user.name}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: '#64748b',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {user.email}
                    </div>
                  </div>

                  <Link
                    to="/projects"
                    onClick={() => setMenuOpen(false)}
                    style={{
                      padding: '8px 10px',
                      borderRadius: 8,
                      color: '#94a3b8',
                      textDecoration: 'none',
                      fontSize: 12,
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#38bdf8';
                      e.currentTarget.style.background = 'rgba(56, 189, 248, 0.08)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#94a3b8';
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <span>📁</span>
                    <span>All Workspaces</span>
                  </Link>

                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      handleLogout();
                    }}
                    style={{
                      padding: '8px 10px',
                      borderRadius: 8,
                      background: 'transparent',
                      border: 'none',
                      color: '#f43f5e',
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      textAlign: 'left',
                      transition: 'background 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(244, 63, 94, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <span>🚪</span>
                    <span>Sign Out</span>
                  </button>
                </div>
              )}

              {/* Direct Sign Out Pill */}
              <button onClick={handleLogout} className="btn-nav-logout">
                <span>Sign out</span>
                <span style={{ fontSize: 13, lineHeight: 1 }}>→</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Link
                to="/login"
                style={{
                  color: '#94a3b8',
                  fontSize: 13,
                  fontWeight: 600,
                  textDecoration: 'none',
                  padding: '8px 14px',
                  transition: 'color 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
              >
                Log in
              </Link>
              <Link
                to="/register"
                style={{
                  padding: '8px 18px',
                  borderRadius: 10,
                  background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)',
                  color: '#000000',
                  fontSize: 13,
                  fontWeight: 800,
                  textDecoration: 'none',
                  boxShadow: '0 4px 14px rgba(56, 189, 248, 0.35)',
                }}
              >
                Sign up
              </Link>
            </div>
          )}
        </nav>
      </header>
    </>
  );
};

export default Navbar;