import TaskCard from './TaskCard';

const COLUMNS = [
  {
    key: 'todo',
    label: 'To Do',
    color: 'var(--text-2)',
    accent: 'var(--surface-5)',
  },
  {
    key: 'in_progress',
    label: 'In Progress',
    color: 'var(--info)',
    accent: 'var(--info-dim)',
  },
  {
    key: 'done',
    label: 'Done',
    color: 'var(--success)',
    accent: 'var(--success-dim)',
  },
];

const TaskBoard = ({ tasks, role, currentUserId, onUpdateStatus, onDelete, onEdit }) => {
  const grouped = COLUMNS.reduce((acc, col) => {
    acc[col.key] = tasks.filter((t) => t.status === col.key);
    return acc;
  }, {});

  return (
    <div className="kanban">
      {COLUMNS.map((col) => (
        <div key={col.key} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {/* Column header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 14px',
            background: col.accent,
            borderRadius: 'var(--r-md)',
            border: '1px solid var(--border-0)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: col.color,
                boxShadow: `0 0 5px ${col.color}`,
              }} />
              <span style={{
                fontSize: 12,
                fontWeight: 600,
                color: col.color,
                letterSpacing: '0.02em',
                textTransform: 'uppercase',
              }}>
                {col.label}
              </span>
            </div>
            <span style={{
              fontSize: 11,
              fontWeight: 600,
              fontFamily: 'JetBrains Mono, monospace',
              color: col.color,
              opacity: 0.7,
            }}>
              {grouped[col.key].length}
            </span>
          </div>

          {/* Task cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {grouped[col.key].length === 0 ? (
              <div style={{
                border: '1px dashed var(--border-1)',
                borderRadius: 'var(--r-lg)',
                padding: '24px 16px',
                textAlign: 'center',
                color: 'var(--text-3)',
                fontSize: 13,
              }}>
                No tasks
              </div>
            ) : (
              grouped[col.key].map((task) => (
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
        </div>
      ))}
    </div>
  );
};

export default TaskBoard;