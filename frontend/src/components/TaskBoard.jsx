import TaskCard from './TaskCard';

const COLUMNS = [
  { key: 'todo', label: 'To Do', color: '#64748b', bg: 'rgba(100, 116, 139, 0.1)' },
  { key: 'in_progress', label: 'In Progress', color: '#0ea5e9', bg: 'rgba(14, 165, 233, 0.1)' },
  { key: 'done', label: 'Done', color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
];

const TaskBoard = ({ tasks, role, currentUserId, onUpdateStatus, onDelete, onEdit }) => {
  const grouped = COLUMNS.reduce((acc, col) => {
    acc[col.key] = tasks.filter((t) => t.status === col.key);
    return acc;
  }, {});

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: 20,
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>
      {COLUMNS.map((col) => (
        <div
          key={col.key}
          style={{
            background: 'rgba(255, 255, 255, 0.6)',
            backdropFilter: 'blur(16px)',
            borderRadius: '24px',
            padding: '20px',
            border: '1px solid rgba(255, 255, 255, 0.8)',
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.02)',
          }}
        >
          {/* Column Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: 12,
            borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: col.color,
                boxShadow: `0 0 10px ${col.color}`,
              }} />
              <span style={{
                fontSize: '13px',
                fontWeight: '800',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: '#0f172a',
              }}>
                {col.label}
              </span>
            </div>

            <span style={{
              fontSize: '12px',
              fontWeight: '700',
              color: col.color,
              background: col.bg,
              padding: '2px 10px',
              borderRadius: '9999px',
            }}>
              {grouped[col.key].length}
            </span>
          </div>

          {/* Cards List Container */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, minHeight: '200px' }}>
            {grouped[col.key].length === 0 ? (
              <div style={{
                border: '2px dashed rgba(203, 213, 225, 0.6)',
                borderRadius: '18px',
                padding: '32px 20px',
                textAlign: 'center',
                color: '#94a3b8',
                fontSize: '13px',
                fontWeight: '600',
                background: 'rgba(255, 255, 255, 0.3)',
              }}>
                No tasks in {col.label.toLowerCase()}
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