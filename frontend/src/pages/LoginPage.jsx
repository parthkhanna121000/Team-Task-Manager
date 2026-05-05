import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const set = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/projects');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      background: 'var(--bg)',
    }}>
      {/* Left strip */}
      <div style={{
        width: 4,
        background: 'var(--amber)',
        flexShrink: 0,
      }} />

      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px',
      }}>
        <div style={{ width: '100%', maxWidth: 360 }}>
          {/* Header */}
          <div style={{ marginBottom: 36 }}>
            <p style={{
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: 11,
              color: 'var(--amber-text)',
              letterSpacing: '0.1em',
              marginBottom: 10,
              textTransform: 'uppercase',
            }}>
              ttm / auth
            </p>
            <h1 style={{
              fontSize: 24,
              fontWeight: 600,
              color: 'var(--txt)',
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
            }}>
              Sign in
            </h1>
            <p style={{ color: 'var(--txt-3)', fontSize: 13, marginTop: 6 }}>
              Welcome back. Enter your credentials to continue.
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="field">
              <label>Email</label>
              <input
                type="email"
                value={form.email}
                onChange={set('email')}
                placeholder="you@example.com"
                required
                autoFocus
              />
            </div>

            <div className="field">
              <label>Password</label>
              <input
                type="password"
                value={form.password}
                onChange={set('password')}
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-amber"
              disabled={loading}
              style={{ marginTop: 6, justifyContent: 'center', padding: '11px 20px', fontSize: 14 }}
            >
              {loading ? 'Signing in...' : 'Sign in →'}
            </button>
          </form>

          <p style={{ marginTop: 24, color: 'var(--txt-3)', fontSize: 13 }}>
            No account?{' '}
            <Link
              to="/register"
              style={{
                color: 'var(--amber-text)',
                fontFamily: 'IBM Plex Mono, monospace',
                fontSize: 12,
              }}
            >
              register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;