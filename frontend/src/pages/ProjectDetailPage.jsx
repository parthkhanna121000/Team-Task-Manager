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
    if (!confirm(`Delete "${project.name}"? This cannot be undone.`)) return;
    try {
      await axiosClient.delete(`/projects/${projectId}`);
      toast.success('Project deleted');
      navigate('/projects');
    } catch {
      toast.error('Delete failed');
    }
  };

  if (projLoading) {
    return (
      <div className="page">
        <Navbar />
        <div className="loading"><div className="spinner" /></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="page">
        <Navbar />
        <div className="container">
          <p style={{ color: 'var(--text-2)' }}>Project not found.</p>
          <Link to="/projects" style={{ color: 'var(--brand)', fontSize: 13 }}>← Back to projects</Link>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'board', label: 'Board', count: tasks.length },
    { id: 'members', label: 'Members', count: project.members.length },
  ];

  return (
    <div className="page">
      <Navbar />
      <main className="container">

        {/* Breadcrumb */}
        <div style={{ marginBottom: 20 }}>
          <Link
            to="/projects"
            style={{
              fontSize: 13,
              color: 'var(--text-2)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              transition: 'color 150ms',
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--text-0)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-2)'}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Projects
          </Link>
        </div>

        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 16,
          marginBottom: 28,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 11,
              background: `hsl(${(project.name.charCodeAt(0) * 15) % 360}, 60%, 22%)`,
              border: `1px solid hsl(${(project.name.charCodeAt(0) * 15) % 360}, 60%, 32%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 16,
              fontWeight: 700,
              color: `hsl(${(project.name.charCodeAt(0) * 15) % 360}, 80%, 72%)`,
              flexShrink: 0,
            }}>
              {project.name[0].toUpperCase()}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <h1 style={{
                  fontSize: 18,
                  fontWeight: 600,
                  letterSpacing: '-0.03em',
                  color: 'var(--text-0)',
                }}>
                  {project.name}
                </h1>
                <span className="badge" style={{
                  background: role === 'admin' ? 'var(--brand-dim)' : 'var(--surface-4)',
                  color: role === 'admin' ? 'var(--brand)' : 'var(--text-2)',
                  border: `1px solid ${role === 'admin' ? 'rgba(79,110,247,0.2)' : 'var(--border-1)'}`,
                  fontSize: 11,
                }}>
                  {role}
                </span>
              </div>
              {project.description && (
                <p style={{ fontSize: 13, color: 'var(--text-2)', marginTop: 3 }}>
                  {project.description}
                </p>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
            <Link
              to={`/projects/${projectId}/dashboard`}
              className="btn btn-ghost btn-sm"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <rect x="1" y="9" width="5" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                <rect x="10" y="5" width="5" height="10" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                <rect x="5.5" y="1" width="5" height="14" rx="1" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
              Dashboard
            </Link>
            {role === 'admin' && activeTab === 'board' && (
              <button
                className="btn btn-primary btn-sm"
                onClick={() => { setEditingTask(null); setShowTaskModal(true); }}
              >
                + Add task
              </button>
            )}
            {role === 'admin' && (
              <button className="btn btn-danger btn-sm" onClick={handleDeleteProject}>
                Delete
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: 2,
          marginBottom: 24,
          borderBottom: '1px solid var(--border-0)',
          paddingBottom: 0,
        }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 7,
                padding: '9px 14px',
                fontSize: 13.5,
                fontWeight: 500,
                color: activeTab === tab.id ? 'var(--text-0)' : 'var(--text-2)',
                borderBottom: `2px solid ${activeTab === tab.id ? 'var(--brand)' : 'transparent'}`,
                marginBottom: -1,
                transition: 'color 150ms',
                letterSpacing: '-0.01em',
              }}
            >
              {tab.label}
              <span style={{
                fontSize: 11,
                fontWeight: 500,
                padding: '1px 6px',
                borderRadius: 100,
                background: activeTab === tab.id ? 'var(--brand-dim)' : 'var(--surface-4)',
                color: activeTab === tab.id ? 'var(--brand)' : 'var(--text-3)',
                border: `1px solid ${activeTab === tab.id ? 'rgba(79,110,247,0.2)' : 'var(--border-0)'}`,
              }}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Content */}
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