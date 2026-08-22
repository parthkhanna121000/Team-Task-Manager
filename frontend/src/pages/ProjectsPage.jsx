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
      toast.success('Project created successfully!');
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
          @keyframes shine {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          .proj-shining-btn {
            position: relative;
            overflow: hidden;
            transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .proj-shining-btn::after {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(
              90deg,
              transparent,
              rgba(255, 255, 255, 0.4),
              transparent
            );
            transition: none;
          }
          .proj-shining-btn:hover::after {
            animation: shine 0.75s ease-in-out;
          }
          .proj-shining-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(15, 23, 42, 0.25);
          }
        `}
      </style>

      <div style={{
        minHeight: '100vh',
        background: '#f8fafc',
        position: 'relative',
        overflowX: 'hidden',
        color: '#0f172a',
      }}>
        {/* Subtle Light Ambient Glowing Orbs */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          left: '-5%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.07) 0%, rgba(0,0,0,0) 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-10%',
          right: '-5%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(14, 165, 233, 0.07) 0%, rgba(0,0,0,0) 70%)',
          pointerEvents: 'none',
        }} />

        <Navbar />

        <main className="wrap" style={{ position: 'relative', zIndex: 1, paddingBottom: '80px', maxWidth: '1200px', margin: '0 auto', paddingLeft: '24px', paddingRight: '24px', paddingTop: '32px' }}>
          
          {/* Page Header Card */}
          <div style={{
            background: '#ffffff',
            borderRadius: '24px',
            padding: '32px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.03)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 32,
            flexWrap: 'wrap',
            gap: 16,
          }}>
            <div>
              <p style={{
                fontFamily: 'system-ui, -apple-system, sans-serif',
                fontSize: '11px',
                fontWeight: '700',
                color: '#64748b',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: '6px',
                margin: '0 0 4px 0',
              }}>
                {projects.length} project{projects.length !== 1 ? 's' : ''} available
              </p>
              <h1 style={{
                fontSize: '28px',
                fontWeight: '800',
                color: '#0f172a',
                letterSpacing: '-0.03em',
                margin: 0,
              }}>
                Your Projects
              </h1>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="proj-shining-btn"
              style={{
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #0f172a 0%, #334155 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '16px',
                fontSize: '14px',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: '0 8px 20px rgba(15, 23, 42, 0.15)',
              }}
            >
              + New Project
            </button>
          </div>

          {/* Grid Container */}
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
              <div className="spinner" style={{ width: '40px', height: '40px', border: '4px solid #e2e8f0', borderTopColor: '#0f172a', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            </div>
          ) : projects.length === 0 ? (
            <div style={{
              background: '#ffffff',
              borderRadius: '24px',
              padding: '60px',
              textAlign: 'center',
              border: '1px solid #e2e8f0',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.02)',
            }}>
              <p style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: '13px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 8px 0' }}>
                No projects yet
              </p>
              <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
                Create your first project to get started collaborating.
              </p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: 20,
            }}>
              {projects.map((project) => {
                const role = userRole(project);
                const isAdmin = role === 'admin';
                return (
                  <Link key={project._id} to={`/projects/${project._id}`} style={{ textDecoration: 'none' }}>
                    <div
                      style={{
                        background: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '24px',
                        padding: '24px',
                        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.03)',
                        cursor: 'pointer',
                        transition: 'all 0.25s ease',
                        height: '100%',
                        position: 'relative',
                        overflow: 'hidden',
                        boxSizing: 'border-box',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-4px)';
                        e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.08)';
                        e.currentTarget.style.borderColor = '#cbd5e1';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.03)';
                        e.currentTarget.style.borderColor = '#e2e8f0';
                      }}
                    >
                      {/* Left indicator accent border */}
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        bottom: 0,
                        left: 0,
                        width: 4,
                        background: isAdmin ? 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)' : '#cbd5e1',
                      }} />

                      <div style={{ paddingLeft: 8 }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          justifyContent: 'space-between',
                          gap: 12,
                          marginBottom: 10,
                        }}>
                          <h3 style={{
                            fontSize: '17px',
                            fontWeight: '800',
                            color: '#0f172a',
                            letterSpacing: '-0.02em',
                            margin: 0,
                            lineHeight: '1.4',
                          }}>
                            {project.name}
                          </h3>
                          <span style={{
                            fontSize: '10px',
                            fontWeight: '700',
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                            padding: '4px 10px',
                            borderRadius: '9999px',
                            background: isAdmin ? '#eff6ff' : '#f1f5f9',
                            color: isAdmin ? '#2563eb' : '#64748b',
                            flexShrink: 0,
                            border: isAdmin ? '1px solid #bfdbfe' : '1px solid #e2e8f0',
                          }}>
                            {role || 'member'}
                          </span>
                        </div>

                        {project.description && (
                          <p style={{
                            color: '#64748b',
                            fontSize: '13px',
                            lineHeight: '1.6',
                            margin: '0 0 20px 0',
                            fontWeight: '500',
                          }}>
                            {project.description.length > 80
                              ? project.description.slice(0, 80) + '...'
                              : project.description}
                          </p>
                        )}

                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginTop: project.description ? 0 : 20,
                          paddingTop: 14,
                          borderTop: '1px solid #f1f5f9',
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            {project.members.slice(0, 4).map((m, i) => (
                              <div key={m.user._id} style={{
                                width: 26,
                                height: 26,
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 10,
                                fontWeight: 700,
                                color: '#ffffff',
                                marginLeft: i > 0 ? -8 : 0,
                                border: '2px solid #ffffff',
                                boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                              }}>
                                {m.user.name[0].toUpperCase()}
                              </div>
                            ))}
                            <span style={{
                              fontSize: '12px',
                              color: '#64748b',
                              marginLeft: 10,
                              fontWeight: '600',
                            }}>
                              {project.members.length} member{project.members.length !== 1 ? 's' : ''}
                            </span>
                          </div>

                          <span style={{
                            fontSize: '12px',
                            color: '#94a3b8',
                            fontWeight: '600',
                          }}>
                            {format(new Date(project.createdAt), 'MMM d, yyyy')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </main>

        {/* Create Modal */}
        {showModal && (
          <div
            onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(15, 23, 42, 0.45)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
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
              background: '#ffffff',
              borderRadius: '28px',
              padding: '36px',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
              border: '1px solid #e2e8f0',
              boxSizing: 'border-box',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '24px',
              }}>
                <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                  Create New Project
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  style={{
                    background: '#f1f5f9',
                    border: 'none',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    fontSize: '16px',
                    fontWeight: '700',
                    color: '#64748b',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#475569', marginBottom: '8px' }}>
                    Project Name *
                  </label>
                  <input
                    value={form.name}
                    onChange={set('name')}
                    placeholder="e.g. Remote Team Collaboration Hub"
                    required
                    autoFocus
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #cbd5e1',
                      borderRadius: '16px',
                      fontSize: '14px',
                      color: '#0f172a',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#475569', marginBottom: '8px' }}>
                    Description
                  </label>
                  <textarea
                    value={form.description}
                    onChange={set('description')}
                    placeholder="Streamline internal workflows and manage weekly goals..."
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #cbd5e1',
                      borderRadius: '16px',
                      fontSize: '14px',
                      color: '#0f172a',
                      outline: 'none',
                      resize: 'vertical',
                      boxSizing: 'border-box',
                      fontFamily: 'inherit',
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    style={{
                      flex: 1,
                      padding: '14px',
                      background: '#f1f5f9',
                      color: '#475569',
                      border: 'none',
                      borderRadius: '16px',
                      fontSize: '14px',
                      fontWeight: '700',
                      cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creating}
                    className="proj-shining-btn"
                    style={{
                      flex: 1,
                      padding: '14px',
                      background: successAnim ? '#10b981' : '#0f172a',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '16px',
                      fontSize: '14px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      boxShadow: '0 10px 20px rgba(15, 23, 42, 0.2)',
                      transition: 'background 0.3s ease',
                    }}
                  >
                    {successAnim ? '✓ Created!' : creating ? 'Creating...' : 'Create Project'}
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