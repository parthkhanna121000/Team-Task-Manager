import { useState } from 'react';
import toast from 'react-hot-toast';

const PRIORITIES = [
  { value: 'low',    label: 'Low',    color: 'var(--success)' },
  { value: 'medium', label: 'Medium', color: 'var(--warning)' },
  { value: 'high',   label: 'High',   color: 'var(--danger)'  },
];

const STATUSES = [
  { value: 'todo',        label: 'To Do'       },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'done',        label: 'Done'        },
];

const CreateTaskModal = ({ members, onSubmit, onClose, editTask }) => {
  const [form, setForm] = useState({
    title:      editTask?.title || '',
    description: editTask?.description || '',
    assignedTo: editTask?.assignedTo?._id || '',
    priority:   editTask?.priority || 'medium',
    status:     editTask?.status || 'todo',
    dueDate:    editTask?.dueDate ? editTask.dueDate.split('T')[0] : '',
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

  const currentPriority = PRIORITIES.find(p => p.value === form.priority);

  return (
    <div
      className="overlay animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal animate-fade-up">
        {/* Header */}
        <div className="modal-head">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              background: 'var(--brand-dim)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                <path d="M8 2v12M2 8h12" stroke="var(--brand)" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="modal-title">
              {editTask ? 'Edit task' : 'New task'}
            </span>
          </div>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Title */}
          <div className="field">
            <label>Title <span style={{ color: 'var(--danger)', marginLeft: 2 }}>*</span></label>
            <input
              value={form.title}
              onChange={set('title')}
              placeholder="What needs to be done?"
              autoFocus
            />
          </div>

          {/* Description */}
          <div className="field">
            <label>Description <span style={{ color: 'var(--text-3)' }}>(optional)</span></label>
            <textarea
              value={form.description}
              onChange={set('description')}
              placeholder="Add more context..."
              rows={3}
              style={{ resize: 'vertical' }}
            />
          </div>

          {/* Priority selector — visual buttons */}
          <div className="field">
            <label>Priority</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {PRIORITIES.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, priority: p.value }))}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: 'var(--r-md)',
                    fontSize: 12.5,
                    fontWeight: 500,
                    border: `1px solid ${form.priority === p.value ? p.color : 'var(--border-1)'}`,
                    background: form.priority === p.value
                      ? `${p.color}18`
                      : 'var(--surface-2)',
                    color: form.priority === p.value ? p.color : 'var(--text-2)',
                    transition: 'all 150ms',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                  }}
                >
                  <span style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: p.color,
                    opacity: form.priority === p.value ? 1 : 0.4,
                    boxShadow: form.priority === p.value ? `0 0 5px ${p.color}` : 'none',
                  }} />
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Status + Assignee */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="field">
              <label>Status</label>
              <select value={form.status} onChange={set('status')}>
                {STATUSES.map(s => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>

            <div className="field">
              <label>Assign to</label>
              <select value={form.assignedTo} onChange={set('assignedTo')}>
                <option value="">Unassigned</option>
                {members.map((m) => (
                  <option key={m.user._id} value={m.user._id}>
                    {m.user.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Due date */}
          <div className="field">
            <label>Due date <span style={{ color: 'var(--text-3)' }}>(optional)</span></label>
            <input
              type="date"
              value={form.dueDate}
              onChange={set('dueDate')}
            />
          </div>

          {/* Actions */}
          <div style={{
            display: 'flex',
            gap: 10,
            marginTop: 4,
            paddingTop: 16,
            borderTop: '1px solid var(--border-0)',
          }}>
            <button
              className="btn btn-ghost"
              style={{ flex: 1 }}
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              style={{ flex: 1 }}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className="spinner" style={{ width: 13, height: 13, borderWidth: 1.5 }} />
                  Saving...
                </span>
              ) : editTask ? 'Save changes' : 'Create task'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTaskModal;