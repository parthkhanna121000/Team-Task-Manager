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

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.title.trim()) return toast.error('Title is required');
    setLoading(true);
    try {
      await onSubmit({
        ...form,
        assignedTo: form.assignedTo || undefined,
        dueDate: form.dueDate || undefined,
      });
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">

        {/* Header */}
        <div className="modal-head">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: 10,
              color: 'var(--amber-text)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}>
              {editTask ? 'edit' : 'new'}
            </span>
            <span className="modal-title">
              {editTask ? 'Edit task' : 'Create task'}
            </span>
          </div>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Title */}
          <div className="field">
            <label>Title *</label>
            <input
              value={form.title}
              onChange={set('title')}
              placeholder="What needs to be done?"
              autoFocus
            />
          </div>

          {/* Description */}
          <div className="field">
            <label>Description</label>
            <textarea
              value={form.description}
              onChange={set('description')}
              placeholder="Any extra details..."
              rows={3}
              style={{ resize: 'vertical' }}
            />
          </div>

          {/* Priority + Status */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div className="field">
              <label>Priority</label>
              <select value={form.priority} onChange={set('priority')}>
                <option value="low">low</option>
                <option value="medium">medium</option>
                <option value="high">high</option>
              </select>
            </div>

            <div className="field">
              <label>Status</label>
              <select value={form.status} onChange={set('status')}>
                <option value="todo">to do</option>
                <option value="in_progress">in progress</option>
                <option value="done">done</option>
              </select>
            </div>
          </div>

          {/* Assignee + Due date */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div className="field">
              <label>Assign to</label>
              <select value={form.assignedTo} onChange={set('assignedTo')}>
                <option value="">unassigned</option>
                {members.map((m) => (
                  <option key={m.user._id} value={m.user._id}>
                    {m.user.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label>Due date</label>
              <input
                type="date"
                value={form.dueDate}
                onChange={set('dueDate')}
              />
            </div>
          </div>

          {/* Priority hint */}
          <div style={{
            padding: '8px 12px',
            background: 'var(--bg-3)',
            borderRadius: 'var(--radius)',
            borderLeft: `3px solid ${
              form.priority === 'high' ? 'var(--red)' :
              form.priority === 'medium' ? 'var(--amber)' :
              'var(--green)'
            }`,
          }}>
            <span style={{
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: 11,
              color: 'var(--txt-3)',
            }}>
              priority:{' '}
              <span style={{
                color: form.priority === 'high' ? '#f87171' :
                       form.priority === 'medium' ? 'var(--amber-text)' :
                       'var(--green)',
              }}>
                {form.priority}
              </span>
            </span>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <button
              className="btn btn-ghost"
              style={{ flex: 1, justifyContent: 'center' }}
              onClick={onClose}
            >
              cancel
            </button>
            <button
              className="btn btn-amber"
              style={{ flex: 1, justifyContent: 'center' }}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? '...' : editTask ? 'save changes' : 'create task'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTaskModal;