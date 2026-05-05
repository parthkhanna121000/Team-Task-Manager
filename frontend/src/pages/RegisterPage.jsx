import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const set = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/projects');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
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
      <div style={{ width: 4, background: 'var(--amber)', flexShrink: 0 }} />

      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px',
      }}>
        <div style={{ width: '100%', maxWidth: 360 }}>
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
            }}>
              Create account
            </h1>
            <p style={{ color: 'var(--txt-3)', fontSize: 13, marginTop: 6 }}>
              Join Team Task Manager and start collaborating.
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="field">
              <label>Full name</label>
              <input
                type="text"
                value={form.name}
                onChange={set('name')}
                placeholder="Jane Smith"
                required
                autoFocus
              />
            </div>

            <div className="field">
              <label>Email</label>
              <input
                type="email"
                value={form.email}
                onChange={set('email')}
                placeholder="jane@example.com"
                required
              />
            </div>

            <div className="field">
              <label>Password</label>
              <input
                type="password"
                value={form.password}
                onChange={set('password')}
                placeholder="min. 6 characters"
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-amber"
              disabled={loading}
              style={{ marginTop: 6, justifyContent: 'center', padding: '11px 20px', fontSize: 14 }}
            >
              {loading ? 'Creating...' : 'Get started →'}
            </button>
          </form>

          <p style={{ marginTop: 24, color: 'var(--txt-3)', fontSize: 13 }}>
            Already have an account?{' '}
            <Link
              to="/login"
              style={{
                color: 'var(--amber-text)',
                fontFamily: 'IBM Plex Mono, monospace',
                fontSize: 12,
              }}
            >
              sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;