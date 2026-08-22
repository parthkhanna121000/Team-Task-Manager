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
    if (!form.title.trim()) return toast.error('Title is required');
    
    setLoading(true);
    try {
      await onSubmit({
        ...form,
        assignedTo: form.assignedTo || undefined,
        dueDate: form.dueDate || undefined,
      });
      
      // Trigger success button animation state
      setSuccessAnim(true);
      setTimeout(() => {
        onClose();
      }, 600);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save task');
      setLoading(false);
    }
  };

  return (
    <>
      <style>
        {`
          @keyframes shine {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          @keyframes pulse-success {
            0% { transform: scale(1); }
            50% { transform: scale(1.03); }
            100% { transform: scale(1); }
          }
          .task-shining-btn {
            position: relative;
            overflow: hidden;
            transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .task-shining-btn::after {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(
              90deg,
              transparent,
              rgba(255, 255, 255, 0.4),
              transparent
            );
            transition: none;
          }
          .task-shining-btn:hover::after {
            animation: shine 0.75s ease-in-out;
          }
          .task-shining-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(99, 102, 241, 0.3);
          }
          .success-state {
            background: #10b981 !important;
            animation: pulse-success 0.4s ease;
          }
        `}
      </style>

      {/* Backdrop with proper vertical centering to avoid touching the Navbar */}
      <div
        onClick={(e) => e.target === e.currentTarget && onClose()}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.45)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px 16px',
          zIndex: 200,
          boxSizing: 'border-box',
          overflowY: 'auto',
        }}
      >
        {/* Floating Glassmorphism Modal Card */}
        <div style={{
          width: '100%',
          maxWidth: '500px',
          maxHeight: '90vh',
          overflowY: 'auto',
          background: 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
          borderRadius: '32px',
          padding: '36px',
          boxShadow: '0 30px 60px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.8) inset',
          boxSizing: 'border-box',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          margin: 'auto',
        }}>

          {/* Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '24px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{
                fontSize: '10px',
                fontWeight: '700',
                color: '#6366f1',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                background: 'rgba(99, 102, 241, 0.1)',
                padding: '4px 10px',
                borderRadius: '9999px',
              }}>
                {editTask ? 'Edit' : 'Task Manager'}
              </span>
              <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
                {editTask ? 'Edit Task' : 'Create New Task'}
              </h2>
            </div>
            <button
              onClick={onClose}
              style={{
                background: '#f1f5f9',
                border: 'none',
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                fontSize: '18px',
                fontWeight: '700',
                color: '#64748b',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.2s ease',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#e2e8f0'}
              onMouseLeave={e => e.currentTarget.style.background = '#f1f5f9'}
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Title */}
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#475569', marginBottom: '6px' }}>
                Title *
              </label>
              <input
                value={form.title}
                onChange={set('title')}
                placeholder="What needs to be done?"
                required
                autoFocus
                style={inputStyle}
              />
            </div>

            {/* Description */}
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#475569', marginBottom: '6px' }}>
                Description
              </label>
              <textarea
                value={form.description}
                onChange={set('description')}
                placeholder="Add contextual details or requirements..."
                rows={3}
                style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
              />
            </div>

            {/* Priority + Status */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#475569', marginBottom: '6px' }}>
                  Priority
                </label>
                <select value={form.priority} onChange={set('priority')} style={inputStyle}>
                  <option value="low">🟢 Low</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="high">🔴 High</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#475569', marginBottom: '6px' }}>
                  Status
                </label>
                <select value={form.status} onChange={set('status')} style={inputStyle}>
                  <option value="todo">📋 To Do</option>
                  <option value="in_progress">⚡ In Progress</option>
                  <option value="done">✅ Done</option>
                </select>
              </div>
            </div>

            {/* Assignee + Due date */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#475569', marginBottom: '6px' }}>
                  Assign To
                </label>
                <select value={form.assignedTo} onChange={set('assignedTo')} style={inputStyle}>
                  <option value="">👤 Unassigned</option>
                  {members.map((m) => (
                    <option key={m.user._id} value={m.user._id}>
                      {m.user.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#475569', marginBottom: '6px' }}>
                  Due Date
                </label>
                <input
                  type="date"
                  value={form.dueDate}
                  onChange={set('dueDate')}
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Priority indicator hint pill */}
            <div style={{
              padding: '12px 16px',
              background: '#f8fafc',
              borderRadius: '14px',
              borderLeft: `4px solid ${
                form.priority === 'high' ? '#ef4444' :
                form.priority === 'medium' ? '#f59e0b' :
                '#10b981'
              }`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              border: '1px solid #e2e8f0',
            }}>
              <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>
                Priority Level Selected:
              </span>
              <span style={{
                fontSize: '12px',
                fontWeight: '800',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: form.priority === 'high' ? '#ef4444' : form.priority === 'medium' ? '#d97706' : '#10b981',
              }}>
                {form.priority}
              </span>
            </div>

            {/* Actions with Shiny Animation & Success State */}
            <div style={{ display: 'flex', gap: 12, marginTop: '8px' }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  flex: 1,
                  padding: '14px',
                  background: '#f1f5f9',
                  color: '#475569',
                  border: 'none',
                  borderRadius: '16px',
                  fontSize: '14px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'background 0.2s ease',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#e2e8f0'}
                onMouseLeave={e => e.currentTarget.style.background = '#f1f5f9'}
              >
                Cancel
              </button>
              
              <button
                type="submit"
                disabled={loading}
                className={`task-shining-btn ${successAnim ? 'success-state' : ''}`}
                style={{
                  flex: 1,
                  padding: '14px',
                  background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '16px',
                  fontSize: '14px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  boxShadow: '0 10px 20px rgba(99, 102, 241, 0.25)',
                }}
              >
                {successAnim ? '✓ Created Successfully!' : loading ? 'Saving...' : editTask ? 'Save Changes' : 'Create Task'}
              </button>
            </div>
          </form>

        </div>
      </div>
    </>
  );
};

const inputStyle = {
  width: '100%',
  padding: '13px 16px',
  backgroundColor: '#f8fafc',
  border: '1px solid #cbd5e1',
  borderRadius: '14px',
  fontSize: '14px',
  color: '#0f172a',
  outline: 'none',
  boxSizing: 'border-box',
};

export default CreateTaskModal;