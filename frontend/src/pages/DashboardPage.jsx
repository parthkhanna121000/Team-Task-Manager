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

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />
      <main className="wrap">
        {/* Breadcrumb */}
        <div style={{ marginBottom: 16 }}>
          <Link
            to={`/projects/${projectId}`}
            style={{
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: 11,
              color: 'var(--txt-3)',
              letterSpacing: '0.04em',
              transition: 'color 120ms',
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--amber-text)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--txt-3)'}
          >
            ← board
          </Link>
        </div>

        {/* Header */}
        <div style={{
          marginBottom: 26,
          paddingBottom: 18,
          borderBottom: '1px solid var(--border)',
        }}>
          <p style={{
            fontFamily: 'IBM Plex Mono, monospace',
            fontSize: 10,
            color: 'var(--txt-3)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginBottom: 4,
          }}>
            {project?.name}
          </p>
          <h1 style={{
            fontSize: 20,
            fontWeight: 600,
            color: 'var(--txt)',
            letterSpacing: '-0.02em',
          }}>
            Dashboard
          </h1>
        </div>

        {loading ? (
          <div className="loading"><div className="spinner" /></div>
        ) : stats ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

            {/* Overview stats */}
            <section>
              <p style={{
                fontFamily: 'IBM Plex Mono, monospace',
                fontSize: 10,
                color: 'var(--txt-3)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginBottom: 12,
              }}>
                overview
              </p>
              <div className="stats-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 10,
              }}>
                <StatCard label="Total" value={stats.total} accent="var(--txt-2)" />
                <StatCard
                  label="To do"
                  value={stats.byStatus.todo}
                  sub={pct(stats.byStatus.todo, stats.total)}
                  accent="var(--txt-3)"
                />
                <StatCard
                  label="In progress"
                  value={stats.byStatus.in_progress}
                  sub={pct(stats.byStatus.in_progress, stats.total)}
                  accent="var(--teal)"
                />
                <StatCard
                  label="Done"
                  value={stats.byStatus.done}
                  sub={pct(stats.byStatus.done, stats.total)}
                  accent="var(--green)"
                />
              </div>
            </section>

            {/* Overdue */}
            <section>
              <p style={{
                fontFamily: 'IBM Plex Mono, monospace',
                fontSize: 10,
                color: 'var(--txt-3)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginBottom: 12,
              }}>
                attention
              </p>
              <div style={{ maxWidth: 220 }}>
                <StatCard
                  label="Overdue"
                  value={stats.overdue}
                  sub={stats.overdue > 0 ? 'needs attention' : 'all on track'}
                  accent={stats.overdue > 0 ? 'var(--red)' : 'var(--green)'}
                />
              </div>
            </section>

            {/* Per-member breakdown */}
            {stats.byUser.length > 0 && (
              <section>
                <p style={{
                  fontFamily: 'IBM Plex Mono, monospace',
                  fontSize: 10,
                  color: 'var(--txt-3)',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  marginBottom: 12,
                }}>
                  by member
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {stats.byUser.map((entry) => {
                    const percent = entry.count > 0
                      ? Math.round((entry.done / entry.count) * 100)
                      : 0;
                    return (
                      <div
                        key={entry._id}
                        style={{
                          background: 'var(--bg-2)',
                          border: '1px solid var(--border)',
                          borderRadius: 'var(--radius-lg)',
                          padding: '14px 18px',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{
                            width: 30,
                            height: 30,
                            borderRadius: '50%',
                            background: 'var(--bg-4)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 11,
                            fontWeight: 600,
                            color: 'var(--txt-2)',
                            fontFamily: 'IBM Plex Mono, monospace',
                            flexShrink: 0,
                          }}>
                            {entry.name[0].toUpperCase()}
                          </div>

                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'baseline',
                              marginBottom: 7,
                            }}>
                              <span style={{ fontSize: 13, fontWeight: 500 }}>{entry.name}</span>
                              <span style={{
                                fontSize: 11,
                                color: 'var(--txt-3)',
                                fontFamily: 'IBM Plex Mono, monospace',
                              }}>
                                {entry.done}/{entry.count}
                              </span>
                            </div>

                            {/* Progress track */}
                            <div style={{
                              height: 4,
                              background: 'var(--bg-4)',
                              borderRadius: 2,
                              overflow: 'hidden',
                            }}>
                              <div style={{
                                height: '100%',
                                width: `${percent}%`,
                                background: percent === 100
                                  ? 'var(--green)'
                                  : percent > 50
                                  ? 'var(--teal)'
                                  : 'var(--amber)',
                                borderRadius: 2,
                                transition: 'width 0.5s ease',
                              }} />
                            </div>
                          </div>

                          <span style={{
                            fontFamily: 'IBM Plex Mono, monospace',
                            fontSize: 14,
                            fontWeight: 500,
                            color: percent === 100 ? 'var(--green)' : 'var(--txt-2)',
                            minWidth: 36,
                            textAlign: 'right',
                          }}>
                            {percent}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {stats.byUser.length === 0 && (
              <div className="empty">
                <p>No tasks assigned yet.</p>
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

const pct = (val, total) =>
  total > 0 ? `${Math.round((val / total) * 100)}%` : '0%';

export default DashboardPage;