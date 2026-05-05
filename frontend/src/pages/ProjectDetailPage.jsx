import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProject } from '../hooks/useProjects';
import { useTasks } from '../hooks/useTasks';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import TaskBoard from '../components/TaskBoard';
import MemberList from '../components/MemberList';
import CreateTaskModal from '../components/CreateTaskModal';
import toast from 'react-hot-toast';
import axiosClient from '../api/axiosClient';

const ProjectDetailPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { project, role, loading: projLoading, addMember, removeMember } = useProject(projectId);
  const { tasks, loading: tasksLoading, createTask, updateTask, deleteTask } = useTasks(projectId);

  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [activeTab, setActiveTab] = useState('board');

  const handleUpdateStatus = async (taskId, status) => {
    try {
      await updateTask(taskId, { status });
      toast.success('Status updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  const handleDelete = async (taskId) => {
    if (!confirm('Delete this task?')) return;
    try {
      await deleteTask(taskId);
      toast.success('Task deleted');
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setShowTaskModal(true);
  };

  const handleTaskSubmit = async (payload) => {
    if (editingTask) {
      await updateTask(editingTask._id, payload);
      toast.success('Task updated');
    } else {
      await createTask(payload);
      toast.success('Task created');
    }
  };

  const handleDeleteProject = async () => {
    if (!confirm(`Delete project "${project.name}"? This cannot be undone.`)) return;
    try {
      await axiosClient.delete(`/api/projects/${projectId}`);
      toast.success('Project deleted');
      navigate('/projects');
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  if (projLoading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
        <Navbar />
        <div className="loading"><div className="spinner" /></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
        <Navbar />
        <div className="wrap">
          <p style={{ color: 'var(--txt-3)' }}>Project not found.</p>
          <Link to="/projects" style={{ color: 'var(--amber-text)', fontSize: 13 }}>← Back</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />
      <main className="wrap">

        {/* Breadcrumb */}
        <div style={{ marginBottom: 16 }}>
          <Link
            to="/projects"
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
            ← projects
          </Link>
        </div>

        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 16,
          marginBottom: 22,
          paddingBottom: 18,
          borderBottom: '1px solid var(--border)',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <h1 style={{
                fontSize: 20,
                fontWeight: 600,
                letterSpacing: '-0.02em',
                color: 'var(--txt)',
              }}>
                {project.name}
              </h1>
              <span style={{
                fontFamily: 'IBM Plex Mono, monospace',
                fontSize: 10,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                padding: '2px 7px',
                borderRadius: 2,
                background: role === 'admin' ? 'var(--amber-dim)' : 'var(--bg-4)',
                color: role === 'admin' ? 'var(--amber-text)' : 'var(--txt-3)',
                border: role === 'admin' ? '1px solid rgba(217,119,6,0.2)' : '1px solid var(--border)',
              }}>
                {role}
              </span>
            </div>
            {project.description && (
              <p style={{ color: 'var(--txt-3)', fontSize: 13 }}>{project.description}</p>
            )}
          </div>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
            <Link
              to={`/projects/${projectId}/dashboard`}
              className="btn btn-ghost btn-sm"
            >
              dashboard
            </Link>
            {role === 'admin' && activeTab === 'board' && (
              <button
                className="btn btn-amber btn-sm"
                onClick={() => { setEditingTask(null); setShowTaskModal(true); }}
              >
                + task
              </button>
            )}
            {role === 'admin' && (
              <button className="btn btn-danger btn-sm" onClick={handleDeleteProject}>
                delete
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: 0,
          marginBottom: 22,
          borderBottom: '1px solid var(--border)',
        }}>
          {['board', 'members'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '8px 16px',
                fontSize: 13,
                fontFamily: 'IBM Plex Mono, monospace',
                color: activeTab === tab ? 'var(--amber-text)' : 'var(--txt-3)',
                borderBottom: `2px solid ${activeTab === tab ? 'var(--amber)' : 'transparent'}`,
                marginBottom: -1,
                transition: 'color 120ms',
                letterSpacing: '0.02em',
              }}
            >
              {tab === 'board' ? `board (${tasks.length})` : `members (${project.members.length})`}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === 'board' && (
          tasksLoading
            ? <div className="loading"><div className="spinner" /></div>
            : <TaskBoard
                tasks={tasks}
                role={role}
                currentUserId={user?._id}
                onUpdateStatus={handleUpdateStatus}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
        )}

        {activeTab === 'members' && (
          <MemberList
            project={project}
            role={role}
            onAddMember={addMember}
            onRemoveMember={removeMember}
          />
        )}
      </main>

      {showTaskModal && (
        <CreateTaskModal
          members={project.members}
          onSubmit={handleTaskSubmit}
          onClose={() => { setShowTaskModal(false); setEditingTask(null); }}
          editTask={editingTask}
        />
      )}
    </div>
  );
};

export default ProjectDetailPage;