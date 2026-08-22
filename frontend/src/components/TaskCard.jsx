import { format, isPast } from 'date-fns';

const STATUS_LABELS = {
  todo: 'To Do',
  in_progress: 'In Progress',
  done: 'Done',
};

const PRIORITY_LABELS = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};

const PRIORITY_COLORS = {
  low: '#10b981',
  medium: '#f59e0b',
  high: '#ef4444',
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
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(16px)',
        border: `1px solid ${isOverdue ? 'rgba(239, 68, 68, 0.4)' : 'rgba(255, 255, 255, 0.9)'}`,
        borderRadius: '20px',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.03)',
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.06)';
        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.95)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.03)';
        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.85)';
      }}
    >
      {/* Overdue indicator top accent bar */}
      {isOverdue && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: '#ef4444',
        }} />
      )}

      {/* Title row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
        <h4 style={{
          fontSize: '14px',
          fontWeight: '700',
          color: task.status === 'done' ? '#94a3b8' : '#0f172a',
          lineHeight: '1.4',
          textDecoration: task.status === 'done' ? 'line-through' : 'none',
          margin: 0,
          flex: 1,
        }}>
          {task.title}
        </h4>
        <span style={{
          fontSize: '10px',
          fontWeight: '700',
          color: PRIORITY_COLORS[task.priority],
          background: `${PRIORITY_COLORS[task.priority]}15`,
          padding: '3px 8px',
          borderRadius: '9999px',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          flexShrink: 0,
        }}>
          {PRIORITY_LABELS[task.priority]}
        </span>
      </div>

      {task.description && (
        <p style={{
          color: '#64748b',
          fontSize: '12.5px',
          lineHeight: '1.5',
          margin: 0,
          fontWeight: '500',
        }}>
          {task.description.length > 80
            ? task.description.slice(0, 80) + '...'
            : task.description}
        </p>
      )}

      {/* Meta row */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
        {task.assignedTo && (
          <span style={{
            fontSize: '11px',
            color: '#475569',
            fontWeight: '600',
            background: '#f1f5f9',
            padding: '3px 8px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}>
            👤 {task.assignedTo.name.split(' ')[0]}
          </span>
        )}

        {task.dueDate && (
          <span style={{
            fontSize: '11px',
            color: isOverdue ? '#ef4444' : '#64748b',
            fontWeight: '600',
            background: isOverdue ? 'rgba(239, 68, 68, 0.1)' : '#f1f5f9',
            padding: '3px 8px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}>
            {isOverdue ? '⚠️ Overdue: ' : '📅 '}
            {format(new Date(task.dueDate), 'MMM d')}
          </span>
        )}
      </div>

      {/* Actions */}
      {canEdit && (
        <div style={{
          display: 'flex',
          gap: 6,
          paddingTop: 10,
          borderTop: '1px solid rgba(226, 232, 240, 0.8)',
        }}>
          {nextStatus[task.status] && (
            <button
              onClick={() => onUpdateStatus(task._id, nextStatus[task.status])}
              style={{
                flex: 1,
                padding: '8px 12px',
                background: '#f1f5f9',
                color: '#334155',
                border: 'none',
                borderRadius: '10px',
                fontSize: '11.5px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'background 0.2s ease',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#e2e8f0'}
              onMouseLeave={e => e.currentTarget.style.background = '#f1f5f9'}
            >
              Move to {STATUS_LABELS[nextStatus[task.status]]} →
            </button>
          )}

          {role === 'admin' && (
            <>
              <button
                onClick={() => onEdit(task)}
                style={{
                  padding: '8px 12px',
                  background: 'rgba(99, 102, 241, 0.1)',
                  color: '#6366f1',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '11.5px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'background 0.2s ease',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(99, 102, 241, 0.2)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(99, 102, 241, 0.1)'}
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(task._id)}
                title="Delete task"
                style={{
                  padding: '8px 12px',
                  background: 'rgba(239, 68, 68, 0.1)',
                  color: '#ef4444',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'background 0.2s ease',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
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