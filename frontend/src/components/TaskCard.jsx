import React from 'react';
import { format, isPast } from 'date-fns';

const STATUS_LABELS = {
  todo: 'To Do',
  in_progress: 'In Progress',
  done: 'Done',
};

const PRIORITY_CONFIG = {
  low: {
    label: 'Low',
    color: '#10b981',
    bg: 'rgba(16, 185, 129, 0.12)',
    border: 'rgba(16, 185, 129, 0.3)',
  },
  medium: {
    label: 'Medium',
    color: '#f59e0b',
    bg: 'rgba(245, 158, 11, 0.12)',
    border: 'rgba(245, 158, 11, 0.3)',
  },
  high: {
    label: 'High',
    color: '#f43f5e',
    bg: 'rgba(244, 63, 94, 0.12)',
    border: 'rgba(244, 63, 94, 0.35)',
  },
};

const TaskCard = ({ task, role, currentUserId, onUpdateStatus, onDelete, onEdit }) => {
  if (!task) return null;

  const isOverdue = task.dueDate && isPast(new Date(task.dueDate)) && task.status !== 'done';
  const canEdit = role === 'admin' || task.assignedTo?._id === currentUserId;
  const isDone = task.status === 'done';

  const priority = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;
  const assigneeInitials = task.assignedTo?.name
    ? task.assignedTo.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : null;

  const nextStatus = {
    todo: 'in_progress',
    in_progress: 'done',
    done: null,
  };

  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', task._id);
    e.dataTransfer.effectAllowed = 'move';
    e.currentTarget.style.opacity = '0.4';
  };

  const handleDragEnd = (e) => {
    e.currentTarget.style.opacity = '1';
  };

  return (
    <div
      draggable={canEdit}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      style={{
        background: '#0c1017',
        border: `1px solid ${isOverdue ? 'rgba(244, 63, 94, 0.5)' : '#1e293b'}`,
        borderRadius: '16px',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        position: 'relative',
        overflow: 'hidden',
        boxSizing: 'border-box',
        cursor: canEdit ? 'grab' : 'default',
        userSelect: 'none',
        transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.borderColor = isOverdue ? '#f43f5e' : '#38bdf8';
        e.currentTarget.style.boxShadow = `0 12px 24px -8px rgba(0, 0, 0, 0.9), 0 0 16px ${
          isOverdue ? 'rgba(244, 63, 94, 0.15)' : 'rgba(56, 189, 248, 0.15)'
        }`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.borderColor = isOverdue ? 'rgba(244, 63, 94, 0.5)' : '#1e293b';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {isOverdue && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '2.5px',
            background: '#f43f5e',
            boxShadow: '0 0 8px #f43f5e',
          }}
        />
      )}

      {/* Header Row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', flex: 1 }}>
          {canEdit && (
            <span style={{ color: '#475569', fontSize: '13px', lineHeight: 1.4, cursor: 'grab' }}>
              ⋮⋮
            </span>
          )}
          <h4
            style={{
              fontSize: '14px',
              fontWeight: '700',
              color: isDone ? '#71717a' : '#ededed',
              lineHeight: 1.4,
              textDecoration: isDone ? 'line-through' : 'none',
              margin: 0,
              letterSpacing: '-0.01em',
            }}
          >
            {task.title}
          </h4>
        </div>

        <span
          style={{
            fontSize: '10px',
            fontWeight: '800',
            color: priority.color,
            background: priority.bg,
            border: `1px solid ${priority.border}`,
            padding: '2px 8px',
            borderRadius: '9999px',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            flexShrink: 0,
          }}
        >
          {priority.label}
        </span>
      </div>

      {/* Description */}
      {task.description && (
        <p style={{ color: '#94a3b8', fontSize: '12px', lineHeight: 1.5, margin: 0, fontWeight: '500' }}>
          {task.description.length > 85 ? `${task.description.slice(0, 85)}...` : task.description}
        </p>
      )}

      {/* Meta */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
        {task.assignedTo && (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: '#121215',
              border: '1px solid #27272a',
              padding: '2px 8px 2px 4px',
              borderRadius: '9999px',
            }}
          >
            <div
              style={{
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #0284c7, #38bdf8)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '9px',
                fontWeight: '800',
              }}
            >
              {assigneeInitials}
            </div>
            <span style={{ fontSize: '11px', color: '#cbd5e1', fontWeight: '600' }}>
              {task.assignedTo.name?.split(' ')[0] || 'User'}
            </span>
          </div>
        )}

        {task.dueDate && (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '11px',
              fontWeight: '700',
              color: isOverdue ? '#f43f5e' : '#a1a1aa',
              background: isOverdue ? 'rgba(244, 63, 94, 0.12)' : '#121215',
              border: `1px solid ${isOverdue ? 'rgba(244, 63, 94, 0.35)' : '#27272a'}`,
              padding: '2px 8px',
              borderRadius: '9999px',
            }}
          >
            <span style={{ fontSize: '10px' }}>{isOverdue ? '⚠️' : '📅'}</span>
            <span>{isOverdue ? 'Overdue: ' : ''}{format(new Date(task.dueDate), 'MMM d')}</span>
          </div>
        )}
      </div>

      {/* Action Footer */}
      {canEdit && (
        <div
          style={{
            display: 'flex',
            gap: '6px',
            paddingTop: '8px',
            borderTop: '1px solid #18181b',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {nextStatus[task.status] ? (
            <button
              onClick={() => onUpdateStatus(task._id, nextStatus[task.status])}
              style={{
                padding: '6px 10px',
                background: '#18181b',
                color: '#ededed',
                border: '1px solid #27272a',
                borderRadius: '8px',
                fontSize: '11px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#38bdf8';
                e.currentTarget.style.color = '#38bdf8';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#27272a';
                e.currentTarget.style.color = '#ededed';
              }}
            >
              <span>{STATUS_LABELS[nextStatus[task.status]]}</span>
              <span>→</span>
            </button>
          ) : (
            <span style={{ fontSize: '11px', color: '#10b981', fontWeight: '700' }}>✓ Completed</span>
          )}

          <div style={{ display: 'flex', gap: '6px' }}>
            {role === 'admin' && (
              <>
                <button
                  onClick={() => onEdit(task)}
                  style={{
                    padding: '6px 10px',
                    background: 'rgba(56, 189, 248, 0.1)',
                    color: '#38bdf8',
                    border: '1px solid rgba(56, 189, 248, 0.25)',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontWeight: '700',
                    cursor: 'pointer',
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(task._id)}
                  title="Delete Task"
                  style={{
                    padding: '6px 8px',
                    background: 'rgba(244, 63, 94, 0.08)',
                    color: '#f43f5e',
                    border: '1px solid rgba(244, 63, 94, 0.25)',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontWeight: '700',
                    cursor: 'pointer',
                  }}
                >
                  ✕
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskCard;