import { format, isPast } from 'date-fns';

const STATUS_LABELS = {
  todo: 'to do',
  in_progress: 'in progress',
  done: 'done',
};

const PRIORITY_LABELS = {
  low: 'low',
  medium: 'med',
  high: 'high',
};

const PRIORITY_COLORS = {
  low: 'var(--green)',
  medium: 'var(--amber)',
  high: 'var(--red)',
};

const TaskCard = ({ task, role, currentUserId, onUpdateStatus, onDelete, onEdit }) => {
  const isOverdue = task.dueDate && isPast(new Date(task.dueDate)) && task.status !== 'done';
  const canEdit = role === 'admin' || task.assignedTo?._id === currentUserId;

  const nextStatus = {
    todo: 'in_progress',
    in_progress: 'done',
    done: null,
  };

  return (
    <div style={{
      background: 'var(--bg-2)',
      border: `1px solid ${isOverdue ? 'rgba(220,38,38,0.3)' : 'var(--border)'}`,
      borderRadius: 'var(--radius-lg)',
      padding: '14px',
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      transition: 'border-color 120ms',
    }}
      onMouseEnter={e => !isOverdue && (e.currentTarget.style.borderColor = 'var(--border-2)')}
      onMouseLeave={e => !isOverdue && (e.currentTarget.style.borderColor = 'var(--border)')}
    >
      {/* Title row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
        <h4 style={{
          fontSize: 13,
          fontWeight: 500,
          color: task.status === 'done' ? 'var(--txt-3)' : 'var(--txt)',
          lineHeight: 1.4,
          textDecoration: task.status === 'done' ? 'line-through' : 'none',
          flex: 1,
        }}>
          {task.title}
        </h4>
        <span style={{
          fontFamily: 'IBM Plex Mono, monospace',
          fontSize: 10,
          fontWeight: 500,
          color: PRIORITY_COLORS[task.priority],
          flexShrink: 0,
          letterSpacing: '0.04em',
        }}>
          {PRIORITY_LABELS[task.priority]}
        </span>
      </div>

      {task.description && (
        <p style={{
          color: 'var(--txt-3)',
          fontSize: 12,
          lineHeight: 1.5,
        }}>
          {task.description.length > 90
            ? task.description.slice(0, 90) + '...'
            : task.description}
        </p>
      )}

      {/* Meta row */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
        {task.assignedTo && (
          <span style={{
            fontSize: 11,
            color: 'var(--txt-3)',
            fontFamily: 'IBM Plex Mono, monospace',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}>
            @ {task.assignedTo.name.split(' ')[0].toLowerCase()}
          </span>
        )}

        {task.dueDate && (
          <span style={{
            fontSize: 11,
            color: isOverdue ? '#f87171' : 'var(--txt-3)',
            fontFamily: 'IBM Plex Mono, monospace',
            display: 'flex',
            alignItems: 'center',
            gap: 3,
          }}>
            {isOverdue && '! '}
            {format(new Date(task.dueDate), 'MMM d')}
          </span>
        )}
      </div>

      {/* Actions */}
      {canEdit && (
        <div style={{
          display: 'flex',
          gap: 6,
          paddingTop: 8,
          borderTop: '1px solid var(--border)',
        }}>
          {nextStatus[task.status] && (
            <button
              className="btn btn-ghost btn-sm"
              style={{ flex: 1, justifyContent: 'center', fontSize: 11, fontFamily: 'IBM Plex Mono, monospace' }}
              onClick={() => onUpdateStatus(task._id, nextStatus[task.status])}
            >
              → {STATUS_LABELS[nextStatus[task.status]]}
            </button>
          )}
          {role === 'admin' && (
            <>
              <button
                className="btn btn-ghost btn-sm"
                style={{ fontSize: 11 }}
                onClick={() => onEdit(task)}
              >
                edit
              </button>
              <button
                className="btn btn-danger btn-sm"
                style={{ fontSize: 11 }}
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