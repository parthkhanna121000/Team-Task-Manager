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
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />

      <main className="wrap">
        {/* Page header */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          marginBottom: 28,
          paddingBottom: 20,
          borderBottom: '1px solid var(--border)',
        }}>
          <div>
            <p style={{
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: 10,
              color: 'var(--txt-3)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: 6,
            }}>
              {projects.length} project{projects.length !== 1 ? 's' : ''}
            </p>
            <h1 style={{
              fontSize: 22,
              fontWeight: 600,
              letterSpacing: '-0.02em',
              color: 'var(--txt)',
            }}>
              Your projects
            </h1>
          </div>
          <button className="btn btn-amber" onClick={() => setShowModal(true)}>
            + New project
          </button>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="loading"><div className="spinner" /></div>
        ) : projects.length === 0 ? (
          <div className="empty">
            <p style={{ color: 'var(--txt-3)', fontFamily: 'IBM Plex Mono, monospace', fontSize: 12 }}>
              no projects yet
            </p>
            <p style={{ marginTop: 6, fontSize: 13, color: 'var(--txt-3)' }}>
              Create one to get started.
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 14,
          }}>
            {projects.map((project) => {
              const role = userRole(project);
              return (
                <Link key={project._id} to={`/projects/${project._id}`}>
                  <div
                    className="card"
                    style={{
                      cursor: 'pointer',
                      transition: 'border-color 120ms',
                      height: '100%',
                      position: 'relative',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--border-2)'}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
                  >
                    {/* Role indicator — left border */}
                    <div style={{
                      position: 'absolute',
                      top: 16,
                      bottom: 16,
                      left: 0,
                      width: 3,
                      borderRadius: '0 2px 2px 0',
                      background: role === 'admin' ? 'var(--amber)' : 'var(--bg-4)',
                    }} />

                    <div style={{ paddingLeft: 10 }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        gap: 10,
                        marginBottom: 8,
                      }}>
                        <h3 style={{
                          fontSize: 15,
                          fontWeight: 600,
                          color: 'var(--txt)',
                          letterSpacing: '-0.01em',
                          lineHeight: 1.3,
                        }}>
                          {project.name}
                        </h3>
                        <span style={{
                          fontFamily: 'IBM Plex Mono, monospace',
                          fontSize: 10,
                          letterSpacing: '0.06em',
                          textTransform: 'uppercase',
                          color: role === 'admin' ? 'var(--amber-text)' : 'var(--txt-3)',
                          flexShrink: 0,
                          marginTop: 2,
                        }}>
                          {role}
                        </span>
                      </div>

                      {project.description && (
                        <p style={{
                          color: 'var(--txt-3)',
                          fontSize: 12,
                          lineHeight: 1.5,
                          marginBottom: 14,
                        }}>
                          {project.description.length > 75
                            ? project.description.slice(0, 75) + '...'
                            : project.description}
                        </p>
                      )}

                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: project.description ? 0 : 14,
                        paddingTop: 12,
                        borderTop: '1px solid var(--border)',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          {project.members.slice(0, 4).map((m, i) => (
                            <div key={m.user._id} style={{
                              width: 22,
                              height: 22,
                              borderRadius: '50%',
                              background: 'var(--bg-4)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: 9,
                              fontWeight: 600,
                              color: 'var(--txt-2)',
                              fontFamily: 'IBM Plex Mono, monospace',
                              marginLeft: i > 0 ? -6 : 0,
                              border: '1.5px solid var(--bg-2)',
                            }}>
                              {m.user.name[0].toUpperCase()}
                            </div>
                          ))}
                          <span style={{
                            fontSize: 11,
                            color: 'var(--txt-3)',
                            marginLeft: 6,
                            fontFamily: 'IBM Plex Mono, monospace',
                          }}>
                            {project.members.length}
                          </span>
                        </div>
                        <span style={{
                          fontSize: 11,
                          color: 'var(--txt-3)',
                          fontFamily: 'IBM Plex Mono, monospace',
                        }}>
                          {format(new Date(project.createdAt), 'MMM d')}
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

      {/* Create modal */}
      {showModal && (
        <div className="overlay" onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <div className="modal-head">
              <span className="modal-title">New project</span>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="field">
                <label>Name *</label>
                <input
                  value={form.name}
                  onChange={set('name')}
                  placeholder="e.g. Q4 Marketing Campaign"
                  autoFocus
                />
              </div>
              <div className="field">
                <label>Description</label>
                <textarea
                  value={form.description}
                  onChange={set('description')}
                  placeholder="What is this project about?"
                  rows={3}
                  style={{ resize: 'vertical' }}
                />
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
                <button
                  type="button"
                  className="btn btn-ghost"
                  style={{ flex: 1, justifyContent: 'center' }}
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-amber"
                  style={{ flex: 1, justifyContent: 'center' }}
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