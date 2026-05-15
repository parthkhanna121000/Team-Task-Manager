import { useParams, Link } from 'react-router-dom';
import { useDashboard } from '../hooks/useTasks';
import { useProject } from '../hooks/useProjects';
import Navbar from '../components/Navbar';
import StatCard from '../components/StatCard';

const DashboardPage = () => {
  const { projectId } = useParams();
  const { project, loading: projLoading } = useProject(projectId);
  const { stats, loading: statsLoading } = useDashboard(projectId);
  const loading = projLoading || statsLoading;

  const pct = (val, total) =>
    total > 0 ? Math.round((val / total) * 100) : 0;

  return (
    <div className="page">
      <Navbar />
      <main className="container">

        {/* Breadcrumb */}
        <div style={{ marginBottom: 20 }}>
          <Link
            to={`/projects/${projectId}`}
            style={{
              fontSize: 13,
              color: 'var(--text-2)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              transition: 'color 150ms',
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--text-0)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-2)'}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to board
          </Link>
        </div>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <p style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 4 }}>
            {project?.name}
          </p>
          <h1 style={{
            fontSize: 20,
            fontWeight: 600,
            letterSpacing: '-0.03em',
            color: 'var(--text-0)',
          }}>
            Dashboard
          </h1>
        </div>

        {loading ? (
          <div className="loading"><div className="spinner" /></div>
        ) : stats ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

            {/* Stats row */}
            <section>
              <p style={{
                fontSize: 11,
                fontWeight: 500,
                color: 'var(--text-3)',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                marginBottom: 12,
              }}>
                Overview
              </p>
              <div className="stats-row">
                <StatCard
                  label="Total tasks"
                  value={stats.total}
                  accent="var(--text-1)"
                />
                <StatCard
                  label="To do"
                  value={stats.byStatus.todo}
                  sub={`${pct(stats.byStatus.todo, stats.total)}% of total`}
                  accent="var(--text-2)"
                />
                <StatCard
                  label="In progress"
                  value={stats.byStatus.in_progress}
                  sub={`${pct(stats.byStatus.in_progress, stats.total)}% of total`}
                  accent="var(--info)"
                />
                <StatCard
                  label="Completed"
                  value={stats.byStatus.done}
                  sub={`${pct(stats.byStatus.done, stats.total)}% of total`}
                  accent="var(--success)"
                />
              </div>
            </section>

            {/* Overdue */}
            <section>
              <p style={{
                fontSize: 11,
                fontWeight: 500,
                color: 'var(--text-3)',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                marginBottom: 12,
              }}>
                Attention needed
              </p>
              <div style={{ maxWidth: 240 }}>
                <StatCard
                  label="Overdue tasks"
                  value={stats.overdue}
                  sub={stats.overdue > 0 ? 'Requires immediate action' : 'Everything is on schedule'}
                  accent={stats.overdue > 0 ? 'var(--danger)' : 'var(--success)'}
                />
              </div>
            </section>

            {/* Per-member */}
            {stats.byUser.length > 0 && (
              <section>
                <p style={{
                  fontSize: 11,
                  fontWeight: 500,
                  color: 'var(--text-3)',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  marginBottom: 12,
                }}>
                  Team progress
                </p>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                  maxWidth: 640,
                }}>
                  {stats.byUser.map((entry) => {
                    const percent = entry.count > 0
                      ? Math.round((entry.done / entry.count) * 100)
                      : 0;
                    const barColor = percent === 100
                      ? 'var(--success)'
                      : percent > 60
                      ? 'var(--info)'
                      : percent > 30
                      ? 'var(--warning)'
                      : 'var(--danger)';

                    return (
                      <div
                        key={entry._id}
                        style={{
                          background: 'var(--surface-1)',
                          border: '1px solid var(--border-0)',
                          borderRadius: 'var(--r-lg)',
                          padding: '14px 18px',
                          transition: 'border-color 200ms',
                        }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-1)'}
                        onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-0)'}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            background: `hsl(${(entry.name.charCodeAt(0) * 20) % 360}, 55%, 25%)`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 12,
                            fontWeight: 700,
                            color: `hsl(${(entry.name.charCodeAt(0) * 20) % 360}, 70%, 72%)`,
                            flexShrink: 0,
                          }}>
                            {entry.name[0].toUpperCase()}
                          </div>

                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              marginBottom: 8,
                            }}>
                              <span style={{
                                fontSize: 13,
                                fontWeight: 500,
                                color: 'var(--text-0)',
                                letterSpacing: '-0.01em',
                              }}>
                                {entry.name}
                              </span>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <span style={{
                                  fontSize: 12,
                                  color: 'var(--text-2)',
                                }}>
                                  {entry.done}/{entry.count} tasks
                                </span>
                                <span style={{
                                  fontSize: 13,
                                  fontWeight: 600,
                                  color: barColor,
                                  fontFamily: 'JetBrains Mono, monospace',
                                  letterSpacing: '-0.02em',
                                }}>
                                  {percent}%
                                </span>
                              </div>
                            </div>

                            <div style={{
                              height: 4,
                              background: 'var(--surface-4)',
                              borderRadius: 100,
                              overflow: 'hidden',
                            }}>
                              <div style={{
                                height: '100%',
                                width: `${percent}%`,
                                background: barColor,
                                borderRadius: 100,
                                transition: 'width 0.6s cubic-bezier(0.16,1,0.3,1)',
                              }} />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {stats.byUser.length === 0 && (
              <div className="empty">
                <p>No tasks assigned yet</p>
                <span>Assign tasks to team members to see progress here.</span>
              </div>
            )}
          </div>
        ) : (
          <div className="empty"><p>No data available</p></div>
        )}
      </main>
    </div>
  );
};

export default DashboardPage;