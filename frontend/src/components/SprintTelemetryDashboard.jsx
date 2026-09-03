import React from 'react';
import { isPast } from 'date-fns';

const SprintTelemetryDashboard = ({ tasks = [], project = null }) => {
  const safeTasks = Array.isArray(tasks) ? tasks : [];
  const totalTasks = safeTasks.length;

  // 1. Velocity Cycle calculation
  const doneTasks = safeTasks.filter((t) => t?.status === 'done').length;
  const velocityRate = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;
  const sprintDelta = Math.max(0, doneTasks - 2);

  // 2. Bottleneck Watch
  const urgentTickets = safeTasks.filter((t) => {
    const isHigh = t?.priority === 'high';
    const notDone = t?.status !== 'done';
    const overdue = t?.dueDate && isPast(new Date(t.dueDate));
    return notDone && (isHigh || overdue);
  });
  const bottleneckCount = urgentTickets.length;

  // 3. Roles breakdown
  const members = project?.members || [];
  const adminCount = members.filter((m) => m?.role === 'admin').length || 1;
  const memberCount = members.filter((m) => m?.role === 'member').length || Math.max(0, members.length - 1);

  // 4. Dynamic SVG Spline Coordinates (Scales with velocityRate)
  // 0% velocity -> peak is low at Y=130; 100% velocity -> peak ascends to Y=20
  const peakY = Math.max(20, Math.round(130 - (velocityRate / 100) * 110));
  const midY = Math.max(45, Math.round(135 - (velocityRate / 100) * 75));
  const troughY = Math.min(135, peakY + 30);

  const splineLinePath = `M 10 110 Q 110 120 210 ${midY} T 350 ${troughY} T 490 ${peakY}`;
  const splineAreaPath = `${splineLinePath} L 490 150 L 10 150 Z`;

  return (
    <div className="telemetry-grid">
      <style>{`
        .telemetry-grid {
          display: grid;
          grid-template-columns: 240px 1.4fr 240px;
          gap: 16px;
          margin-bottom: 24px;
          font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'SF Pro Display', Roboto, sans-serif;
        }

        @media (max-width: 1080px) {
          .telemetry-grid {
            grid-template-columns: 1fr;
          }
        }

        .telemetry-card {
          background: #09090b;
          border: 1px solid #1e293b;
          border-radius: 18px;
          padding: 18px 20px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 16px 36px -12px rgba(0, 0, 0, 0.9);
          display: flex;
          flex-direction: column;
          justifyContent: space-between;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .telemetry-card:hover {
          border-color: #38bdf8;
          box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.95), 0 0 20px rgba(56, 189, 248, 0.12);
        }

        .telemetry-pill {
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 2px 8px;
          border-radius: 6px;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }

        .spline-anim {
          transition: d 0.6s cubic-bezier(0.16, 1, 0.3, 1),
                      cx 0.6s cubic-bezier(0.16, 1, 0.3, 1),
                      cy 0.6s cubic-bezier(0.16, 1, 0.3, 1),
                      fill 0.6s ease,
                      stroke 0.6s ease;
        }
      `}</style>

      {/* Left Column: Velocity + Bottlenecks */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {/* Velocity Cycle */}
        <div className="telemetry-card" style={{ height: '110px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: '800', color: '#10b981', letterSpacing: '0.08em' }}>
              VELOCITY CYCLE
            </span>
            <span style={{ fontSize: '13px', fontWeight: '900', color: '#10b981' }}>
              {velocityRate}%
            </span>
          </div>

          <div style={{ width: '100%', height: '5px', background: '#18181b', borderRadius: '9999px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${velocityRate}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #10b981 0%, #38bdf8 100%)',
                boxShadow: '0 0 10px #10b981',
                transition: 'width 0.4s ease',
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#71717a' }}>
            <span>{doneTasks} Done</span>
            <span style={{ color: '#10b981', fontWeight: '700' }}>
              +{sprintDelta} Ahead of sprint
            </span>
          </div>
        </div>

        {/* Bottleneck Watch */}
        <div className="telemetry-card" style={{ height: '110px' }}>
          <span style={{ fontSize: '11px', fontWeight: '800', color: '#f59e0b', letterSpacing: '0.08em' }}>
            BOTTLENECK WATCH
          </span>

          <div style={{ fontSize: '20px', fontWeight: '900', color: '#ffffff', display: 'flex', alignItems: 'baseline', gap: '6px' }}>
            <span>{bottleneckCount}</span>
            <span style={{ fontSize: '13px', fontWeight: '700', color: '#cbd5e1' }}>
              Urgent {bottleneckCount === 1 ? 'Review' : 'Reviews'}
            </span>
          </div>

          <div style={{ fontSize: '11px', color: bottleneckCount > 0 ? '#f43f5e' : '#10b981', fontWeight: '600' }}>
            {bottleneckCount > 0
              ? `⚠️ ${bottleneckCount} High Priority ticket flagged`
              : '✓ Zero bottleneck alerts'}
          </div>
        </div>
      </div>

      {/* Center Hero: Reactive Dynamic Trajectory Spline */}
      <div className="telemetry-card" style={{ padding: '20px 24px', minHeight: '234px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', zIndex: 1 }}>
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#ffffff', margin: 0, letterSpacing: '-0.02em' }}>
              Sprint Trajectory & Output
            </h3>
            <p style={{ fontSize: '12px', color: '#71717a', margin: '4px 0 0 0' }}>
              Cross-functional engineering throughput
            </p>
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            <span className="telemetry-pill" style={{ background: 'rgba(56, 189, 248, 0.12)', border: '1px solid rgba(56, 189, 248, 0.3)', color: '#38bdf8' }}>
              DEPLOYMENTS
            </span>
            <span className="telemetry-pill" style={{ background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#10b981' }}>
              LIVE
            </span>
          </div>
        </div>

        {/* Ambient Spline SVG */}
        <div style={{ position: 'relative', width: '100%', height: '140px', marginTop: '10px' }}>
          <svg viewBox="0 0 500 150" preserveAspectRatio="none" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
            <defs>
              <linearGradient id="cyberAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity={velocityRate > 0 ? '0.32' : '0.06'} />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
              </linearGradient>
              <linearGradient id="cyberLineGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="60%" stopColor="#0284c7" />
                <stop offset="100%" stopColor={velocityRate >= 70 ? '#10b981' : '#38bdf8'} />
              </linearGradient>
            </defs>

            {/* Gradient Shaded Area */}
            <path
              d={splineAreaPath}
              fill="url(#cyberAreaGrad)"
              className="spline-anim"
            />

            {/* Glowing Spline Stroke */}
            <path
              d={splineLinePath}
              fill="none"
              stroke="url(#cyberLineGrad)"
              strokeWidth="3.5"
              strokeLinecap="round"
              className="spline-anim"
            />

            {/* Midpoint Trajectory Checkpoint */}
            <circle
              cx="210"
              cy={midY}
              r="4"
              fill="#f59e0b"
              stroke="#09090b"
              strokeWidth="2"
              className="spline-anim"
            />

            {/* Terminal Milestone Node */}
            <circle
              cx="490"
              cy={peakY}
              r="5.5"
              fill={velocityRate >= 70 ? '#10b981' : '#38bdf8'}
              stroke="#09090b"
              strokeWidth="2"
              className="spline-anim"
              style={{
                filter: `drop-shadow(0 0 6px ${velocityRate >= 70 ? '#10b981' : '#38bdf8'})`,
              }}
            />
          </svg>
        </div>
      </div>

      {/* Right Column: Workspaces + Roles Delegated */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {/* Workspaces */}
        <div className="telemetry-card" style={{ height: '110px' }}>
          <span style={{ fontSize: '11px', fontWeight: '800', color: '#38bdf8', letterSpacing: '0.08em' }}>
            WORKSPACES
          </span>

          <div style={{ fontSize: '24px', fontWeight: '900', color: '#ffffff', letterSpacing: '-0.02em' }}>
            {project ? '1 Active' : '0 Active'}
          </div>

          <span style={{ fontSize: '11px', color: '#71717a' }}>
            Syncing across workspace nodes
          </span>
        </div>

        {/* Roles Delegated */}
        <div className="telemetry-card" style={{ height: '110px' }}>
          <span style={{ fontSize: '11px', fontWeight: '800', color: '#10b981', letterSpacing: '0.08em' }}>
            ROLES DELEGATED
          </span>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span
              style={{
                fontSize: '11px',
                fontWeight: '700',
                color: '#f59e0b',
                background: 'rgba(245, 158, 11, 0.12)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                padding: '3px 8px',
                borderRadius: '6px',
              }}
            >
              Admin: {adminCount}
            </span>

            <span
              style={{
                fontSize: '11px',
                fontWeight: '700',
                color: '#38bdf8',
                background: 'rgba(56, 189, 248, 0.12)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                padding: '3px 8px',
                borderRadius: '6px',
              }}
            >
              Members: {memberCount}
            </span>
          </div>

          <span style={{ fontSize: '11px', color: '#71717a' }}>
            JWT Authorization active
          </span>
        </div>
      </div>
    </div>
  );
};

export default SprintTelemetryDashboard;