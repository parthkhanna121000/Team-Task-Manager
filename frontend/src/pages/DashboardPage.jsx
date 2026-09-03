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
    <>
      <style>
        {`
          /* Full Viewport Reset */
          html, body, #root {
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            min-height: 100% !important;
            background-color: #000000 !important;
            box-sizing: border-box;
          }

          *, *::before, *::after {
            box-sizing: inherit;
          }

          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(12px); }
            to { opacity: 1; transform: translateY(0); }
          }

          @keyframes spin {
            to { transform: rotate(360deg); }
          }

          .dashboard-container {
            animation: fadeIn 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }

          /* Obsidian Card Bases */
          .obsidian-card {
            background: #09090b;
            border: 1px solid #1e293b;
            border-radius: 20px;
            transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
            position: relative;
            overflow: hidden;
          }

          .obsidian-card:hover {
            transform: translateY(-3px);
          }

          /* Neon Glow Hover Accents */
          .glow-pink:hover {
            border-color: rgba(244, 63, 94, 0.5);
            box-shadow: 0 12px 32px -10px rgba(244, 63, 94, 0.25);
          }

          .glow-blue:hover {
            border-color: rgba(56, 189, 248, 0.5);
            box-shadow: 0 12px 32px -10px rgba(56, 189, 248, 0.25);
          }

          .glow-yellow:hover {
            border-color: rgba(245, 158, 11, 0.5);
            box-shadow: 0 12px 32px -10px rgba(245, 158, 11, 0.25);
          }

          .glow-green:hover {
            border-color: rgba(16, 185, 129, 0.5);
            box-shadow: 0 12px 32px -10px rgba(16, 185, 129, 0.25);
          }

          /* Interactive Back Button */
          .btn-back-nav {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 8px 18px;
            background: #09090b;
            border-radius: 9999px;
            font-size: 12px;
            font-weight: 700;
            color: #94a3b8;
            text-decoration: none;
            border: 1px solid #1e293b;
            transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          }

          .btn-back-nav:hover {
            border-color: #38bdf8;
            color: #ffffff;
            transform: translateX(-3px);
            box-shadow: 0 0 18px rgba(56, 189, 248, 0.2);
          }

          /* Member Row Hover Transition */
          .member-row {
            background: #09090b;
            border: 1px solid #1e293b;
            border-radius: 18px;
            padding: 18px 24px;
            transition: all 0.2s ease;
          }

          .member-row:hover {
            border-color: #334155;
            background: #0d121c;
            transform: translateX(3px);
          }
        `}
      </style>

      <div style={{
        minHeight: '100vh',
        width: '100vw',
        background: '#000000',
        backgroundImage: `
          radial-gradient(circle at 10% 8%, rgba(244, 63, 94, 0.08) 0%, transparent 40%),
          radial-gradient(circle at 85% 12%, rgba(56, 189, 248, 0.09) 0%, transparent 45%),
          radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.06) 0%, transparent 50%),
          linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)
        `,
        backgroundSize: '100% 100%, 100% 100%, 100% 100%, 48px 48px, 48px 48px',
        position: 'relative',
        overflowX: 'hidden',
        color: '#f8fafc',
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', 'SF Pro Display', Roboto, sans-serif",
      }}>
        <Navbar />

        <main className="wrap dashboard-container" style={{
          position: 'relative',
          zIndex: 1,
          paddingBottom: '80px',
          maxWidth: '1200px',
          margin: '0 auto',
          paddingLeft: '24px',
          paddingRight: '24px',
          paddingTop: '32px'
        }}>
          
          {/* Breadcrumb Navigation Pill */}
          <div style={{ marginBottom: 24 }}>
            <Link to={`/projects/${projectId}`} className="btn-back-nav">
              <span style={{ fontSize: '14px', lineHeight: 1 }}>←</span>
              <span>Back to Kanban Board</span>
            </Link>
          </div>

          {/* Obsidian Header Card with Neon Multi-Color Border Accent */}
          <div style={{
            background: 'linear-gradient(145deg, #09090b 0%, #0c121e 100%)',
            borderRadius: '24px',
            padding: '36px',
            border: '1px solid #1e293b',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 30px rgba(56, 189, 248, 0.05)',
            marginBottom: 36,
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Top Glowing Trim */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '2px',
              background: 'linear-gradient(90deg, #f43f5e 0%, #38bdf8 35%, #f59e0b 70%, #10b981 100%)'
            }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <span style={{
                fontSize: '11px',
                fontWeight: '800',
                color: '#38bdf8',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                background: 'rgba(56, 189, 248, 0.1)',
                padding: '3px 10px',
                borderRadius: '6px',
                border: '1px solid rgba(56, 189, 248, 0.2)'
              }}>
                {project?.name || 'Project Telemetry'}
              </span>
              <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#64748b' }} />
              <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>Live Performance Feed</span>
            </div>

            <h1 style={{
              fontSize: '32px',
              fontWeight: '900',
              color: '#ffffff',
              letterSpacing: '-0.03em',
              margin: 0,
            }}>
              Dashboard & Analytics
            </h1>
          </div>

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '100px 0', gap: 16 }}>
              <div style={{
                width: '42px',
                height: '42px',
                border: '3px solid #1e293b',
                borderTopColor: '#38bdf8',
                borderRadius: '50%',
                animation: 'spin 0.7s linear infinite'
              }} />
              <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '600', letterSpacing: '0.04em' }}>
                AGGREGATING SPRINT STATS...
              </span>
            </div>
          ) : stats ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>

              {/* 1. Overview Metric Stats */}
              <section>
                <div style={{
                  fontSize: '12px',
                  fontWeight: '800',
                  color: '#94a3b8',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#38bdf8' }} />
                  <span>Overview Metrics</span>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
                  gap: 18,
                }}>
                  {/* Total Tasks - Clean Silver/White */}
                  <div className="obsidian-card glow-blue" style={{ padding: '22px' }}>
                    <StatCard label="Total Tasks" value={stats.total} accent="#f8fafc" />
                  </div>

                  {/* To Do - Amber/Yellow */}
                  <div className="obsidian-card glow-yellow" style={{ padding: '22px' }}>
                    <StatCard 
                      label="To Do" 
                      value={stats.byStatus.todo} 
                      sub={pct(stats.byStatus.todo, stats.total)} 
                      accent="#f59e0b" 
                    />
                  </div>

                  {/* In Progress - Electric Cyan/Blue */}
                  <div className="obsidian-card glow-blue" style={{ padding: '22px' }}>
                    <StatCard 
                      label="In Progress" 
                      value={stats.byStatus.in_progress} 
                      sub={pct(stats.byStatus.in_progress, stats.total)} 
                      accent="#38bdf8" 
                    />
                  </div>

                  {/* Completed - Neon Emerald/Green */}
                  <div className="obsidian-card glow-green" style={{ padding: '22px' }}>
                    <StatCard 
                      label="Completed" 
                      value={stats.byStatus.done} 
                      sub={pct(stats.byStatus.done, stats.total)} 
                      accent="#10b981" 
                    />
                  </div>
                </div>
              </section>

              {/* 2. Overdue Section - Neon Pink Alert */}
              <section>
                <div style={{
                  fontSize: '12px',
                  fontWeight: '800',
                  color: '#94a3b8',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#f43f5e' }} />
                  <span>Attention Required</span>
                </div>

                <div style={{ maxWidth: '340px' }}>
                  <div className={`obsidian-card ${stats.overdue > 0 ? 'glow-pink' : 'glow-green'}`} style={{
                    padding: '22px',
                    borderColor: stats.overdue > 0 ? 'rgba(244, 63, 94, 0.4)' : '#1e293b'
                  }}>
                    <StatCard
                      label="Overdue Tasks"
                      value={stats.overdue}
                      sub={stats.overdue > 0 ? 'Bottleneck: Immediate action required' : 'All sprint deliverables on schedule'}
                      accent={stats.overdue > 0 ? '#f43f5e' : '#10b981'}
                    />
                  </div>
                </div>
              </section>

              {/* 3. Per-Member Performance Breakdown */}
              {stats.byUser.length > 0 && (
                <section>
                  <div style={{
                    fontSize: '12px',
                    fontWeight: '800',
                    color: '#94a3b8',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8
                  }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981' }} />
                    <span>Performance by Member</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {stats.byUser.map((entry, idx) => {
                      const percent = entry.count > 0
                        ? Math.round((entry.done / entry.count) * 100)
                        : 0;

                      // Cohesive alternating palette for avatars & tracks
                      const palette = [
                        { color: '#38bdf8', bg: 'linear-gradient(135deg, #0284c7, #38bdf8)' },
                        { color: '#f43f5e', bg: 'linear-gradient(135deg, #e11d48, #fb7185)' },
                        { color: '#f59e0b', bg: 'linear-gradient(135deg, #d97706, #fbbf24)' },
                        { color: '#10b981', bg: 'linear-gradient(135deg, #059669, #34d399)' }
                      ];
                      const theme = palette[idx % palette.length];

                      return (
                        <div key={entry._id} className="member-row">
                          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                            {/* Member Avatar */}
                            <div style={{
                              width: 40,
                              height: 40,
                              borderRadius: '12px',
                              background: theme.bg,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: 14,
                              fontWeight: 800,
                              color: '#ffffff',
                              flexShrink: 0,
                              boxShadow: `0 4px 14px ${theme.color}33`,
                              border: '1px solid rgba(255, 255, 255, 0.15)'
                            }}>
                              {entry.name[0].toUpperCase()}
                            </div>

                            {/* Info & Progress Bar */}
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'baseline',
                                marginBottom: 8,
                              }}>
                                <span style={{ fontSize: '15px', fontWeight: 700, color: '#f8fafc' }}>
                                  {entry.name}
                                </span>
                                <span style={{
                                  fontSize: '12px',
                                  fontWeight: '600',
                                  color: '#94a3b8',
                                }}>
                                  <strong style={{ color: '#ffffff' }}>{entry.done}</strong> / {entry.count} closed
                                </span>
                              </div>

                              {/* Progress Track */}
                              <div style={{
                                height: 6,
                                background: '#18181b',
                                borderRadius: 999,
                                overflow: 'hidden',
                                border: '1px solid #27272a'
                              }}>
                                <div style={{
                                  height: '100%',
                                  width: `${percent}%`,
                                  background: percent === 100
                                    ? '#10b981'
                                    : percent > 50
                                    ? 'linear-gradient(90deg, #38bdf8, #10b981)'
                                    : percent > 25
                                    ? 'linear-gradient(90deg, #f59e0b, #38bdf8)'
                                    : 'linear-gradient(90deg, #f43f5e, #f59e0b)',
                                  borderRadius: 999,
                                  boxShadow: `0 0 10px ${theme.color}40`,
                                  transition: 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                                }} />
                              </div>
                            </div>

                            {/* Percentage Tag */}
                            <span style={{
                              fontSize: '14px',
                              fontWeight: '800',
                              color: percent === 100 ? '#10b981' : theme.color,
                              minWidth: 54,
                              textAlign: 'right',
                              fontVariantNumeric: 'tabular-nums'
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

              {/* Empty Members State */}
              {stats.byUser.length === 0 && (
                <div className="obsidian-card" style={{ padding: '48px 24px', textAlign: 'center' }}>
                  <p style={{ color: '#64748b', fontSize: '14px', fontWeight: '600', margin: 0 }}>
                    No tasks assigned to team members yet.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="obsidian-card" style={{ padding: '48px 24px', textAlign: 'center' }}>
              <p style={{ color: '#64748b', fontSize: '14px', fontWeight: '600', margin: 0 }}>
                No statistical data available for this project.
              </p>
            </div>
          )}
        </main>
      </div>
    </>
  );
};

const pct = (val, total) =>
  total > 0 ? `${Math.round((val / total) * 100)}%` : '0%';

export default DashboardPage;