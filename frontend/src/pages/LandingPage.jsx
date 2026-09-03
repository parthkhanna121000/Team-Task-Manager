import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [openAccordion, setOpenAccordion] = useState(0);

  const workflowSteps = [
    {
      step: '01',
      title: 'Initialize Workspace',
      badge: 'SETUP',
      color: '#38bdf8', // Electric Blue
      desc: 'Create an isolated project canvas with dedicated Kanban sprint buckets, custom tags, and milestone deadlines.',
    },
    {
      step: '02',
      title: 'Invite & Role Governance',
      badge: 'ACCESS',
      color: '#f59e0b', // Amber Yellow
      desc: 'Delegate administrative access and add contributors directly via registered email addresses with zero permission friction.',
    },
    {
      step: '03',
      title: 'Execute & Benchmark',
      badge: 'METRICS',
      color: '#10b981', // Neon Emerald
      desc: 'Move cards through To Do, In Progress, and Done. Monitor velocity metrics and overdue tasks in real time.',
    },
  ];

  return (
    <div className="cyber-obsidian-landing">
      <style>{`
        /* Viewport Reset */
        html, body, #root {
          margin: 0 !important;
          padding: 0 !important;
          width: 100% !important;
          background-color: #000000 !important;
          box-sizing: border-box;
        }

        *, *::before, *::after {
          box-sizing: inherit;
        }

        .cyber-obsidian-landing {
          min-height: 100vh;
          width: 100%;
          background-color: #000000;
          /* Pitch black canvas with tri-color ambient neon spotlights */
          background-image: 
            radial-gradient(circle at 18% 10%, rgba(56, 189, 248, 0.12) 0%, transparent 45%),
            radial-gradient(circle at 82% 15%, rgba(245, 158, 11, 0.10) 0%, transparent 45%),
            radial-gradient(circle at 50% 60%, rgba(16, 185, 129, 0.08) 0%, transparent 50%),
            linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
          background-size: 100% 100%, 100% 100%, 100% 100%, 48px 48px, 48px 48px;
          color: #f1f5f9;
          font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'SF Pro Display', Roboto, sans-serif;
          position: relative;
          overflow-x: hidden;
        }

        /* ---------------- INTERACTIVE BUTTON STYLES ---------------- */

        /* Glowing Amber-to-Emerald Primary Button */
        .btn-cyber-primary {
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, #f59e0b 0%, #10b981 100%);
          color: #000000;
          font-weight: 800;
          border-radius: 9999px;
          padding: 13px 32px;
          text-decoration: none;
          font-size: 14px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border: none;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.25s ease;
          box-shadow: 0 4px 25px rgba(245, 158, 11, 0.35);
        }

        .btn-cyber-primary::after {
          content: '';
          position: absolute;
          top: 0;
          left: -120%;
          width: 80%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent);
          transform: skewX(-20deg);
        }

        .btn-cyber-primary:hover::after {
          animation: sheenSweep 0.85s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .btn-cyber-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 35px rgba(16, 185, 129, 0.45);
        }

        .btn-cyber-primary:active {
          transform: translateY(1px) scale(0.98);
        }

        /* Secondary Cyan-Bordered Obsidian Button */
        .btn-cyber-secondary {
          position: relative;
          background: #09090b;
          color: #38bdf8;
          font-weight: 700;
          border-radius: 9999px;
          padding: 13px 30px;
          text-decoration: none;
          font-size: 14px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border: 1px solid rgba(56, 189, 248, 0.35);
          cursor: pointer;
          transition: all 0.22s ease;
        }

        .btn-cyber-secondary:hover {
          color: #ffffff;
          border-color: #38bdf8;
          background: rgba(56, 189, 248, 0.1);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(56, 189, 248, 0.25);
        }

        .btn-cyber-secondary:active {
          transform: translateY(1px) scale(0.98);
        }

        @keyframes sheenSweep {
          0% { left: -120%; }
          100% { left: 180%; }
        }

        /* ---------------- INTERACTIVE NAVIGATION ---------------- */

        .nav-link-cyber {
          position: relative;
          color: #94a3b8;
          font-size: 13px;
          font-weight: 600;
          text-decoration: none;
          padding: 6px 0;
          transition: color 0.2s ease;
        }

        .nav-link-cyber::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #38bdf8, #10b981);
          transition: width 0.25s ease, left 0.25s ease;
        }

        .nav-link-cyber:hover {
          color: #ffffff;
        }

        .nav-link-cyber:hover::after {
          width: 100%;
          left: 0;
        }

        .icon-arrow-slide {
          transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .btn-cyber-primary:hover .icon-arrow-slide,
        .btn-cyber-secondary:hover .icon-arrow-slide {
          transform: translateX(4px);
        }

        /* ---------------- COLOR ACCENT CARDS ---------------- */

        .card-obsidian {
          background: #09090b;
          border: 1px solid #1e293b;
          border-radius: 20px;
          position: relative;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .card-obsidian:hover {
          transform: translateY(-4px);
        }

        .card-glow-blue:hover {
          border-color: rgba(56, 189, 248, 0.6);
          box-shadow: 0 16px 36px -10px rgba(56, 189, 248, 0.2);
        }

        .card-glow-yellow:hover {
          border-color: rgba(245, 158, 11, 0.6);
          box-shadow: 0 16px 36px -10px rgba(245, 158, 11, 0.2);
        }

        .card-glow-green:hover {
          border-color: rgba(16, 185, 129, 0.6);
          box-shadow: 0 16px 36px -10px rgba(16, 185, 129, 0.2);
        }

        /* Heading Dynamic Gradient */
        .gradient-text-tri {
          background: linear-gradient(135deg, #38bdf8 0%, #f59e0b 50%, #10b981 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        /* Dashboard Responsive Grid */
        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          gap: 18px;
          max-width: 1140px;
          margin: 0 auto;
        }

        @media (max-width: 900px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
          }
          .dashboard-col-left, .dashboard-col-center, .dashboard-col-right {
            grid-column: span 12 !important;
          }
        }
      `}</style>

      {/* Navigation Header */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid #1e293b',
        width: '100%'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '14px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              background: 'linear-gradient(135deg, #38bdf8, #10b981)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#000000',
              fontWeight: 900,
              fontSize: 15,
              boxShadow: '0 0 16px rgba(56, 189, 248, 0.4)'
            }}>
              C
            </div>
            <span style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.03em', color: '#ffffff' }}>
              Collab<span style={{ color: '#38bdf8' }}>Nex</span>
            </span>
          </Link>

          <nav style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
            <a href="#features" className="nav-link-cyber">Features</a>
            <a href="#workflow" className="nav-link-cyber">Workflow</a>
            <a href="#telemetry" className="nav-link-cyber">Telemetry</a>
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {user ? (
              <button onClick={() => navigate('/projects')} className="btn-cyber-primary" style={{ padding: '8px 22px', fontSize: 13 }}>
                <span>Workspace</span>
                <span className="icon-arrow-slide">→</span>
              </button>
            ) : (
              <>
                <Link to="/login" className="nav-link-cyber" style={{ fontSize: 13 }}>
                  Log in
                </Link>
                <Link to="/register" className="btn-cyber-primary" style={{ padding: '8px 22px', fontSize: 13 }}>
                  <span>Get Started</span>
                  <span className="icon-arrow-slide">→</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '80px 24px 70px', textAlign: 'center' }}>
        {/* Status Pill Badge */}
        <div style={{ marginBottom: 24 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            padding: '6px 18px',
            background: 'rgba(9, 9, 11, 0.8)',
            border: '1px solid #1e293b',
            borderRadius: 9999,
            fontSize: 12,
            fontWeight: 700
          }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }} />
            <span style={{ color: '#38bdf8' }}>CYBER-OBSIDIAN</span>
            <span style={{ color: '#475569' }}>•</span>
            <span style={{ color: '#f59e0b' }}>SPRINT ENGINE v2.4</span>
          </div>
        </div>

        <h1 style={{
          fontSize: 'clamp(38px, 6.5vw, 74px)',
          fontWeight: 900,
          letterSpacing: '-0.04em',
          lineHeight: 1.1,
          color: '#ffffff',
          maxWidth: '980px',
          margin: '0 auto 24px'
        }}>
          High-Velocity Project Delivery<br />
          with <span className="gradient-text-tri">Synchronized Telemetry.</span>
        </h1>

        <p style={{
          fontSize: 'clamp(15px, 1.8vw, 18px)',
          color: '#94a3b8',
          maxWidth: '640px',
          margin: '0 auto 40px',
          lineHeight: 1.6
        }}>
          Eliminate ambiguity in sprint velocity. Real-time Kanban management, role assignment security, and high-impact analytics wrapped in pure black.
        </p>

        {/* Hero Interactive Actions */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, flexWrap: 'wrap', marginBottom: 70 }}>
          <button onClick={() => navigate(user ? '/projects' : '/register')} className="btn-cyber-primary">
            <span>Start Free Trial</span>
            <span className="icon-arrow-slide">→</span>
          </button>
          
          <button onClick={() => navigate(user ? '/projects' : '/login')} className="btn-cyber-secondary">
            <span>Enter Workspace</span>
            <span className="icon-arrow-slide">↗</span>
          </button>
        </div>

        {/* Central Telemetry Dashboard Visual */}
        <div id="telemetry" className="dashboard-grid">
          {/* Left: Emerald Metric Card */}
          <div className="dashboard-col-left" style={{ gridColumn: 'span 3', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="card-obsidian card-glow-green" style={{ padding: '22px', textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 800, color: '#10b981', letterSpacing: '0.05em', marginBottom: 12 }}>
                <span>VELOCITY CYCLE</span>
                <span>94%</span>
              </div>
              <div style={{ height: 6, width: '100%', background: '#111827', borderRadius: 999 }}>
                <div style={{ width: '94%', height: '100%', background: 'linear-gradient(90deg, #38bdf8, #10b981)', borderRadius: 999 }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#64748b', marginTop: 12 }}>
                <span>28 Done</span>
                <span style={{ color: '#10b981' }}>+6 Ahead of sprint</span>
              </div>
            </div>

            {/* Amber Alert Card */}
            <div className="card-obsidian card-glow-yellow" style={{ padding: '22px', textAlign: 'left' }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: '#f59e0b', letterSpacing: '0.05em' }}>BOTTLENECK WATCH</div>
              <div style={{ fontSize: 24, fontWeight: 800, margin: '6px 0 2px', color: '#ffffff' }}>1 Urgent Review</div>
              <span style={{ fontSize: 12, color: '#f59e0b' }}>⚠️ High Priority ticket flagged</span>
            </div>
          </div>

          {/* Center: Live Multi-Color Telemetry Chart */}
          <div className="dashboard-col-center card-obsidian card-glow-blue" style={{ gridColumn: 'span 6', padding: '24px 28px', textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#ffffff' }}>Sprint Trajectory & Output</h3>
                <span style={{ fontSize: 12, color: '#64748b' }}>Cross-functional engineering throughput</span>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <span style={{ fontSize: 10, fontWeight: 700, background: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.4)', color: '#38bdf8', padding: '2px 8px', borderRadius: 999 }}>
                  DEPLOYMENTS
                </span>
                <span style={{ fontSize: 10, fontWeight: 700, background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.4)', color: '#10b981', padding: '2px 8px', borderRadius: 999 }}>
                  LIVE
                </span>
              </div>
            </div>

            <svg viewBox="0 0 400 120" style={{ width: '100%', height: '120px', overflow: 'visible' }}>
              <defs>
                <linearGradient id="cyberChartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.35" />
                  <stop offset="50%" stopColor="#10b981" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#000000" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path d="M0,85 Q60,30 120,65 T240,40 T340,75 T400,20 L400,120 L0,120 Z" fill="url(#cyberChartGrad)" />
              <path d="M0,85 Q60,30 120,65 T240,40 T340,75 T400,20" fill="none" stroke="#38bdf8" strokeWidth="2.5" />
              <circle cx="240" cy="40" r="5" fill="#f59e0b" stroke="#000000" strokeWidth="2" />
              <circle cx="400" cy="20" r="5" fill="#10b981" stroke="#000000" strokeWidth="2" />
            </svg>
          </div>

          {/* Right: Blue / Cyan Workspace Overview */}
          <div className="dashboard-col-right" style={{ gridColumn: 'span 3', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="card-obsidian card-glow-blue" style={{ padding: '22px', textAlign: 'left' }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: '#38bdf8', letterSpacing: '0.05em' }}>WORKSPACES</div>
              <div style={{ fontSize: 24, fontWeight: 800, margin: '6px 0 2px', color: '#ffffff' }}>16 Active</div>
              <span style={{ fontSize: 12, color: '#94a3b8' }}>Syncing across 3 hubs</span>
            </div>

            <div className="card-obsidian card-glow-green" style={{ padding: '22px', textAlign: 'left' }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: '#10b981', letterSpacing: '0.05em' }}>ROLES DELEGATED</div>
              <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                <span style={{ fontSize: 11, fontWeight: 700, background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.4)', color: '#f59e0b', padding: '3px 8px', borderRadius: 6 }}>
                  Admin: 3
                </span>
                <span style={{ fontSize: 11, fontWeight: 700, background: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.4)', color: '#38bdf8', padding: '3px 8px', borderRadius: 6 }}>
                  Members: 24
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tri-Color Feature Pillar Cards */}
      <section id="features" style={{ maxWidth: '1140px', margin: '80px auto', padding: '0 24px' }}>
        <div style={{ marginBottom: 40 }}>
          <span style={{ fontSize: 12, fontWeight: 800, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            ENGINEERING CAPABILITIES
          </span>
          <h2 style={{ fontSize: 32, fontWeight: 900, letterSpacing: '-0.03em', margin: '8px 0 0', color: '#ffffff' }}>
            Designed for execution without friction
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
          {/* Feature 1: Cyan/Blue Theme */}
          <div className="card-obsidian card-glow-blue" style={{ padding: 32 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(56, 189, 248, 0.12)', border: '1px solid rgba(56, 189, 248, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, color: '#38bdf8', fontSize: 18 }}>
              📋
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 800, margin: '0 0 10px', color: '#ffffff' }}>
              Kanban Task Boards
            </h3>
            <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
              Structure work across <strong style={{ color: '#38bdf8' }}>To Do</strong>, <strong style={{ color: '#f59e0b' }}>In Progress</strong>, and <strong style={{ color: '#10b981' }}>Done</strong> columns with automated overdue flags and priority tagging.
            </p>
          </div>

          {/* Feature 2: Amber/Yellow Theme */}
          <div className="card-obsidian card-glow-yellow" style={{ padding: 32 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, color: '#f59e0b', fontSize: 18 }}>
              👥
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 800, margin: '0 0 10px', color: '#ffffff' }}>
              Role Governance & Invites
            </h3>
            <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
              Invite contributors directly through email. Granular roles ensure workspace owners maintain project administrative authority with secure JWT guards.
            </p>
          </div>

          {/* Feature 3: Emerald/Green Theme */}
          <div className="card-obsidian card-glow-green" style={{ padding: 32 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, color: '#10b981', fontSize: 18 }}>
              📊
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 800, margin: '0 0 10px', color: '#ffffff' }}>
              Real-Time Dashboard Analytics
            </h3>
            <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
              Automate status reporting. Review overdue bottleneck distributions and member sprint percentage breakdowns in live graphs.
            </p>
          </div>
        </div>
      </section>

      {/* Workflow Section with Color-Coded Steps */}
      <section id="workflow" style={{ maxWidth: '1140px', margin: '100px auto', padding: '0 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 48, alignItems: 'center' }}>
          {/* Terminal Mockup with Color Output */}
          <div className="card-obsidian" style={{ padding: 28, fontFamily: 'ui-monospace, monospace', border: '1px solid #1e293b' }}>
            <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }} />
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b' }} />
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981' }} />
            </div>
            <div style={{ color: '#64748b', fontSize: 12, marginBottom: 14 }}>// CollabNex Terminal Console</div>
            <div style={{ fontSize: 13, lineHeight: 1.8 }}>
              <div><span style={{ color: '#10b981' }}>collabnex</span>:<span style={{ color: '#38bdf8' }}>~</span>$ colly sprint create --tag "Q3-Frontend"</div>
              <div><span style={{ color: '#10b981' }}>[OK]</span> Initialized Kanban context.</div>
              <div><span style={{ color: '#10b981' }}>collabnex</span>:<span style={{ color: '#38bdf8' }}>~</span>$ colly assign user@collabnex.io --role admin</div>
              <div><span style={{ color: '#f59e0b' }}>[AUTH]</span> Role delegated via JWT authorization token.</div>
              <div><span style={{ color: '#10b981' }}>collabnex</span>:<span style={{ color: '#38bdf8' }}>~</span>$ colly telemetry --health</div>
              <div><span style={{ color: '#38bdf8' }}>[STATUS]</span> 100% operational. Zero bottleneck alerts.</div>
            </div>
          </div>

          {/* Accordion List with Color Highlights */}
          <div>
            <h2 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.03em', color: '#ffffff', margin: '0 0 16px' }}>
              Three steps to operational velocity
            </h2>
            <p style={{ color: '#94a3b8', fontSize: 15, margin: '0 0 28px', lineHeight: 1.6 }}>
              Jump from project planning into active execution within seconds.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {workflowSteps.map((step, idx) => (
                <div
                  key={idx}
                  onClick={() => setOpenAccordion(openAccordion === idx ? -1 : idx)}
                  style={{
                    background: '#09090b',
                    border: '1px solid',
                    borderColor: openAccordion === idx ? step.color : '#1e293b',
                    borderRadius: 14,
                    padding: '18px 20px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: openAccordion === idx ? `0 0 15px ${step.color}25` : 'none'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <span style={{ fontSize: 11, fontWeight: 800, color: step.color, background: `${step.color}15`, padding: '2px 8px', borderRadius: 4 }}>
                        {step.badge}
                      </span>
                      <span style={{ fontSize: 15, fontWeight: 700, color: '#f8fafc' }}>{step.title}</span>
                    </div>
                    <span style={{ fontSize: 14, color: step.color }}>{openAccordion === idx ? '▲' : '▼'}</span>
                  </div>
                  {openAccordion === idx && (
                    <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.6, margin: '12px 0 0' }}>
                      {step.desc}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Cyber CTA Bar */}
      <section style={{ maxWidth: '1140px', margin: '100px auto 80px', padding: '0 24px' }}>
        <div style={{
          background: 'linear-gradient(135deg, #09090b 0%, #0c121e 100%)',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          borderRadius: 24,
          padding: '48px 40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 28,
          boxShadow: '0 20px 50px rgba(0,0,0,0.8), 0 0 30px rgba(56, 189, 248, 0.1)'
        }}>
          <div>
            <h2 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em', margin: 0, color: '#ffffff' }}>
              Accelerate team execution now.
            </h2>
            <p style={{ color: '#94a3b8', fontSize: 14, margin: '8px 0 0' }}>
              Experience high-impact Kanban sprints with real-time velocity metrics.
            </p>
          </div>

          <button onClick={() => navigate(user ? '/projects' : '/register')} className="btn-cyber-primary">
            <span>Launch Workspace</span>
            <span className="icon-arrow-slide">→</span>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid #1e293b',
        padding: '24px',
        fontSize: 12,
        color: '#64748b',
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 16
      }}>
        <div>&copy; {new Date().getFullYear()} CollabNex. Cyber-Obsidian Edition.</div>
        <div style={{ display: 'flex', gap: 20 }}>
          <a href="#" className="nav-link-cyber" style={{ fontSize: 12 }}>Privacy</a>
          <a href="#" className="nav-link-cyber" style={{ fontSize: 12 }}>Terms</a>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;