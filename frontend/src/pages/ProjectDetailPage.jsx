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
      await axiosClient.delete(`/projects/${projectId}`);
      toast.success('Project deleted');
      navigate('/projects');
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  if (projLoading) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
        <Navbar />
        <div style={{ display: 'flex', justifyContent: 'center', padding: '120px 0' }}>
          <div className="spinner" style={{ width: '40px', height: '40px', border: '4px solid #e2e8f0', borderTopColor: '#0f172a', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
        <Navbar />
        <div className="wrap" style={{ textAlign: 'center', padding: '80px 0' }}>
          <p style={{ color: '#64748b', fontWeight: '600', marginBottom: '16px', fontSize: '15px' }}>Project not found.</p>
          <Link to="/projects" style={{ color: '#2563eb', fontSize: '13px', fontWeight: '700', textDecoration: 'none' }}>← Back to Projects</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f8fafc',
      position: 'relative',
      overflowX: 'hidden',
      color: '#0f172a',
    }}>
      <Navbar />
      
      <main className="wrap" style={{ position: 'relative', zIndex: 1, paddingBottom: '80px', maxWidth: '1200px', margin: '0 auto', paddingLeft: '24px', paddingRight: '24px', paddingTop: '32px' }}>

        {/* Breadcrumb Navigation Pill */}
        <div style={{ marginBottom: 24 }}>
          <Link
            to="/projects"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              background: '#ffffff',
              borderRadius: '9999px',
              fontSize: '12px',
              fontWeight: '600',
              color: '#475569',
              textDecoration: 'none',
              border: '1px solid #e2e8f0',
              boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = '#cbd5e1';
              e.currentTarget.style.color = '#0f172a';
              e.currentTarget.style.transform = 'translateX(-2px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = '#e2e8f0';
              e.currentTarget.style.color = '#475569';
              e.currentTarget.style.transform = 'translateX(0)';
            }}
          >
            ← Back to Projects
          </Link>
        </div>

        {/* Clean Minimalist Header Card */}
        <div style={{
          background: '#ffffff',
          borderRadius: '24px',
          padding: '32px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.03)',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 24,
          marginBottom: 28,
          flexWrap: 'wrap',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
              <h1 style={{
                fontSize: '28px',
                fontWeight: '800',
                letterSpacing: '-0.03em',
                color: '#0f172a',
                margin: 0,
              }}>
                {project.name}
              </h1>
              <span style={{
                fontSize: '10px',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                padding: '4px 12px',
                borderRadius: '9999px',
                background: role === 'admin' ? '#eff6ff' : '#f1f5f9',
                color: role === 'admin' ? '#2563eb' : '#64748b',
                fontWeight: '700',
                border: role === 'admin' ? '1px solid #bfdbfe' : '1px solid #e2e8f0',
              }}>
                {role}
              </span>
            </div>
            {project.description && (
              <p style={{ color: '#64748b', fontSize: '14px', margin: 0, fontWeight: '500', maxWidth: '650px', lineHeight: '1.6' }}>
                {project.description}
              </p>
            )}
          </div>

          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <Link
              to={`/projects/${projectId}/dashboard`}
              style={lightButtonStyle('#f8fafc', '#334155', '#e2e8f0')}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#f1f5f9';
                e.currentTarget.style.borderColor = '#cbd5e1';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = '#f8fafc';
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              📊 Dashboard
            </Link>

            {role === 'admin' && activeTab === 'board' && (
              <button
                onClick={() => { setEditingTask(null); setShowTaskModal(true); }}
                style={lightButtonStyle('#0f172a', '#ffffff', '#0f172a')}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(15, 23, 42, 0.15)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                + New Task
              </button>
            )}

            {role === 'admin' && (
              <button
                onClick={handleDeleteProject}
                style={lightButtonStyle('#fef2f2', '#dc2626', '#fecaca')}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#dc2626';
                  e.currentTarget.style.color = '#ffffff';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = '#fef2f2';
                  e.currentTarget.style.color = '#dc2626';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Delete
              </button>
            )}
          </div>
        </div>

        {/* Clean Pill Tabs Navigation */}
        <div style={{
          display: 'flex',
          gap: 8,
          marginBottom: 24,
          background: '#ffffff',
          padding: '6px',
          borderRadius: '20px',
          border: '1px solid #e2e8f0',
          width: 'fit-content',
          boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
        }}>
          {['board', 'members'].map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '10px 24px',
                  fontSize: '13px',
                  fontWeight: '700',
                  borderRadius: '14px',
                  border: 'none',
                  background: isActive ? '#0f172a' : 'transparent',
                  color: isActive ? '#ffffff' : '#64748b',
                  cursor: 'pointer',
                  boxShadow: isActive ? '0 4px 12px rgba(15, 23, 42, 0.15)' : 'none',
                  transition: 'all 0.25s ease',
                  textTransform: 'capitalize',
                }}
              >
                {tab === 'board' ? `Task Board (${tasks.length})` : `Team Members (${project.members.length})`}
              </button>
            );
          })}
        </div>

        {/* Content Container */}
        <div style={{
          background: '#ffffff',
          borderRadius: '24px',
          padding: '32px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.03)',
        }}>
          {activeTab === 'board' && (
            tasksLoading
              ? <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}><div className="spinner" style={{ width: '36px', height: '36px', border: '4px solid #e2e8f0', borderTopColor: '#0f172a', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /></div>
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
        </div>
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

// Reusable helper style for polished light-theme buttons
const lightButtonStyle = (bg, color, borderColor) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '12px 20px',
  background: bg,
  color: color,
  border: `1px solid ${borderColor}`,
  borderRadius: '14px',
  fontSize: '13px',
  fontWeight: '700',
  cursor: 'pointer',
  textDecoration: 'none',
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  boxSizing: 'border-box',
});

export default ProjectDetailPage;