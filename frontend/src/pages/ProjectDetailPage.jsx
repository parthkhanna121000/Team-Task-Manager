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
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)' }}>
        <Navbar />
        <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0' }}>
          <div className="spinner" style={{ width: '40px', height: '40px', border: '4px solid rgba(255,255,255,0.4)', borderTopColor: '#0f172a', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)' }}>
        <Navbar />
        <div className="wrap" style={{ textAlign: 'center', padding: '60px 0' }}>
          <p style={{ color: '#475569', fontWeight: '600', marginBottom: '16px' }}>Project not found.</p>
          <Link to="/projects" style={{ color: '#4f46e5', fontSize: '13px', fontWeight: '700', textDecoration: 'none' }}>← Back to Projects</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
      position: 'relative',
      overflowX: 'hidden',
    }}>
      {/* Background Glowing Ambient Orbs */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        left: '-5%',
        width: '500px',
        height: '500px',
        background: 'rgba(255, 154, 201, 0.35)',
        borderRadius: '50%',
        filter: 'blur(90px)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-10%',
        right: '-5%',
        width: '500px',
        height: '500px',
        background: 'rgba(116, 235, 213, 0.35)',
        borderRadius: '50%',
        filter: 'blur(90px)',
        pointerEvents: 'none',
      }} />

      <Navbar />
      
      <main className="wrap" style={{ position: 'relative', zIndex: 1, paddingBottom: '60px' }}>

        {/* Breadcrumb Pill */}
        <div style={{ marginBottom: 20 }}>
          <Link
            to="/projects"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              background: 'rgba(255, 255, 255, 0.6)',
              backdropFilter: 'blur(12px)',
              borderRadius: '9999px',
              fontSize: '12px',
              fontWeight: '600',
              color: '#475569',
              textDecoration: 'none',
              border: '1px solid rgba(255, 255, 255, 0.8)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)';
              e.currentTarget.style.color = '#0f172a';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.6)';
              e.currentTarget.style.color = '#475569';
            }}
          >
            ← Back to Projects
          </Link>
        </div>

        {/* Glassmorphic Header Card */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.75)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          padding: '28px 32px',
          border: '1px solid rgba(255, 255, 255, 0.9)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.04)',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 20,
          marginBottom: 24,
          flexWrap: 'wrap',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <h1 style={{
                fontSize: '26px',
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
                padding: '4px 10px',
                borderRadius: '9999px',
                background: role === 'admin' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(226, 232, 240, 0.8)',
                color: role === 'admin' ? '#6366f1' : '#64748b',
                fontWeight: '700',
              }}>
                {role}
              </span>
            </div>
            {project.description && (
              <p style={{ color: '#64748b', fontSize: '14px', margin: 0, fontWeight: '500', maxWidth: '600px', lineHeight: '1.5' }}>
                {project.description}
              </p>
            )}
          </div>

          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            <Link
              to={`/projects/${projectId}/dashboard`}
              style={animatedButtonStyle('#f1f5f9', '#334155', 'rgba(0,0,0,0.02)')}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              📊 Dashboard
            </Link>

            {role === 'admin' && activeTab === 'board' && (
              <button
                onClick={() => { setEditingTask(null); setShowTaskModal(true); }}
                style={animatedButtonStyle('linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', '#ffffff', '0 10px 20px rgba(99, 102, 241, 0.3)')}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                + New Task
              </button>
            )}

            {role === 'admin' && (
              <button
                onClick={handleDeleteProject}
                style={animatedButtonStyle('rgba(239, 68, 68, 0.1)', '#ef4444', 'none')}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#ef4444';
                  e.currentTarget.style.color = '#ffffff';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                  e.currentTarget.style.color = '#ef4444';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Delete
              </button>
            )}
          </div>
        </div>

        {/* Glassmorphic Tabs Navigation */}
        <div style={{
          display: 'flex',
          gap: 12,
          marginBottom: 24,
          background: 'rgba(255, 255, 255, 0.6)',
          backdropFilter: 'blur(16px)',
          padding: '6px',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.8)',
          width: 'fit-content',
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
                  boxShadow: isActive ? '0 8px 20px rgba(15, 23, 42, 0.15)' : 'none',
                  transition: 'all 0.25s ease',
                  textTransform: 'capitalize',
                }}
              >
                {tab === 'board' ? `Task Board (${tasks.length})` : `Team Members (${project.members.length})`}
              </button>
            );
          })}
        </div>

        {/* Tab Content Container */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.75)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          padding: '24px',
          border: '1px solid rgba(255, 255, 255, 0.9)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.04)',
        }}>
          {activeTab === 'board' && (
            tasksLoading
              ? <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}><div className="spinner" style={{ width: '36px', height: '36px', border: '4px solid rgba(0,0,0,0.1)', borderTopColor: '#0f172a', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /></div>
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

// Reusable helper style for animated action buttons with micro-interactions
const animatedButtonStyle = (bg, color, shadow) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '12px 20px',
  background: bg,
  color: color,
  border: 'none',
  borderRadius: '16px',
  fontSize: '13px',
  fontWeight: '700',
  cursor: 'pointer',
  boxShadow: shadow,
  textDecoration: 'none',
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
});

export default ProjectDetailPage;