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
    if (!emailRegex.test(email.trim())) {
      return toast.error('Invalid email address');
    }
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
        marginBottom: 14,
      }}>
        <p style={{
          fontFamily: 'IBM Plex Mono, monospace',
          fontSize: 11,
          color: 'var(--txt-3)',
          letterSpacing: '0.06em',
        }}>
          {project.members.length} member{project.members.length !== 1 ? 's' : ''}
        </p>
        {role === 'admin' && (
          <button
            className="btn btn-ghost btn-sm"
            style={{ fontFamily: 'IBM Plex Mono, monospace' }}
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'cancel' : '+ add member'}
          </button>
        )}
      </div>

      {/* Add form */}
      {showForm && (
        <div style={{
          background: 'var(--bg-2)',
          border: '1px solid var(--border-2)',
          borderRadius: 'var(--radius-lg)',
          padding: '14px 16px',
          marginBottom: 12,
        }}>
          <p style={{
            fontSize: 11,
            color: 'var(--txt-3)',
            marginBottom: 10,
            fontFamily: 'IBM Plex Mono, monospace',
          }}>
            enter a registered user's email
          </p>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="email"
              placeholder="member@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              style={{ flex: 1 }}
              autoFocus
            />
            <button
              className="btn btn-amber btn-sm"
              onClick={handleAdd}
              disabled={adding}
            >
              {adding ? '...' : 'add'}
            </button>
          </div>
        </div>
      )}

      {/* Member list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {project.members.map((m) => (
          <div
            key={m.user._id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '10px 14px',
              background: 'var(--bg-2)',
              borderRadius: 'var(--radius)',
              border: '1px solid var(--border)',
            }}
          >
            <div style={{
              width: 30,
              height: 30,
              borderRadius: '50%',
              background: m.role === 'admin' ? 'var(--amber-dim)' : 'var(--bg-4)',
              border: `1px solid ${m.role === 'admin' ? 'rgba(217,119,6,0.25)' : 'var(--border)'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 11,
              fontWeight: 600,
              color: m.role === 'admin' ? 'var(--amber-text)' : 'var(--txt-3)',
              fontFamily: 'IBM Plex Mono, monospace',
              flexShrink: 0,
            }}>
              {initials(m.user.name)}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--txt)' }}>
                {m.user.name}
                {m.user._id === user?._id && (
                  <span style={{
                    color: 'var(--txt-3)',
                    fontSize: 11,
                    marginLeft: 6,
                    fontFamily: 'IBM Plex Mono, monospace',
                  }}>
                    (you)
                  </span>
                )}
              </div>
              <div style={{
                fontSize: 11,
                color: 'var(--txt-3)',
                fontFamily: 'IBM Plex Mono, monospace',
              }}>
                {m.user.email}
              </div>
            </div>

            <span style={{
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: 10,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: m.role === 'admin' ? 'var(--amber-text)' : 'var(--txt-3)',
            }}>
              {m.role}
            </span>

            {role === 'admin' && m.user._id !== user?._id && m.user._id !== project.owner && (
              <button
                onClick={() => handleRemove(m.user._id, m.user.name)}
                style={{
                  color: 'var(--txt-3)',
                  fontSize: 15,
                  padding: '2px 6px',
                  borderRadius: 'var(--radius)',
                  transition: 'color 120ms',
                  fontFamily: 'IBM Plex Mono, monospace',
                  lineHeight: 1,
                }}
                onMouseEnter={e => e.currentTarget.style.color = '#f87171'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--txt-3)'}
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