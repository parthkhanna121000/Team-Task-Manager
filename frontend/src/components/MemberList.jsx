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
      toast.success('Member added successfully!');
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
    <div style={{ maxWidth: '640px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* Header Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '20px',
      }}>
        <p style={{
          fontSize: '12px',
          fontWeight: '700',
          color: '#64748b',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          margin: 0,
        }}>
          {project.members.length} member{project.members.length !== 1 ? 's' : ''} on team
        </p>
        {role === 'admin' && (
          <button
            onClick={() => setShowForm(!showForm)}
            style={{
              padding: '8px 16px',
              background: showForm ? '#e2e8f0' : 'rgba(99, 102, 241, 0.1)',
              color: showForm ? '#475569' : '#6366f1',
              border: 'none',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            {showForm ? 'Cancel' : '+ Add Member'}
          </button>
        )}
      </div>

      {/* Add Member Form Drawer */}
      {showForm && (
        <div style={{
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.9)',
          borderRadius: '20px',
          padding: '20px',
          marginBottom: '20px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.03)',
        }}>
          <p style={{
            fontSize: '12px',
            color: '#64748b',
            marginBottom: '10px',
            fontWeight: '600',
          }}>
            Enter a registered user's email address to invite them:
          </p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="email"
              placeholder="member@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              style={{
                flex: 1,
                padding: '12px 16px',
                backgroundColor: '#f8fafc',
                border: '1px solid #cbd5e1',
                borderRadius: '14px',
                fontSize: '14px',
                color: '#0f172a',
                outline: 'none',
                boxSizing: 'border-box',
              }}
              autoFocus
            />
            <button
              onClick={handleAdd}
              disabled={adding}
              style={{
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #0f172a 0%, #334155 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '14px',
                fontSize: '13px',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: '0 8px 16px rgba(15, 23, 42, 0.15)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              {adding ? 'Adding...' : 'Invite'}
            </button>
          </div>
        </div>
      )}

      {/* Member List Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {project.members.map((m) => {
          const isAdmin = m.role === 'admin';
          const isCurrentUser = m.user._id === user?._id;

          return (
            <div
              key={m.user._id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '16px 20px',
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(20px)',
                borderRadius: '20px',
                border: '1px solid rgba(255, 255, 255, 0.9)',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.03)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.95)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.8)'}
            >
              {/* Avatar Initials Badge */}
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: isAdmin
                  ? 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)'
                  : 'linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '13px',
                fontWeight: '700',
                color: '#ffffff',
                flexShrink: 0,
                boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
              }}>
                {initials(m.user.name)}
              </div>

              {/* Name and Email */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {m.user.name}
                  {isCurrentUser && (
                    <span style={{
                      fontSize: '10px',
                      fontWeight: '700',
                      color: '#6366f1',
                      background: 'rgba(99, 102, 241, 0.1)',
                      padding: '2px 8px',
                      borderRadius: '9999px',
                    }}>
                      You
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '500', marginTop: '2px' }}>
                  {m.user.email}
                </div>
              </div>

              {/* Role Badge */}
              <span style={{
                fontSize: '10px',
                fontWeight: '700',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                padding: '4px 10px',
                borderRadius: '9999px',
                background: isAdmin ? 'rgba(99, 102, 241, 0.1)' : 'rgba(226, 232, 240, 0.8)',
                color: isAdmin ? '#6366f1' : '#64748b',
              }}>
                {m.role}
              </span>

              {/* Remove Action for Admin */}
              {role === 'admin' && !isCurrentUser && m.user._id !== project.owner && (
                <button
                  onClick={() => handleRemove(m.user._id, m.user.name)}
                  title="Remove member"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#94a3b8',
                    fontSize: '18px',
                    cursor: 'pointer',
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                    e.currentTarget.style.color = '#ef4444';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#94a3b8';
                  }}
                >
                  ×
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MemberList;