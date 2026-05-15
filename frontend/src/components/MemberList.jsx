import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const MemberList = ({ project, role, onAddMember, onRemoveMember }) => {
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [adding, setAdding] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleAdd = async () => {
    if (!email.trim()) return;
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email.trim())) return toast.error('Invalid email address');
    setAdding(true);
    try {
      await onAddMember(email.trim());
      setEmail('');
      setShowForm(false);
      toast.success('Member added');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add member');
    } finally {
      setAdding(false);
    }
  };

  const handleRemove = async (memberId, memberName) => {
    if (!confirm(`Remove ${memberName} from this project?`)) return;
    try {
      await onRemoveMember(memberId);
      toast.success('Member removed');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove member');
    }
  };

  const initials = (name) =>
    name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div style={{ maxWidth: 560 }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
      }}>
        <p style={{ fontSize: 13, color: 'var(--text-2)' }}>
          {project.members.length} member{project.members.length !== 1 ? 's' : ''}
        </p>
        {role === 'admin' && (
          <button
            className="btn btn-primary btn-sm"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancel' : '+ Invite member'}
          </button>
        )}
      </div>

      {/* Invite form */}
      {showForm && (
        <div style={{
          background: 'var(--surface-2)',
          border: '1px solid var(--border-1)',
          borderRadius: 'var(--r-lg)',
          padding: '16px',
          marginBottom: 16,
        }}>
          <p style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 10 }}>
            Enter the email address of an existing user to invite them.
          </p>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="email"
              placeholder="colleague@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              autoFocus
            />
            <button
              className="btn btn-primary btn-sm"
              onClick={handleAdd}
              disabled={adding}
              style={{ flexShrink: 0 }}
            >
              {adding ? '...' : 'Invite'}
            </button>
          </div>
        </div>
      )}

      {/* Members */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {project.members.map((m) => (
          <div
            key={m.user._id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '12px 16px',
              background: 'var(--surface-1)',
              borderRadius: 'var(--r-lg)',
              border: '1px solid var(--border-0)',
              transition: 'border-color 200ms',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-1)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-0)'}
          >
            {/* Avatar */}
            <div style={{
              width: 34,
              height: 34,
              borderRadius: '50%',
              background: `hsl(${(m.user.name.charCodeAt(0) * 20) % 360}, 55%, 25%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12,
              fontWeight: 700,
              color: `hsl(${(m.user.name.charCodeAt(0) * 20) % 360}, 70%, 72%)`,
              flexShrink: 0,
            }}>
              {initials(m.user.name)}
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: 13.5,
                fontWeight: 500,
                color: 'var(--text-0)',
                letterSpacing: '-0.01em',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}>
                {m.user.name}
                {m.user._id === user?._id && (
                  <span style={{
                    fontSize: 11,
                    color: 'var(--text-3)',
                    fontWeight: 400,
                  }}>
                    (you)
                  </span>
                )}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 1 }}>
                {m.user.email}
              </div>
            </div>

            {/* Role badge */}
            <span style={{
              fontSize: 11,
              fontWeight: 500,
              padding: '3px 9px',
              borderRadius: 100,
              background: m.role === 'admin' ? 'var(--brand-dim)' : 'var(--surface-4)',
              color: m.role === 'admin' ? 'var(--brand)' : 'var(--text-2)',
              border: `1px solid ${m.role === 'admin' ? 'rgba(79,110,247,0.2)' : 'var(--border-1)'}`,
            }}>
              {m.role}
            </span>

            {/* Remove */}
            {role === 'admin' && m.user._id !== user?._id && m.user._id !== project.owner && (
              <button
                onClick={() => handleRemove(m.user._id, m.user.name)}
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 'var(--r-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-3)',
                  fontSize: 16,
                  transition: 'all 150ms',
                  background: 'transparent',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = 'var(--danger)';
                  e.currentTarget.style.background = 'var(--danger-dim)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = 'var(--text-3)';
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MemberList;