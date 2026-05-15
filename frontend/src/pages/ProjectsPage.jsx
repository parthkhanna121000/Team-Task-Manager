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

  const set = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error('Project name required');
    setCreating(true);
    try {
      await createProject(form);
      setForm({ name: '', description: '' });
      setShowModal(false);
      toast.success('Project created');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create project');
    } finally {
      setCreating(false);
    }
  };

  const userRole = (project) =>
    project.members.find((m) => m.user._id === user?._id)?.role;

  return (
    <div className="page">
      <Navbar />
      <main className="container">

        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 32,
        }}>
          <div>
            <h1 style={{
              fontSize: 20,
              fontWeight: 600,
              letterSpacing: '-0.03em',
              color: 'var(--text-0)',
              marginBottom: 4,
            }}>
              Projects
            </h1>
            <p style={{ fontSize: 13, color: 'var(--text-2)' }}>
              {projects.length > 0
                ? `${projects.length} project${projects.length !== 1 ? 's' : ''}`
                : 'No projects yet'}
            </p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            New project
          </button>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="loading"><div className="spinner" /></div>
        ) : projects.length === 0 ? (
          <div className="empty">
            <svg className="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="3" />
              <path d="M9 12h6M12 9v6" />
            </svg>
            <p>Create your first project</p>
            <span>Invite your team and start tracking tasks together.</span>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 16,
          }}>
            {projects.map((project, i) => {
              const role = userRole(project);
              return (
                <Link key={project._id} to={`/projects/${project._id}`}>
                  <div
                    className="card card-hover"
                    style={{
                      animationDelay: `${i * 40}ms`,
                      height: '100%',
                      cursor: 'pointer',
                    }}
                  >
                    {/* Top bar */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      gap: 12,
                      marginBottom: 14,
                    }}>
                      <div style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        background: `hsl(${(project.name.charCodeAt(0) * 15) % 360}, 60%, 25%)`,
                        border: `1px solid hsl(${(project.name.charCodeAt(0) * 15) % 360}, 60%, 35%)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 15,
                        fontWeight: 700,
                        color: `hsl(${(project.name.charCodeAt(0) * 15) % 360}, 80%, 75%)`,
                        flexShrink: 0,
                      }}>
                        {project.name[0].toUpperCase()}
                      </div>

                      <span style={{
                        fontSize: 11,
                        fontWeight: 500,
                        padding: '3px 9px',
                        borderRadius: 100,
                        background: role === 'admin' ? 'var(--brand-dim)' : 'var(--surface-4)',
                        color: role === 'admin' ? 'var(--brand)' : 'var(--text-2)',
                        border: `1px solid ${role === 'admin' ? 'rgba(79,110,247,0.2)' : 'var(--border-1)'}`,
                        letterSpacing: '-0.01em',
                      }}>
                        {role}
                      </span>
                    </div>

                    <h3 style={{
                      fontSize: 15,
                      fontWeight: 600,
                      color: 'var(--text-0)',
                      letterSpacing: '-0.02em',
                      marginBottom: 6,
                      lineHeight: 1.3,
                    }}>
                      {project.name}
                    </h3>

                    {project.description && (
                      <p style={{
                        fontSize: 13,
                        color: 'var(--text-2)',
                        lineHeight: 1.5,
                        marginBottom: 16,
                      }}>
                        {project.description.length > 80
                          ? project.description.slice(0, 80) + '...'
                          : project.description}
                      </p>
                    )}

                    {/* Footer */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginTop: 'auto',
                      paddingTop: 14,
                      borderTop: '1px solid var(--border-0)',
                    }}>
                      {/* Avatars */}
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        {project.members.slice(0, 4).map((m, idx) => (
                          <div
                            key={m.user._id}
                            title={m.user.name}
                            style={{
                              width: 24,
                              height: 24,
                              borderRadius: '50%',
                              background: `hsl(${(m.user.name.charCodeAt(0) * 20) % 360}, 55%, 30%)`,
                              border: '2px solid var(--surface-1)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: 9,
                              fontWeight: 700,
                              color: `hsl(${(m.user.name.charCodeAt(0) * 20) % 360}, 70%, 75%)`,
                              marginLeft: idx > 0 ? -7 : 0,
                              position: 'relative',
                              zIndex: 4 - idx,
                            }}
                          >
                            {m.user.name[0].toUpperCase()}
                          </div>
                        ))}
                        <span style={{
                          fontSize: 12,
                          color: 'var(--text-2)',
                          marginLeft: 8,
                        }}>
                          {project.members.length} member{project.members.length !== 1 ? 's' : ''}
                        </span>
                      </div>

                      <span style={{ fontSize: 12, color: 'var(--text-3)' }}>
                        {format(new Date(project.createdAt), 'MMM d')}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>

      {/* Create modal */}
      {showModal && (
        <div className="overlay animate-fade-in" onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal animate-fade-up">
            <div className="modal-head">
              <span className="modal-title">New project</span>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="field">
                <label>Project name</label>
                <input
                  value={form.name}
                  onChange={set('name')}
                  placeholder="e.g. Q4 Marketing Campaign"
                  autoFocus
                />
              </div>
              <div className="field">
                <label>Description <span style={{ color: 'var(--text-3)' }}>(optional)</span></label>
                <textarea
                  value={form.description}
                  onChange={set('description')}
                  placeholder="What is this project about?"
                  rows={3}
                  style={{ resize: 'vertical' }}
                />
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                <button
                  type="button"
                  className="btn btn-ghost"
                  style={{ flex: 1 }}
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                  disabled={creating}
                >
                  {creating ? 'Creating...' : 'Create project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;