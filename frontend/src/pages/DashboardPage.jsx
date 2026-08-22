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
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
      position: 'relative',
      overflowX: 'hidden',
    }}>
      {/* Background Glowing Ambient Orbs */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        left: '-5%',
        width: '500px',
        height: '500px',
        background: 'rgba(255, 154, 201, 0.35)',
        borderRadius: '50%',
        filter: 'blur(90px)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-10%',
        right: '-5%',
        width: '500px',
        height: '500px',
        background: 'rgba(116, 235, 213, 0.35)',
        borderRadius: '50%',
        filter: 'blur(90px)',
        pointerEvents: 'none',
      }} />

      <Navbar />

      <main className="wrap" style={{ position: 'relative', zIndex: 1, paddingBottom: '60px' }}>
        
        {/* Breadcrumb with Glass Pill Effect */}
        <div style={{ marginBottom: 20 }}>
          <Link
            to={`/projects/${projectId}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              background: 'rgba(255, 255, 255, 0.6)',
              backdropFilter: 'blur(12px)',
              borderRadius: '9999px',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontSize: '12px',
              fontWeight: '600',
              color: '#475569',
              textDecoration: 'none',
              border: '1px solid rgba(255, 255, 255, 0.8)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)';
              e.currentTarget.style.color = '#0f172a';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.6)';
              e.currentTarget.style.color = '#475569';
            }}
          >
            ← Back to Board
          </Link>
        </div>

        {/* Glassmorphic Header Card */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.75)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          padding: '24px 32px',
          border: '1px solid rgba(255, 255, 255, 0.9)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.04)',
          marginBottom: 32,
        }}>
          <p style={{
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontSize: '11px',
            fontWeight: '700',
            color: '#64748b',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '6px',
          }}>
            {project?.name || 'Project Overview'}
          </p>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '800',
            color: '#0f172a',
            letterSpacing: '-0.03em',
            margin: 0,
          }}>
            Dashboard & Analytics
          </h1>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
            <div className="spinner" style={{ width: '40px', height: '40px', border: '4px solid rgba(255,255,255,0.4)', borderTopColor: '#0f172a', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          </div>
        ) : stats ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

            {/* Overview stats */}
            <section>
              <div style={{
                fontFamily: 'system-ui, -apple-system, sans-serif',
                fontSize: '12px',
                fontWeight: '700',
                color: '#475569',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: '14px',
                paddingLeft: '4px',
              }}>
                Overview Metrics
              </div>
              <div className="stats-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: 16,
              }}>
                <div style={glassCardStyle}>
                  <StatCard label="Total Tasks" value={stats.total} accent="#0f172a" />
                </div>
                <div style={glassCardStyle}>
                  <StatCard label="To Do" value={stats.byStatus.todo} sub={pct(stats.byStatus.todo, stats.total)} accent="#64748b" />
                </div>
                <div style={glassCardStyle}>
                  <StatCard label="In Progress" value={stats.byStatus.in_progress} sub={pct(stats.byStatus.in_progress, stats.total)} accent="#0ea5e9" />
                </div>
                <div style={glassCardStyle}>
                  <StatCard label="Completed" value={stats.byStatus.done} sub={pct(stats.byStatus.done, stats.total)} accent="#10b981" />
                </div>
              </div>
            </section>

            {/* Overdue Section */}
            <section>
              <div style={{
                fontFamily: 'system-ui, -apple-system, sans-serif',
                fontSize: '12px',
                fontWeight: '700',
                color: '#475569',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: '14px',
                paddingLeft: '4px',
              }}>
                Attention Required
              </div>
              <div style={{ maxWidth: '280px' }}>
                <div style={glassCardStyle}>
                  <StatCard
                    label="Overdue Tasks"
                    value={stats.overdue}
                    sub={stats.overdue > 0 ? 'needs immediate attention' : 'all items on track'}
                    accent={stats.overdue > 0 ? '#ef4444' : '#10b981'}
                  />
                </div>
              </div>
            </section>

            {/* Per-member breakdown */}
            {stats.byUser.length > 0 && (
              <section>
                <div style={{
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  fontSize: '12px',
                  fontWeight: '700',
                  color: '#475569',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  marginBottom: '14px',
                  paddingLeft: '4px',
                }}>
                  Performance By Member
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {stats.byUser.map((entry) => {
                    const percent = entry.count > 0
                      ? Math.round((entry.done / entry.count) * 100)
                      : 0;
                    return (
                      <div
                        key={entry._id}
                        style={{
                          background: 'rgba(255, 255, 255, 0.75)',
                          backdropFilter: 'blur(20px)',
                          border: '1px solid rgba(255, 255, 255, 0.9)',
                          borderRadius: '20px',
                          padding: '18px 24px',
                          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.03)',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                          <div style={{
                            width: 38,
                            height: 38,
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 13,
                            fontWeight: 700,
                            color: '#ffffff',
                            flexShrink: 0,
                            boxShadow: '0 4px 10px rgba(99, 102, 241, 0.3)',
                          }}>
                            {entry.name[0].toUpperCase()}
                          </div>

                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'baseline',
                              marginBottom: 8,
                            }}>
                              <span style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>{entry.name}</span>
                              <span style={{
                                fontSize: '12px',
                                fontWeight: '600',
                                color: '#64748b',
                              }}>
                                {entry.done} / {entry.count} completed
                              </span>
                            </div>

                            {/* Progress track */}
                            <div style={{
                              height: 6,
                              background: 'rgba(226, 232, 240, 0.8)',
                              borderRadius: 3,
                              overflow: 'hidden',
                            }}>
                              <div style={{
                                height: '100%',
                                width: `${percent}%`,
                                background: percent === 100
                                  ? '#10b981'
                                  : percent > 50
                                  ? '#0ea5e9'
                                  : '#6366f1',
                                borderRadius: 3,
                                transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                              }} />
                            </div>
                          </div>

                          <span style={{
                            fontSize: '15px',
                            fontWeight: '800',
                            color: percent === 100 ? '#10b981' : '#0f172a',
                            minWidth: 48,
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
              <div style={{
                background: 'rgba(255, 255, 255, 0.6)',
                backdropFilter: 'blur(20px)',
                borderRadius: '24px',
                padding: '40px',
                textAlign: 'center',
                border: '1px solid rgba(255, 255, 255, 0.8)',
              }}>
                <p style={{ color: '#64748b', fontSize: '14px', fontWeight: '500', margin: 0 }}>No tasks assigned to team members yet.</p>
              </div>
            )}
          </div>
        ) : (
          <div style={{
            background: 'rgba(255, 255, 255, 0.6)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            padding: '40px',
            textAlign: 'center',
            border: '1px solid rgba(255, 255, 255, 0.8)',
          }}>
            <p style={{ color: '#64748b', fontSize: '14px', fontWeight: '500', margin: 0 }}>No statistical data available for this project.</p>
          </div>
        )}
      </main>
    </div>
  );
};

const glassCardStyle = {
  background: 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.9)',
  borderRadius: '20px',
  padding: '20px',
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.03)',
};

const pct = (val, total) =>
  total > 0 ? `${Math.round((val / total) * 100)}%` : '0%';

export default DashboardPage;