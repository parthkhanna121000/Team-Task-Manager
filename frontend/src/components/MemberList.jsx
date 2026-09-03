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
      return toast.error('Invalid email address format');
    }
    setAdding(true);
    try {
      await onAddMember(email.trim());
      setEmail('');
      setShowForm(false);
      toast.success('Member invited successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add member');
    } finally {
      setAdding(false);
    }
  };

  const handleRemove = async (memberId, memberName) => {
    if (!confirm(`Remove ${memberName} from this project workspace?`)) return;
    try {
      await onRemoveMember(memberId);
      toast.success('Member removed');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove member');
    }
  };

  const initials = (name) =>
    name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U';

  const avatarPalettes = [
    { bg: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)', text: '#ffffff', glow: 'rgba(56, 189, 248, 0.35)' },
    { bg: 'linear-gradient(135deg, #e11d48 0%, #fb7185 100%)', text: '#ffffff', glow: 'rgba(244, 63, 94, 0.35)' },
    { bg: 'linear-gradient(135deg, #d97706 0%, #fbbf24 100%)', text: '#000000', glow: 'rgba(245, 158, 11, 0.35)' },
    { bg: 'linear-gradient(135deg, #059669 0%, #34d399 100%)', text: '#000000', glow: 'rgba(16, 185, 129, 0.35)' },
  ];

  return (
    <div className="cyber-member-list">
      <style>{`
        .cyber-member-list {
          max-width: 760px;
          font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'SF Pro Display', Roboto, sans-serif;
          color: #f8fafc;
        }

        .member-panel {
          background: #09090b;
          border: 1px solid #1e293b;
          border-radius: 18px;
          padding: 16px 20px;
          display: flex;
          align-items: center;
          gap: 16px;
          transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .member-panel:hover {
          border-color: #334155;
          background: #0d121c;
          transform: translateX(3px);
          box-shadow: 0 10px 24px -8px rgba(0, 0, 0, 0.7);
        }

        .btn-sheen {
          position: relative;
          overflow: hidden;
          transition: all 0.2s ease;
        }

        .btn-sheen::after {
          content: '';
          position: absolute;
          top: 0;
          left: -120%;
          width: 80%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent);
          transform: skewX(-20deg);
        }

        .btn-sheen:hover:not(:disabled)::after {
          animation: sheen 0.75s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes sheen {
          0% { left: -120%; }
          100% { left: 180%; }
        }

        .cyber-member-input {
          flex: 1;
          padding: 12px 16px;
          background: #000000;
          border: 1px solid #27272a;
          border-radius: 12px;
          font-size: 13px;
          color: #ededed;
          outline: none;
          box-sizing: border-box;
          transition: all 0.2s ease;
        }

        .cyber-member-input:focus {
          border-color: #38bdf8;
          box-shadow: 0 0 0 1px #38bdf8, 0 6px 16px rgba(56, 189, 248, 0.15);
        }

        .cyber-member-input::placeholder {
          color: #52525b;
        }

        .remove-member-btn {
          background: transparent;
          border: 1px solid transparent;
          color: #64748b;
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.18s ease;
          font-size: 14px;
        }

        .remove-member-btn:hover {
          background: rgba(244, 63, 94, 0.12);
          border-color: rgba(244, 63, 94, 0.3);
          color: #f43f5e;
          transform: scale(1.05);
        }
      `}</style>

      {/* Header Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: 12
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{
            fontSize: '11px',
            fontWeight: '800',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#10b981',
            background: 'rgba(16, 185, 129, 0.1)',
            padding: '3px 10px',
            borderRadius: '9999px',
            border: '1px solid rgba(16, 185, 129, 0.25)'
          }}>
            {project.members.length} {project.members.length !== 1 ? 'Contributors' : 'Contributor'}
          </span>
          <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '600' }}>
            Workspace Access
          </span>
        </div>

        {role === 'admin' && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-sheen"
            style={{
              padding: '8px 18px',
              background: showForm ? '#18181b' : 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)',
              color: showForm ? '#a1a1aa' : '#000000',
              border: showForm ? '1px solid #27272a' : 'none',
              borderRadius: '10px',
              fontSize: '12px',
              fontWeight: '800',
              cursor: 'pointer',
              boxShadow: showForm ? 'none' : '0 4px 14px rgba(56, 189, 248, 0.3)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            <span>{showForm ? '✕ Close' : '+ Add Member'}</span>
          </button>
        )}
      </div>

      {/* Add Member Drawer */}
      {showForm && (
        <div style={{
          background: 'linear-gradient(145deg, #09090b 0%, #0c121e 100%)',
          border: '1px solid #1e293b',
          borderRadius: '18px',
          padding: '20px 22px',
          marginBottom: '22px',
          boxShadow: '0 20px 35px -10px rgba(0, 0, 0, 0.8)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: 'linear-gradient(90deg, #38bdf8 0%, #10b981 100%)'
          }} />

          <p style={{
            fontSize: '12px',
            color: '#94a3b8',
            margin: '0 0 12px 0',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}>
            <span style={{ color: '#38bdf8' }}>✦</span>
            <span>Invite registered contributor via email:</span>
          </p>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <input
              type="email"
              placeholder="colleague@collabnex.io"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              className="cyber-member-input"
              autoFocus
            />
            <button
              onClick={handleAdd}
              disabled={adding}
              className="btn-sheen"
              style={{
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: '#000000',
                border: 'none',
                borderRadius: '12px',
                fontSize: '13px',
                fontWeight: '800',
                cursor: adding ? 'not-allowed' : 'pointer',
                opacity: adding ? 0.7 : 1,
                boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              {adding ? 'Inviting...' : 'Send Invite →'}
            </button>
          </div>
        </div>
      )}

      {/* Member Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {project.members.map((m, idx) => {
          const isAdmin = m.role === 'admin';
          const isCurrentUser = m.user._id === user?._id;
          const isOwner = m.user._id === project.owner;
          const palette = avatarPalettes[idx % avatarPalettes.length];

          return (
            <div key={m.user._id} className="member-panel">
              {/* Initials Avatar */}
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: palette.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '13px',
                fontWeight: '800',
                color: palette.text,
                flexShrink: 0,
                boxShadow: `0 4px 12px ${palette.glow}`,
                border: '1px solid rgba(255, 255, 255, 0.15)'
              }}>
                {initials(m.user.name)}
              </div>

              {/* Contributor Meta */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: '14px',
                  fontWeight: '700',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  flexWrap: 'wrap'
                }}>
                  <span>{m.user.name}</span>

                  {isCurrentUser && (
                    <span style={{
                      fontSize: '10px',
                      fontWeight: '800',
                      color: '#38bdf8',
                      background: 'rgba(56, 189, 248, 0.12)',
                      padding: '2px 8px',
                      borderRadius: '9999px',
                      border: '1px solid rgba(56, 189, 248, 0.3)'
                    }}>
                      You
                    </span>
                  )}

                  {isOwner && (
                    <span style={{
                      fontSize: '10px',
                      fontWeight: '800',
                      color: '#f59e0b',
                      background: 'rgba(245, 158, 11, 0.12)',
                      padding: '2px 8px',
                      borderRadius: '9999px',
                      border: '1px solid rgba(245, 158, 11, 0.3)'
                    }}>
                      Owner
                    </span>
                  )}
                </div>

                <div style={{
                  fontSize: '12px',
                  color: '#64748b',
                  fontWeight: '500',
                  marginTop: '3px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {m.user.email}
                </div>
              </div>

              {/* Role Pill */}
              <span style={{
                fontSize: '10px',
                fontWeight: '800',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                padding: '4px 10px',
                borderRadius: '6px',
                background: isAdmin ? 'rgba(56, 189, 248, 0.12)' : 'rgba(255, 255, 255, 0.05)',
                color: isAdmin ? '#38bdf8' : '#94a3b8',
                border: isAdmin ? '1px solid rgba(56, 189, 248, 0.35)' : '1px solid #27272a'
              }}>
                {m.role}
              </span>

              {/* Remove Contributor Action */}
              {role === 'admin' && !isCurrentUser && !isOwner && (
                <button
                  onClick={() => handleRemove(m.user._id, m.user.name)}
                  title={`Remove ${m.user.name}`}
                  className="remove-member-btn"
                  aria-label={`Remove ${m.user.name}`}
                >
                  ✕
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