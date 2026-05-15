import { format, isPast } from 'date-fns';

const PRIORITY_CONFIG = {
  low:    { label: 'Low',    color: 'var(--success)', bg: 'var(--success-dim)' },
  medium: { label: 'Medium', color: 'var(--warning)', bg: 'var(--warning-dim)' },
  high:   { label: 'High',   color: 'var(--danger)',  bg: 'var(--danger-dim)'  },
};

const STATUS_NEXT = {
  todo:        { next: 'in_progress', label: 'Move to In Progress' },
  in_progress: { next: 'done',        label: 'Mark as Done'        },
  done:        { next: null,          label: null                   },
};

const TaskCard = ({ task, role, currentUserId, onUpdateStatus, onDelete, onEdit }) => {
  const isOverdue = task.dueDate && isPast(new Date(task.dueDate)) && task.status !== 'done';
  const isDone = task.status === 'done';
  const canEdit = role === 'admin' || task.assignedTo?._id === currentUserId;
  const priority = PRIORITY_CONFIG[task.priority];
  const { next, label } = STATUS_NEXT[task.status];

  return (
    <div style={{
      background: 'var(--surface-1)',
      border: `1px solid ${isOverdue ? 'rgba(239,68,68,0.25)' : 'var(--border-0)'}`,
      borderRadius: 'var(--r-lg)',
      padding: '14px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      transition: 'border-color 200ms, box-shadow 200ms, transform 200ms',
      cursor: 'default',
    }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = isOverdue ? 'rgba(239,68,68,0.4)' : 'var(--border-1)';
        e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
        e.currentTarget.style.transform = 'translateY(-1px)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = isOverdue ? 'rgba(239,68,68,0.25)' : 'var(--border-0)';
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Priority + title */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        {/* Priority dot */}
        <div style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: priority.color,
          marginTop: 5,
          flexShrink: 0,
          boxShadow: `0 0 6px ${priority.color}`,
        }} />

        <h4 style={{
          fontSize: 13.5,
          fontWeight: 500,
          color: isDone ? 'var(--text-2)' : 'var(--text-0)',
          lineHeight: 1.4,
          letterSpacing: '-0.01em',
          textDecoration: isDone ? 'line-through' : 'none',
          flex: 1,
        }}>
          {task.title}
        </h4>
      </div>

      {task.description && (
        <p style={{
          fontSize: 12.5,
          color: 'var(--text-2)',
          lineHeight: 1.55,
          paddingLeft: 16,
        }}>
          {task.description.length > 85
            ? task.description.slice(0, 85) + '...'
            : task.description}
        </p>
      )}

      {/* Meta */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 6,
        paddingLeft: 16,
        alignItems: 'center',
      }}>
        <span style={{
          fontSize: 11,
          fontWeight: 500,
          padding: '2px 8px',
          borderRadius: 100,
          background: priority.bg,
          color: priority.color,
          border: `1px solid ${priority.color}22`,
        }}>
          {priority.label}
        </span>

        {task.assignedTo && (
          <span style={{
            fontSize: 12,
            color: 'var(--text-2)',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}>
            <span style={{
              width: 16,
              height: 16,
              borderRadius: '50%',
              background: `hsl(${(task.assignedTo.name.charCodeAt(0) * 20) % 360}, 55%, 28%)`,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 8,
              fontWeight: 700,
              color: `hsl(${(task.assignedTo.name.charCodeAt(0) * 20) % 360}, 70%, 72%)`,
            }}>
              {task.assignedTo.name[0]}
            </span>
            {task.assignedTo.name.split(' ')[0]}
          </span>
        )}

        {task.dueDate && (
          <span style={{
            fontSize: 12,
            color: isOverdue ? 'var(--danger)' : 'var(--text-2)',
            display: 'flex',
            alignItems: 'center',
            gap: 3,
          }}>
            {isOverdue && (
              <svg width="11" height="11" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 2a6 6 0 100 12A6 6 0 008 2zm0 3v4M8 11v1" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
              </svg>
            )}
            {format(new Date(task.dueDate), 'MMM d')}
            {isOverdue && ' · overdue'}
          </span>
        )}
      </div>

      {/* Actions */}
      {canEdit && (
        <div style={{
          display: 'flex',
          gap: 6,
          paddingTop: 8,
          paddingLeft: 16,
          borderTop: '1px solid var(--border-0)',
        }}>
          {next && (
            <button
              className="btn btn-ghost btn-sm"
              style={{ flex: 1, fontSize: 12 }}
              onClick={() => onUpdateStatus(task._id, next)}
            >
              {label}
            </button>
          )}
          {role === 'admin' && (
            <>
              <button
                className="btn btn-ghost btn-xs"
                onClick={() => onEdit(task)}
              >
                Edit
              </button>
              <button
                className="btn btn-danger btn-xs"
                onClick={() => onDelete(task._id)}
              >
                ×
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskCard;