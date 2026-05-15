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
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--surface-0)',
      padding: 24,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Ambient */}
      <div style={{
        position: 'absolute',
        top: '15%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 600,
        height: 400,
        background: 'radial-gradient(ellipse at center, rgba(79,110,247,0.07) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div
        className="animate-fade-up"
        style={{ width: '100%', maxWidth: 400, position: 'relative' }}
      >
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: 13,
            background: 'linear-gradient(135deg, var(--brand), #7c8ff8)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 24px var(--brand-glow)',
            marginBottom: 20,
          }}>
            <svg width="20" height="20" viewBox="0 0 13 13" fill="none">
              <rect x="1" y="1" width="4.5" height="4.5" rx="1" fill="white" />
              <rect x="7.5" y="1" width="4.5" height="4.5" rx="1" fill="white" opacity="0.5" />
              <rect x="1" y="7.5" width="4.5" height="4.5" rx="1" fill="white" opacity="0.5" />
              <rect x="7.5" y="7.5" width="4.5" height="4.5" rx="1" fill="white" />
            </svg>
          </div>
          <h1 style={{
            fontSize: 22,
            fontWeight: 600,
            letterSpacing: '-0.04em',
            color: 'var(--text-0)',
            marginBottom: 8,
          }}>
            Create your account
          </h1>
          <p style={{ fontSize: 14, color: 'var(--text-2)' }}>
            Start managing projects with your team
          </p>
        </div>

        <div style={{
          background: 'var(--surface-1)',
          border: '1px solid var(--border-1)',
          borderRadius: 'var(--r-xl)',
          padding: 28,
          boxShadow: 'var(--shadow-lg)',
        }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
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
              <label>Email address</label>
              <input
                type="email"
                value={form.email}
                onChange={set('email')}
                placeholder="jane@company.com"
                required
              />
            </div>

            <div className="field">
              <label>Password</label>
              <input
                type="password"
                value={form.password}
                onChange={set('password')}
                placeholder="At least 6 characters"
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ marginTop: 4, padding: '11px 20px', fontSize: 14 }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className="spinner" style={{ width: 14, height: 14, borderWidth: 1.5 }} />
                  Creating account...
                </span>
              ) : 'Get started →'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--text-2)' }}>
          Already have an account?{' '}
          <Link
            to="/login"
            style={{ color: 'var(--brand)', fontWeight: 500, transition: 'opacity 150ms' }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.75'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;