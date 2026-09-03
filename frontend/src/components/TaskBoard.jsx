import React, { useState } from 'react';
import TaskCard from './TaskCard';

const COLUMNS = [
  {
    key: 'todo',
    label: 'To Do',
    color: '#f59e0b',
    borderGlow: 'rgba(245, 158, 11, 0.35)',
    bg: 'rgba(245, 158, 11, 0.12)',
    indicator: '🟡',
    wipLimit: null, // No limit for backlog
  },
  {
    key: 'in_progress',
    label: 'In Progress',
    color: '#38bdf8',
    borderGlow: 'rgba(56, 189, 248, 0.35)',
    bg: 'rgba(56, 189, 248, 0.12)',
    indicator: '⚡',
    wipLimit: 3, // Flag if more than 3 tasks are in flight
  },
  {
    key: 'done',
    label: 'Done',
    color: '#10b981',
    borderGlow: 'rgba(16, 185, 129, 0.35)',
    bg: 'rgba(16, 185, 129, 0.12)',
    indicator: '✅',
    wipLimit: null,
  },
];

const TaskBoard = ({
  tasks = [],
  role,
  currentUserId,
  onUpdateStatus,
  onDelete,
  onEdit,
  onCreateTask,
}) => {
  const [dragOverCol, setDragOverCol] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [onlyMyTasks, setOnlyMyTasks] = useState(false);

  // Quick Inline Task States
  const [activeQuickCol, setActiveQuickCol] = useState(null);
  const [quickTitle, setQuickTitle] = useState('');
  const [quickCreating, setQuickCreating] = useState(false);

  const safeTasks = Array.isArray(tasks) ? tasks : [];

  const filteredTasks = safeTasks.filter((t) => {
    if (!t) return false;
    const titleMatch = t.title ? t.title.toLowerCase().includes(searchQuery.toLowerCase()) : false;
    const descMatch = t.description ? t.description.toLowerCase().includes(searchQuery.toLowerCase()) : false;
    const matchesSearch = titleMatch || descMatch;
    const matchesPriority = priorityFilter === 'all' || t.priority === priorityFilter;
    const matchesAssignee = onlyMyTasks ? t.assignedTo?._id === currentUserId : true;
    return matchesSearch && matchesPriority && matchesAssignee;
  });

  const grouped = COLUMNS.reduce((acc, col) => {
    acc[col.key] = filteredTasks.filter((t) => t?.status === col.key);
    return acc;
  }, {});

  const handleDragOver = (e, colKey) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverCol !== colKey) {
      setDragOverCol(colKey);
    }
  };

  const handleDragLeave = (e) => {
    if (e.currentTarget.contains(e.relatedTarget)) return;
    setDragOverCol(null);
  };

  const handleDrop = async (e, targetStatus) => {
    e.preventDefault();
    setDragOverCol(null);
    const taskId = e.dataTransfer.getData('text/plain');
    if (!taskId) return;

    const draggedTask = safeTasks.find((t) => t._id === taskId);
    if (draggedTask && draggedTask.status !== targetStatus) {
      await onUpdateStatus(taskId, targetStatus);
    }
  };

  const handleQuickSubmit = async (statusKey) => {
    if (!quickTitle.trim() || quickCreating) return;
    setQuickCreating(true);
    try {
      if (onCreateTask) {
        await onCreateTask({
          title: quickTitle.trim(),
          status: statusKey,
          priority: 'medium',
        });
      }
      setQuickTitle('');
      setActiveQuickCol(null);
    } finally {
      setQuickCreating(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', fontFamily: 'inherit' }}>
      {/* Real-time Filter & Search Toolbar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px',
          background: '#09090b',
          border: '1px solid #1e293b',
          borderRadius: '16px',
          padding: '12px 16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="🔍 Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              padding: '8px 14px',
              background: '#000000',
              border: '1px solid #27272a',
              borderRadius: '10px',
              fontSize: '13px',
              color: '#ededed',
              outline: 'none',
              minWidth: '220px',
            }}
          />

          <div style={{ display: 'flex', gap: '6px' }}>
            {['all', 'high', 'medium', 'low'].map((p) => {
              const active = priorityFilter === p;
              return (
                <button
                  key={p}
                  onClick={() => setPriorityFilter(p)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '11.5px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    border: `1px solid ${active ? '#38bdf8' : '#27272a'}`,
                    background: active ? '#18181b' : '#000000',
                    color: active ? '#ffffff' : '#71717a',
                    textTransform: 'capitalize',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {p === 'all' ? 'All Priorities' : p}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => setOnlyMyTasks(!onlyMyTasks)}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '11.5px',
              fontWeight: '700',
              cursor: 'pointer',
              border: `1px solid ${onlyMyTasks ? '#38bdf8' : '#27272a'}`,
              background: onlyMyTasks ? '#18181b' : '#000000',
              color: onlyMyTasks ? '#ffffff' : '#71717a',
              transition: 'all 0.2s ease',
            }}
          >
            👤 My Assigned Tasks
          </button>

          {(searchQuery || priorityFilter !== 'all' || onlyMyTasks) && (
            <button
              onClick={() => {
                setSearchQuery('');
                setPriorityFilter('all');
                setOnlyMyTasks(false);
              }}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#f43f5e',
                fontSize: '11px',
                fontWeight: '700',
                cursor: 'pointer',
                padding: '4px 8px',
              }}
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Kanban Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))',
          gap: '20px',
          alignItems: 'start',
        }}
      >
        {COLUMNS.map((col) => {
          const columnTasks = grouped[col.key] || [];
          const isOver = dragOverCol === col.key;
          const isWipExceeded = col.wipLimit && columnTasks.length > col.wipLimit;

          return (
            <div
              key={col.key}
              onDragOver={(e) => handleDragOver(e, col.key)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, col.key)}
              style={{
                background: isOver ? 'rgba(12, 18, 30, 0.95)' : '#09090b',
                border: `1px solid ${
                  isWipExceeded ? 'rgba(244, 63, 94, 0.7)' : isOver ? '#38bdf8' : '#1e293b'
                }`,
                borderRadius: '20px',
                padding: '18px 18px 20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: isWipExceeded
                  ? '0 0 25px rgba(244, 63, 94, 0.2)'
                  : isOver
                  ? '0 0 25px rgba(56, 189, 248, 0.25)'
                  : '0 16px 36px -12px rgba(0, 0, 0, 0.85)',
                transition: 'all 0.2s ease',
              }}
            >
              {/* Top Accent Stripe */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '2px',
                  background: isWipExceeded
                    ? '#f43f5e'
                    : `linear-gradient(90deg, ${col.color} 0%, transparent 100%)`,
                }}
              />

              {/* Column Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingBottom: '12px',
                  borderBottom: '1px solid #18181b',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    style={{
                      width: '7px',
                      height: '7px',
                      borderRadius: '50%',
                      backgroundColor: isWipExceeded ? '#f43f5e' : col.color,
                      boxShadow: `0 0 10px ${isWipExceeded ? '#f43f5e' : col.color}`,
                    }}
                  />
                  <span
                    style={{
                      fontSize: '13px',
                      fontWeight: '800',
                      textTransform: 'uppercase',
                      letterSpacing: '0.07em',
                      color: isWipExceeded ? '#f43f5e' : '#ededed',
                    }}
                  >
                    {col.label}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {col.wipLimit && (
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: '800',
                        color: isWipExceeded ? '#f43f5e' : '#71717a',
                        background: isWipExceeded ? 'rgba(244, 63, 94, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                        border: `1px solid ${isWipExceeded ? 'rgba(244, 63, 94, 0.3)' : '#27272a'}`,
                        padding: '2px 6px',
                        borderRadius: '6px',
                      }}
                    >
                      MAX: {col.wipLimit}
                    </span>
                  )}
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: '800',
                      color: isWipExceeded ? '#f43f5e' : col.color,
                      background: col.bg,
                      border: `1px solid ${isWipExceeded ? 'rgba(244, 63, 94, 0.4)' : col.borderGlow}`,
                      padding: '2px 9px',
                      borderRadius: '9999px',
                    }}
                  >
                    {columnTasks.length}
                  </span>
                </div>
              </div>

              {/* Cards Container */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minHeight: '180px' }}>
                {columnTasks.length === 0 ? (
                  <div
                    style={{
                      border: '1px dashed #27272a',
                      borderRadius: '16px',
                      padding: '36px 18px',
                      textAlign: 'center',
                      color: '#52525b',
                      background: 'rgba(0, 0, 0, 0.35)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      height: '100%',
                      minHeight: '140px',
                    }}
                  >
                    <span style={{ fontSize: '18px', opacity: 0.6 }}>{col.indicator}</span>
                    <span style={{ fontSize: '12px', fontWeight: '600', color: '#71717a' }}>
                      {isOver ? 'Drop task here' : `No ${col.label.toLowerCase()} tasks`}
                    </span>
                  </div>
                ) : (
                  columnTasks.map((task) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      role={role}
                      currentUserId={currentUserId}
                      onUpdateStatus={onUpdateStatus}
                      onDelete={onDelete}
                      onEdit={onEdit}
                    />
                  ))
                )}
              </div>

              {/* Inline Quick Add Footer */}
              {role === 'admin' && (
                <div style={{ marginTop: 'auto', paddingTop: '8px' }}>
                  {activeQuickCol === col.key ? (
                    <div
                      style={{
                        background: '#000000',
                        border: '1px solid #27272a',
                        borderRadius: '12px',
                        padding: '10px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                      }}
                    >
                      <input
                        type="text"
                        placeholder="Task title... (press Enter)"
                        value={quickTitle}
                        autoFocus
                        disabled={quickCreating}
                        onChange={(e) => setQuickTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleQuickSubmit(col.key);
                          if (e.key === 'Escape') {
                            setActiveQuickCol(null);
                            setQuickTitle('');
                          }
                        }}
                        style={{
                          width: '100%',
                          background: 'transparent',
                          border: 'none',
                          color: '#ededed',
                          fontSize: '13px',
                          outline: 'none',
                          boxSizing: 'border-box',
                        }}
                      />
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                        <button
                          onClick={() => {
                            setActiveQuickCol(null);
                            setQuickTitle('');
                          }}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#71717a',
                            fontSize: '11px',
                            fontWeight: '700',
                            cursor: 'pointer',
                            padding: '4px 8px',
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleQuickSubmit(col.key)}
                          disabled={quickCreating || !quickTitle.trim()}
                          style={{
                            background: '#38bdf8',
                            color: '#000000',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontWeight: '800',
                            padding: '4px 10px',
                            cursor: 'pointer',
                          }}
                        >
                          {quickCreating ? '...' : 'Add'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setActiveQuickCol(col.key);
                        setQuickTitle('');
                      }}
                      style={{
                        width: '100%',
                        padding: '8px',
                        background: 'transparent',
                        border: '1px dashed #27272a',
                        borderRadius: '12px',
                        color: '#71717a',
                        fontSize: '12px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = col.color;
                        e.currentTarget.style.color = col.color;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#27272a';
                        e.currentTarget.style.color = '#71717a';
                      }}
                    >
                      <span>+</span>
                      <span>Quick Add</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TaskBoard;