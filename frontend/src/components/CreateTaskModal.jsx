import { useState } from 'react';
import toast from 'react-hot-toast';

const CreateTaskModal = ({ members, onSubmit, onClose, editTask }) => {
  const [form, setForm] = useState({
    title: editTask?.title || '',
    description: editTask?.description || '',
    assignedTo: editTask?.assignedTo?._id || '',
    priority: editTask?.priority || 'medium',
    status: editTask?.status || 'todo',
    dueDate: editTask?.dueDate ? editTask.dueDate.split('T')[0] : '',
  });
  const [loading, setLoading] = useState(false);
  const [successAnim, setSuccessAnim] = useState(false);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return toast.error('Task title is required');

    setLoading(true);
    try {
      await onSubmit({
        ...form,
        assignedTo: form.assignedTo || undefined,
        dueDate: form.dueDate || undefined,
      });

      setSuccessAnim(true);
      setTimeout(() => {
        onClose();
      }, 500);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save task');
      setLoading(false);
    }
  };

  const priorityMeta = {
    low: { color: '#10b981', label: 'Low', icon: '🟢', bg: 'rgba(16, 185, 129, 0.12)' },
    medium: { color: '#f59e0b', label: 'Medium', icon: '🟡', bg: 'rgba(245, 158, 11, 0.12)' },
    high: { color: '#f43f5e', label: 'High', icon: '🔴', bg: 'rgba(244, 63, 94, 0.12)' },
  };

  const activePriority = priorityMeta[form.priority] || priorityMeta.medium;

  return (
    <>
      <style>
        {`
          @keyframes modalFadeIn {
            from {
              opacity: 0;
              transform: scale(0.96) translateY(10px);
            }
            to {
              opacity: 1;
              transform: scale(1) translateY(0);
            }
          }

          @keyframes sheenSweep {
            0% { left: -120%; }
            100% { left: 180%; }
          }

          .cyber-modal-card {
            animation: modalFadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }

          .modal-dark-input {
            width: 100%;
            padding: 12px 16px;
            background: #000000;
            border: 1px solid #27272a;
            border-radius: 12px;
            font-size: 14px;
            color: #ededed;
            outline: none;
            transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
            box-sizing: border-box;
            font-family: inherit;
          }

          .modal-dark-input:focus {
            border-color: #38bdf8;
            box-shadow: 0 0 0 1px #38bdf8, 0 8px 18px rgba(56, 189, 248, 0.15);
          }

          .modal-dark-input::placeholder {
            color: #52525b;
          }

          .modal-dark-input option {
            background-color: #09090b;
            color: #ededed;
          }

          .btn-save-task {
            position: relative;
            overflow: hidden;
            flex: 1;
            padding: 13px;
            background: linear-gradient(135deg, #38bdf8 0%, #0284c7 100%);
            color: #000000;
            border: none;
            border-radius: 12px;
            font-size: 13px;
            font-weight: 800;
            cursor: pointer;
            transition: transform 0.18s ease, box-shadow 0.2s ease, background 0.3s ease;
            box-shadow: 0 4px 18px rgba(56, 189, 248, 0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
          }

          .btn-save-task::after {
            content: '';
            position: absolute;
            top: 0;
            left: -120%;
            width: 80%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent);
            transform: skewX(-20deg);
          }

          .btn-save-task:hover:not(:disabled)::after {
            animation: sheenSweep 0.75s cubic-bezier(0.16, 1, 0.3, 1);
          }

          .btn-save-task:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(56, 189, 248, 0.45);
          }

          .btn-save-task:active:not(:disabled) {
            transform: translateY(1px) scale(0.98);
          }

          .btn-save-task:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }
        `}
      </style>

      {/* Backdrop */}
      <div
        onClick={(e) => e.target === e.currentTarget && onClose()}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.78)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px 16px',
          zIndex: 200,
          boxSizing: 'border-box',
          overflowY: 'auto',
        }}
      >
        {/* Obsidian Modal Card */}
        <div
          className="cyber-modal-card"
          style={{
            width: '100%',
            maxWidth: '520px',
            maxHeight: '90vh',
            overflowY: 'auto',
            background: '#09090b',
            border: '1px solid #1e293b',
            borderRadius: '24px',
            padding: '34px',
            boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.95), 0 0 1px 1px rgba(255, 255, 255, 0.05)',
            boxSizing: 'border-box',
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', 'SF Pro Display', Roboto, sans-serif",
            position: 'relative',
            color: '#f8fafc',
          }}
        >
          {/* Top Multi-Color Neon Accent Trim */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '2px',
              background: 'linear-gradient(90deg, #f43f5e 0%, #38bdf8 35%, #f59e0b 70%, #10b981 100%)',
            }}
          />

          {/* Modal Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '24px',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: '800',
                    color: editTask ? '#f59e0b' : '#38bdf8',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    background: editTask ? 'rgba(245, 158, 11, 0.12)' : 'rgba(56, 189, 248, 0.12)',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    border: `1px solid ${editTask ? 'rgba(245, 158, 11, 0.3)' : 'rgba(56, 189, 248, 0.3)'}`,
                  }}
                >
                  {editTask ? 'UPDATE TICKET' : 'NEW SPRINT TICKET'}
                </span>
              </div>
              <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#ffffff', margin: 0, letterSpacing: '-0.02em' }}>
                {editTask ? 'Edit Task Details' : 'Create New Task'}
              </h2>
            </div>

            <button
              onClick={onClose}
              style={{
                background: '#18181b',
                border: '1px solid #27272a',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                fontSize: '14px',
                fontWeight: '700',
                color: '#a1a1aa',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#ffffff';
                e.currentTarget.style.borderColor = '#52525b';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#a1a1aa';
                e.currentTarget.style.borderColor = '#27272a';
              }}
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Task Title */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '11px',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: '#71717a',
                  marginBottom: '6px',
                }}
              >
                Task Title *
              </label>
              <input
                value={form.title}
                onChange={set('title')}
                placeholder="e.g. Implement refresh token rotation"
                required
                autoFocus
                className="modal-dark-input"
              />
            </div>

            {/* Description */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '11px',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: '#71717a',
                  marginBottom: '6px',
                }}
              >
                Description
              </label>
              <textarea
                value={form.description}
                onChange={set('description')}
                placeholder="Add technical context, requirements, or dependencies..."
                rows={3}
                className="modal-dark-input"
                style={{ resize: 'vertical' }}
              />
            </div>

            {/* Priority & Status Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '11px',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    color: '#71717a',
                    marginBottom: '6px',
                  }}
                >
                  Priority
                </label>
                <select value={form.priority} onChange={set('priority')} className="modal-dark-input">
                  <option value="low">🟢 Low</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="high">🔴 High</option>
                </select>
              </div>

              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '11px',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    color: '#71717a',
                    marginBottom: '6px',
                  }}
                >
                  Sprint Column
                </label>
                <select value={form.status} onChange={set('status')} className="modal-dark-input">
                  <option value="todo">📋 To Do</option>
                  <option value="in_progress">⚡ In Progress</option>
                  <option value="done">✅ Done</option>
                </select>
              </div>
            </div>

            {/* Assignee & Due Date Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '11px',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    color: '#71717a',
                    marginBottom: '6px',
                  }}
                >
                  Assignee
                </label>
                <select value={form.assignedTo} onChange={set('assignedTo')} className="modal-dark-input">
                  <option value="">👤 Unassigned</option>
                  {members.map((m) => (
                    <option key={m.user._id} value={m.user._id}>
                      {m.user.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '11px',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    color: '#71717a',
                    marginBottom: '6px',
                  }}
                >
                  Due Date
                </label>
                <input
                  type="date"
                  value={form.dueDate}
                  onChange={set('dueDate')}
                  className="modal-dark-input"
                  style={{ colorScheme: 'dark' }}
                />
              </div>
            </div>

            {/* Dynamic Priority Level Indicator Badge */}
            <div
              style={{
                padding: '12px 14px',
                background: '#000000',
                borderRadius: '12px',
                border: '1px solid #1e293b',
                borderLeft: `4px solid ${activePriority.color}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: '13px' }}>{activePriority.icon}</span>
                <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '600' }}>
                  Target Priority Level:
                </span>
              </div>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: '800',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: activePriority.color,
                  background: activePriority.bg,
                  padding: '2px 8px',
                  borderRadius: '4px',
                }}
              >
                {activePriority.label}
              </span>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: 12, marginTop: '8px' }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  flex: 1,
                  padding: '13px',
                  background: '#121215',
                  color: '#a1a1aa',
                  border: '1px solid #27272a',
                  borderRadius: '12px',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#ffffff';
                  e.currentTarget.style.borderColor = '#3f3f46';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#a1a1aa';
                  e.currentTarget.style.borderColor = '#27272a';
                }}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="btn-save-task"
                style={{
                  background: successAnim
                    ? '#10b981'
                    : 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)',
                }}
              >
                {successAnim
                  ? '✓ Saved to Board'
                  : loading
                  ? 'Saving...'
                  : editTask
                  ? 'Update Ticket'
                  : 'Add to Board'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateTaskModal;