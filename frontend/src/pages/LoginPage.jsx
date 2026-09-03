import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
      navigate('/projects');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cyber-auth-container">
      <style>{`
        html, body, #root {
          margin: 0 !important;
          padding: 0 !important;
          width: 100% !important;
          min-height: 100% !important;
          background-color: #000000 !important;
          box-sizing: border-box;
        }

        *, *::before, *::after {
          box-sizing: inherit;
        }

        @keyframes sheenSweep {
          0% { left: -120%; }
          100% { left: 180%; }
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .cyber-auth-container {
          min-height: 100vh;
          width: 100vw;
          margin: 0;
          padding: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #000000;
          background-image: 
            radial-gradient(circle at 15% 15%, rgba(56, 189, 248, 0.09) 0%, transparent 45%),
            radial-gradient(circle at 85% 20%, rgba(245, 158, 11, 0.08) 0%, transparent 45%),
            radial-gradient(circle at 50% 80%, rgba(244, 63, 94, 0.07) 0%, transparent 50%),
            linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
          background-size: 100% 100%, 100% 100%, 100% 100%, 48px 48px, 48px 48px;
          font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'SF Pro Display', Roboto, sans-serif;
          position: relative;
          overflow-x: hidden;
          color: #ededed;
        }

        .auth-card-cyber {
          width: 100%;
          max-width: 980px;
          background: #09090b;
          border: 1px solid #1e293b;
          border-radius: 24px;
          box-shadow: 0 30px 60px -15px rgba(0, 0, 0, 0.95), 0 0 35px rgba(56, 189, 248, 0.06);
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          overflow: hidden;
          position: relative;
          z-index: 1;
        }

        @media (max-width: 860px) {
          .cyber-auth-container {
            padding: 16px;
          }
          .auth-card-cyber {
            grid-template-columns: 1fr;
            max-width: 460px;
          }
          .auth-showcase-panel {
            display: none !important;
          }
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-field {
          width: 100%;
          padding: 13px 16px 13px 42px;
          background: #000000;
          border: 1px solid #27272a;
          border-radius: 12px;
          font-size: 14px;
          color: #ededed;
          outline: none;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          box-sizing: border-box;
        }

        .input-field:focus {
          border-color: #38bdf8;
          box-shadow: 0 0 0 1px #38bdf8, 0 8px 18px rgba(56, 189, 248, 0.18);
        }

        .input-field::placeholder {
          color: #52525b;
        }

        .input-icon {
          position: absolute;
          left: 14px;
          color: #52525b;
          display: flex;
          align-items: center;
          pointer-events: none;
          transition: color 0.2s ease;
        }

        .input-wrapper:focus-within .input-icon {
          color: #38bdf8;
        }

        .btn-auth-primary {
          position: relative;
          overflow: hidden;
          width: 100%;
          padding: 13px;
          background: linear-gradient(135deg, #38bdf8 0%, #0284c7 100%);
          color: #000000;
          border: none;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 800;
          cursor: pointer;
          transition: transform 0.18s ease, box-shadow 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          box-shadow: 0 4px 18px rgba(56, 189, 248, 0.35);
        }

        .btn-auth-primary::after {
          content: '';
          position: absolute;
          top: 0;
          left: -120%;
          width: 80%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent);
          transform: skewX(-20deg);
        }

        .btn-auth-primary:hover:not(:disabled)::after {
          animation: sheenSweep 0.75s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .btn-auth-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(56, 189, 248, 0.45);
        }

        .btn-auth-primary:active:not(:disabled) {
          transform: translateY(1px) scale(0.99);
        }

        .btn-auth-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .spinner {
          width: 15px;
          height: 15px;
          border: 2px solid rgba(0, 0, 0, 0.2);
          border-top-color: #000000;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }

        .interactive-auth-link {
          color: #38bdf8;
          text-decoration: none;
          transition: color 0.15s ease;
        }

        .interactive-auth-link:hover {
          color: #ffffff;
        }
      `}</style>

      <div className="auth-card-cyber">
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: 'linear-gradient(90deg, #f43f5e 0%, #38bdf8 35%, #f59e0b 70%, #10b981 100%)',
            zIndex: 2,
          }}
        />

        <div style={{ padding: '44px 38px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: 26 }}>
            <div style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              background: 'linear-gradient(135deg, #38bdf8 0%, #10b981 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#000000',
              fontWeight: 900,
              fontSize: 14,
              boxShadow: '0 0 14px rgba(56, 189, 248, 0.4)'
            }}>
              C
            </div>
            <span style={{ fontSize: 17, fontWeight: 800, letterSpacing: '-0.03em', color: '#ffffff' }}>
              Collab<span style={{ color: '#38bdf8' }}>Nex</span>
            </span>
          </Link>

          <div style={{ marginBottom: 24 }}>
            <h1 style={{ fontSize: 26, fontWeight: 900, color: '#ffffff', margin: '0 0 6px 0', letterSpacing: '-0.03em' }}>
              Welcome back
            </h1>
            <p style={{ fontSize: 13, color: '#94a3b8', margin: 0 }}>
              Authenticate with your workspace credentials.
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#71717a', marginBottom: 6 }}>
                Work Email
              </label>
              <div className="input-wrapper">
                <span className="input-icon">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </span>
                <input
                  type="email"
                  className="input-field"
                  value={form.email}
                  onChange={set('email')}
                  placeholder="developer@collabnex.io"
                  required
                  autoFocus
                />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#71717a' }}>
                  Password
                </label>
                <a
                  href="#forgot"
                  onClick={(e) => {
                    e.preventDefault();
                    toast.success('Password recovery sent if email exists.');
                  }}
                  className="interactive-auth-link"
                  style={{ fontSize: 12, fontWeight: 600 }}
                >
                  Forgot?
                </a>
              </div>
              <div className="input-wrapper">
                <span className="input-icon">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input-field"
                  value={form.password}
                  onChange={set('password')}
                  placeholder="••••••••••••"
                  required
                  style={{ paddingRight: 44 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  style={{
                    position: 'absolute',
                    right: 12,
                    background: 'none',
                    border: 'none',
                    color: '#71717a',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    padding: 4
                  }}
                >
                  {showPassword ? (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                      <line x1="2" x2="22" y1="2" y2="22" />
                    </svg>
                  ) : (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: '#94a3b8', userSelect: 'none' }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{
                    width: 15,
                    height: 15,
                    accentColor: '#38bdf8',
                    cursor: 'pointer'
                  }}
                />
                Remember me on this machine
              </label>
            </div>

            <button type="submit" disabled={loading} className="btn-auth-primary">
              {loading ? (
                <>
                  <div className="spinner" />
                  <span>Verifying session...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Workspace</span>
                  <span style={{ fontSize: 15 }}>→</span>
                </>
              )}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: 13, color: '#71717a', margin: '22px 0 0' }}>
            No account yet?{' '}
            <Link to="/register" className="interactive-auth-link" style={{ fontWeight: 700 }}>
              Create an account
            </Link>
          </p>
        </div>

        <div className="auth-showcase-panel" style={{
          background: 'linear-gradient(145deg, #09090b 0%, #0c121e 100%)',
          borderLeft: '1px solid #1e293b',
          padding: 36,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 7,
            padding: '4px 12px',
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: 9999,
            width: 'fit-content'
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              System Operational
            </span>
          </div>

          <div style={{
            background: '#09090b',
            border: '1px solid #1e293b',
            borderRadius: 16,
            padding: 20,
            boxShadow: '0 16px 36px -10px rgba(0, 0, 0, 0.8)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{
                fontSize: 10,
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: 4,
                background: 'rgba(244, 63, 94, 0.12)',
                border: '1px solid rgba(244, 63, 94, 0.3)',
                color: '#f43f5e',
                letterSpacing: '0.06em',
                textTransform: 'uppercase'
              }}>
                High Priority
              </span>
              <span style={{ fontSize: 11, color: '#f59e0b', fontWeight: 600 }}>⚡ In Progress</span>
            </div>
            <h4 style={{ margin: '0 0 6px', fontSize: 14, fontWeight: 700, color: '#ffffff' }}>
              Rotate JWT Security Secret
            </h4>
            <p style={{ margin: 0, fontSize: 12, color: '#94a3b8', lineHeight: 1.5 }}>
              Ensure workspace routes terminate invalid refresh tokens cleanly on sign-out.
            </p>

            <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid #18181b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #0284c7, #38bdf8)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 9,
                  fontWeight: 800,
                  color: '#ffffff'
                }}>
                  CN
                </div>
                <span style={{ fontSize: 11, color: '#cbd5e1', fontWeight: 600 }}>Lead Admin</span>
              </div>
              <span style={{ fontSize: 11, color: '#10b981', fontWeight: 700 }}>● On Track</span>
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: 16, fontWeight: 800, margin: '0 0 6px', color: '#ffffff', letterSpacing: '-0.02em' }}>
              Progress in Motion.
            </h3>
            <p style={{ fontSize: 12, color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>
              Cyber-Obsidian project orchestration engineered for high-velocity software teams.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;