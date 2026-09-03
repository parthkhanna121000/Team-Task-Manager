import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProjects } from '../hooks/useProjects';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const ProjectsPage = () => {
  const { projects, loading, createProject } = useProjects();
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', description: '' });
  const [creating, setCreating] = useState(false);
  const [successAnim, setSuccessAnim] = useState(false);

  const set = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error('Project name required');
    setCreating(true);
    try {
      await createProject(form);
      setSuccessAnim(true);
      toast.success('Project initialized successfully!');
      setTimeout(() => {
        setForm({ name: '', description: '' });
        setShowModal(false);
        setSuccessAnim(false);
      }, 500);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create project');
    } finally {
      setCreating(false);
    }
  };

  const userRole = (project) =>
    project.members.find((m) => m.user._id === user?._id)?.role;

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

          @keyframes btnSheen {
            0% { left: -120%; }
            100% { left: 180%; }
          }

          .projects-container {
            animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }

          /* Obsidian Card Base */
          .obsidian-card {
            background: #09090b;
            border: 1px solid #1e293b;
            border-radius: 20px;
            transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
            position: relative;
            overflow: hidden;
          }

          .obsidian-card:hover {
            border-color: #38bdf8;
            transform: translateY(-4px);
            box-shadow: 0 16px 36px -10px rgba(56, 189, 248, 0.2), 0 0 20px rgba(56, 189, 248, 0.08);
          }

          /* Sweeping Sheen Primary Button */
          .btn-cyber-cyan {
            position: relative;
            overflow: hidden;
            background: linear-gradient(135deg, #38bdf8 0%, #0284c7 100%);
            color: #000000;
            font-weight: 800;
            border-radius: 12px;
            padding: 12px 24px;
            font-size: 13px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            border: none;
            cursor: pointer;
            text-decoration: none;
            box-shadow: 0 4px 18px rgba(56, 189, 248, 0.35);
            transition: transform 0.18s ease, box-shadow 0.2s ease;
          }

          .btn-cyber-cyan::after {
            content: '';
            position: absolute;
            top: 0;
            left: -120%;
            width: 80%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent);
            transform: skewX(-20deg);
          }

          .btn-cyber-cyan:hover::after {
            animation: btnSheen 0.75s cubic-bezier(0.16, 1, 0.3, 1);
          }

          .btn-cyber-cyan:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(56, 189, 248, 0.45);
          }

          .btn-cyber-cyan:active {
            transform: translateY(1px) scale(0.98);
          }

          /* Input Fields for Modal */
          .modal-input {
            width: 100%;
            padding: 13px 16px;
            background: #000000;
            border: 1px solid #27272a;
            border-radius: 12px;
            font-size: 14px;
            color: #ededed;
            outline: none;
            transition: all 0.2s ease;
            box-sizing: border-box;
          }

          .modal-input:focus {
            border-color: #38bdf8;
            box-shadow: 0 0 0 1px #38bdf8, 0 8px 16px rgba(0, 0, 0, 0.5);
          }

          .modal-input::placeholder {
            color: #52525b;
          }
        `}
      </style>

      <div style={{
        minHeight: '100vh',
        width: '100vw',
        background: '#000000',
        backgroundImage: `
          radial-gradient(circle at 10% 8%, rgba(56, 189, 248, 0.08) 0%, transparent 40%),
          radial-gradient(circle at 90% 12%, rgba(245, 158, 11, 0.07) 0%, transparent 45%),
          radial-gradient(circle at 50% 65%, rgba(16, 185, 129, 0.05) 0%, transparent 50%),
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

        <main className="projects-container" style={{
          position: 'relative',
          zIndex: 1,
          paddingBottom: '80px',
          maxWidth: '1240px',
          margin: '0 auto',
          paddingLeft: '24px',
          paddingRight: '24px',
          paddingTop: '32px'
        }}>
          
          {/* Header Card */}
          <div style={{
            background: 'linear-gradient(145deg, #09090b 0%, #0c121e 100%)',
            borderRadius: '24px',
            padding: '32px 36px',
            border: '1px solid #1e293b',
            boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 36,
            flexWrap: 'wrap',
            gap: 20,
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
              background: 'linear-gradient(90deg, #38bdf8 0%, #10b981 40%, #f59e0b 75%, #f43f5e 100%)'
            }} />

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <span style={{
                  fontSize: '11px',
                  fontWeight: '800',
                  color: '#38bdf8',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  background: 'rgba(56, 189, 248, 0.12)',
                  padding: '3px 10px',
                  borderRadius: '6px',
                  border: '1px solid rgba(56, 189, 248, 0.25)'
                }}>
                  {projects.length} {projects.length === 1 ? 'Workspace' : 'Workspaces'}
                </span>
                <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#64748b' }} />
                <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>Active Sprint Boards</span>
              </div>

              <h1 style={{
                fontSize: '30px',
                fontWeight: '900',
                color: '#ffffff',
                letterSpacing: '-0.03em',
                margin: 0,
              }}>
                Your Workspaces
              </h1>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="btn-cyber-cyan"
            >
              <span style={{ fontSize: '15px', lineHeight: 1 }}>+</span>
              <span>New Project</span>
            </button>
          </div>

          {/* Grid Layout */}
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '100px 0', gap: 16 }}>
              <div style={{
                width: '40px',
                height: '40px',
                border: '3px solid #1e293b',
                borderTopColor: '#38bdf8',
                borderRadius: '50%',
                animation: 'spin 0.7s linear infinite'
              }} />
              <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '700', letterSpacing: '0.06em' }}>
                FETCHING WORKSPACES...
              </span>
            </div>
          ) : projects.length === 0 ? (
            <div style={{
              background: '#09090b',
              borderRadius: '24px',
              padding: '60px 24px',
              textAlign: 'center',
              border: '1px solid #1e293b',
              boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.8)',
            }}>
              <div style={{
                width: 56,
                height: 56,
                borderRadius: '16px',
                background: 'rgba(56, 189, 248, 0.1)',
                border: '1px solid rgba(56, 189, 248, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 24,
                margin: '0 auto 16px'
              }}>
                📂
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#ededed', margin: '0 0 6px 0' }}>
                No active projects found
              </h3>
              <p style={{ fontSize: '14px', color: '#71717a', margin: '0 0 20px 0', maxWidth: '380px', marginInline: 'auto' }}>
                Create your first project canvas to organize sprint backlogs and invite contributors.
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="btn-cyber-cyan"
              >
                + Create Workspace
              </button>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
              gap: 20,
            }}>
              {projects.map((project) => {
                const role = userRole(project);
                const isAdmin = role === 'admin';

                return (
                  <Link key={project._id} to={`/projects/${project._id}`} style={{ textDecoration: 'none' }}>
                    <div className="obsidian-card" style={{
                      padding: '24px',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      boxSizing: 'border-box'
                    }}>
                      {/* Left Indicator Stripe */}
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        bottom: 0,
                        left: 0,
                        width: 4,
                        background: isAdmin
                          ? 'linear-gradient(180deg, #38bdf8 0%, #10b981 100%)'
                          : '#27272a',
                      }} />

                      <div style={{ paddingLeft: 6 }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          justifyContent: 'space-between',
                          gap: 12,
                          marginBottom: 12,
                        }}>
                          <h3 style={{
                            fontSize: '18px',
                            fontWeight: '800',
                            color: '#ffffff',
                            letterSpacing: '-0.02em',
                            margin: 0,
                            lineHeight: '1.4',
                          }}>
                            {project.name}
                          </h3>

                          <span style={{
                            fontSize: '10px',
                            fontWeight: '800',
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                            padding: '3px 10px',
                            borderRadius: '9999px',
                            background: isAdmin ? 'rgba(56, 189, 248, 0.12)' : 'rgba(255, 255, 255, 0.05)',
                            color: isAdmin ? '#38bdf8' : '#a1a1aa',
                            flexShrink: 0,
                            border: isAdmin ? '1px solid rgba(56, 189, 248, 0.3)' : '1px solid #27272a',
                          }}>
                            {role || 'member'}
                          </span>
                        </div>

                        {project.description ? (
                          <p style={{
                            color: '#94a3b8',
                            fontSize: '13px',
                            lineHeight: '1.6',
                            margin: '0 0 24px 0',
                            fontWeight: '500',
                          }}>
                            {project.description.length > 90
                              ? project.description.slice(0, 90) + '...'
                              : project.description}
                          </p>
                        ) : (
                          <p style={{ color: '#52525b', fontSize: '13px', margin: '0 0 24px 0', fontStyle: 'italic' }}>
                            No description provided.
                          </p>
                        )}
                      </div>

                      {/* Card Footer */}
                      <div style={{
                        paddingLeft: 6,
                        paddingTop: 14,
                        borderTop: '1px solid #18181b',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}>
                        {/* Member Stack */}
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          {project.members.slice(0, 4).map((m, i) => {
                            const avatarPalette = [
                              'linear-gradient(135deg, #0284c7, #38bdf8)',
                              'linear-gradient(135deg, #e11d48, #fb7185)',
                              'linear-gradient(135deg, #d97706, #fbbf24)',
                              'linear-gradient(135deg, #059669, #34d399)'
                            ];
                            const bgGradient = avatarPalette[i % avatarPalette.length];

                            return (
                              <div key={m.user._id} style={{
                                width: 26,
                                height: 26,
                                borderRadius: '50%',
                                background: bgGradient,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 10,
                                fontWeight: 800,
                                color: '#ffffff',
                                marginLeft: i > 0 ? -8 : 0,
                                border: '2px solid #09090b',
                                boxShadow: '0 2px 6px rgba(0,0,0,0.5)',
                              }}>
                                {m.user.name[0].toUpperCase()}
                              </div>
                            );
                          })}
                          <span style={{
                            fontSize: '12px',
                            color: '#71717a',
                            marginLeft: 10,
                            fontWeight: '600',
                          }}>
                            {project.members.length} {project.members.length === 1 ? 'member' : 'members'}
                          </span>
                        </div>

                        {/* Date Created */}
                        <span style={{
                          fontSize: '11px',
                          color: '#64748b',
                          fontWeight: '600',
                        }}>
                          {format(new Date(project.createdAt), 'MMM d, yyyy')}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </main>

        {/* Create Project Modal */}
        {showModal && (
          <div
            onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.75)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
              zIndex: 100,
            }}
          >
            <div style={{
              width: '100%',
              maxWidth: '460px',
              background: '#09090b',
              borderRadius: '24px',
              padding: '36px',
              boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.95), 0 0 1px 1px rgba(255, 255, 255, 0.05)',
              border: '1px solid #1e293b',
              boxSizing: 'border-box',
              position: 'relative'
            }}>
              {/* Top Modal Trim */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '2px',
                background: 'linear-gradient(90deg, #38bdf8 0%, #10b981 100%)'
              }} />

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '24px',
              }}>
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#ffffff', margin: '0 0 4px 0', letterSpacing: '-0.02em' }}>
                    Create Workspace
                  </h2>
                  <p style={{ fontSize: '13px', color: '#71717a', margin: 0 }}>
                    Initialize a new Kanban task repository.
                  </p>
                </div>

                <button
                  onClick={() => setShowModal(false)}
                  style={{
                    background: '#18181b',
                    border: '1px solid #27272a',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    fontSize: '14px',
                    fontWeight: '700',
                    color: '#a1a1aa',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#ffffff'; e.currentTarget.style.borderColor = '#52525b'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#a1a1aa'; e.currentTarget.style.borderColor = '#27272a'; }}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#71717a', marginBottom: '8px' }}>
                    Project Name *
                  </label>
                  <input
                    value={form.name}
                    onChange={set('name')}
                    placeholder="e.g. Core Infrastructure Sprint"
                    required
                    autoFocus
                    className="modal-input"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#71717a', marginBottom: '8px' }}>
                    Description
                  </label>
                  <textarea
                    value={form.description}
                    onChange={set('description')}
                    placeholder="Define goals, milestones, and deliverable scopes..."
                    rows={3}
                    className="modal-input"
                    style={{ resize: 'vertical', fontFamily: 'inherit' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    style={{
                      flex: 1,
                      padding: '13px',
                      background: '#121215',
                      color: '#a1a1aa',
                      border: '1px solid #27272a',
                      borderRadius: '12px',
                      fontSize: '13px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = '#ffffff'; e.currentTarget.style.borderColor = '#3f3f46'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = '#a1a1aa'; e.currentTarget.style.borderColor = '#27272a'; }}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={creating}
                    className="btn-cyber-cyan"
                    style={{
                      flex: 1,
                      padding: '13px',
                      background: successAnim ? '#10b981' : undefined
                    }}
                  >
                    {successAnim ? '✓ Created' : creating ? 'Initializing...' : 'Create Project'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProjectsPage;