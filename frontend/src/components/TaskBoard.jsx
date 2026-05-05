import TaskCard from './TaskCard';

const COLUMNS = [
  { key: 'todo', label: 'To Do', mono: 'todo', borderColor: 'var(--border-2)' },
  { key: 'in_progress', label: 'In Progress', mono: 'in_progress', borderColor: 'var(--teal)' },
  { key: 'done', label: 'Done', mono: 'done', borderColor: 'var(--green)' },
];

const TaskBoard = ({ tasks, role, currentUserId, onUpdateStatus, onDelete, onEdit }) => {
  const grouped = COLUMNS.reduce((acc, col) => {
    acc[col.key] = tasks.filter((t) => t.status === col.key);
    return acc;
  }, {});

  return (
    <div className="kanban" style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 16,
    }}>
      {COLUMNS.map((col) => (
        <div key={col.key}>
          {/* Column header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 12,
            paddingBottom: 10,
            borderBottom: `1px solid ${col.borderColor}`,
          }}>
            <span style={{
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: 11,
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: col.borderColor === 'var(--border-2)' ? 'var(--txt-3)' : col.borderColor,
            }}>
              {col.label}
            </span>
            <span style={{
              marginLeft: 'auto',
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: 11,
              color: 'var(--txt-3)',
              background: 'var(--bg-3)',
              padding: '1px 8px',
              borderRadius: 2,
              border: '1px solid var(--border)',
            }}>
              {grouped[col.key].length}
            </span>
          </div>

          {/* Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {grouped[col.key].length === 0 ? (
              <div style={{
                border: '1px dashed var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: '20px',
                textAlign: 'center',
                color: 'var(--txt-3)',
                fontSize: 12,
                fontFamily: 'IBM Plex Mono, monospace',
              }}>
                empty
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