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
import SprintTelemetryDashboard from '../components/SprintTelemetryDashboard';
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
      <div style={{ minHeight: '100vh', width: '100vw', background: '#000000', color: '#f8fafc' }}>
        <Navbar />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '120px 0', gap: 16 }}>
          <div style={{
            width: '42px',
            height: '42px',
            border: '3px solid #1e293b',
            borderTopColor: '#38bdf8',
            borderRadius: '50%',
            animation: 'spin 0.7s linear infinite'
          }} />
          <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '700', letterSpacing: '0.06em' }}>
            SYNCHRONIZING WORKSPACE...
          </span>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div style={{ minHeight: '100vh', width: '100vw', background: '#000000', color: '#f8fafc' }}>
        <Navbar />
        <div style={{ textAlign: 'center', padding: '100px 24px' }}>
          <div style={{
            display: 'inline-flex',
            padding: '28px',
            background: '#09090b',
            border: '1px solid #1e293b',
            borderRadius: '24px',
            flexDirection: 'column',
            alignItems: 'center',
            maxWidth: '420px'
          }}>
            <span style={{ fontSize: '32px', marginBottom: '12px' }}>📁</span>
            <p style={{ color: '#94a3b8', fontWeight: '600', marginBottom: '16px', fontSize: '15px' }}>Project not found.</p>
            <Link to="/projects" style={{
              color: '#38bdf8',
              fontSize: '13px',
              fontWeight: '700',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              ← Return to Workspaces
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cyber-obsidian-workspace">
      <style>
        {`
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
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }

          @keyframes spin {
            to { transform: rotate(360deg); }
          }

          @keyframes btnSheen {
            0% { left: -120%; }
            100% { left: 180%; }
          }

          .cyber-obsidian-workspace {
            min-height: 100vh;
            width: 100vw;
            background-color: #000000;
            background-image: 
              radial-gradient(circle at 10% 5%, rgba(56, 189, 248, 0.08) 0%, transparent 40%),
              radial-gradient(circle at 90% 12%, rgba(244, 63, 94, 0.06) 0%, transparent 45%),
              radial-gradient(circle at 50% 60%, rgba(16, 185, 129, 0.05) 0%, transparent 50%),
              linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
            background-size: 100% 100%, 100% 100%, 100% 100%, 48px 48px, 48px 48px;
            color: #f8fafc;
            font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'SF Pro Display', Roboto, sans-serif;
            position: relative;
            overflow-x: hidden;
          }

          .workspace-anim {
            animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }

          /* Obsidian Card Bases */
          .obsidian-panel {
            background: #09090b;
            border: 1px solid #1e293b;
            border-radius: 24px;
            position: relative;
            overflow: hidden;
            box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.8);
          }

          /* Dynamic Interactive Buttons */
          .btn-primary-cyan {
            position: relative;
            overflow: hidden;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            padding: 10px 22px;
            background: linear-gradient(135deg, #38bdf8 0%, #0284c7 100%);
            color: #000000;
            border: none;
            border-radius: 12px;
            font-size: 13px;
            font-weight: 800;
            cursor: pointer;
            text-decoration: none;
            box-shadow: 0 4px 18px rgba(56, 189, 248, 0.3);
            transition: transform 0.18s ease, box-shadow 0.2s ease;
          }

          .btn-primary-cyan::after {
            content: '';
            position: absolute;
            top: 0;
            left: -120%;
            width: 80%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent);
            transform: skewX(-20deg);
          }

          .btn-primary-cyan:hover::after {
            animation: btnSheen 0.75s cubic-bezier(0.16, 1, 0.3, 1);
          }

          .btn-primary-cyan:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(56, 189, 248, 0.45);
          }

          .btn-primary-cyan:active {
            transform: translateY(1px) scale(0.98);
          }

          /* Amber Dashboard Pill Button */
          .btn-action-amber {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 10px 18px;
            background: rgba(245, 158, 11, 0.1);
            color: #f59e0b;
            border: 1px solid rgba(245, 158, 11, 0.3);
            border-radius: 12px;
            font-size: 13px;
            font-weight: 700;
            cursor: pointer;
            text-decoration: none;
            transition: all 0.2s ease;
          }

          .btn-action-amber:hover {
            background: rgba(245, 158, 11, 0.18);
            border-color: #f59e0b;
            color: #ffffff;
            transform: translateY(-2px);
            box-shadow: 0 6px 18px rgba(245, 158, 11, 0.2);
          }

          /* Destructive Red/Pink Action */
          .btn-action-destructive {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 10px 18px;
            background: rgba(244, 63, 94, 0.08);
            color: #f43f5e;
            border: 1px solid rgba(244, 63, 94, 0.3);
            border-radius: 12px;
            font-size: 13px;
            font-weight: 700;
            cursor: pointer;
            text-decoration: none;
            transition: all 0.2s ease;
          }

          .btn-action-destructive:hover {
            background: #f43f5e;
            color: #ffffff;
            transform: translateY(-2px);
            box-shadow: 0 6px 18px rgba(244, 63, 94, 0.35);
          }

          /* Back Navigation Button */
          .btn-back-pill {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 7px 16px;
            background: #09090b;
            border: 1px solid #1e293b;
            border-radius: 9999px;
            font-size: 12px;
            font-weight: 700;
            color: #94a3b8;
            text-decoration: none;
            transition: all 0.2s ease;
          }

          .btn-back-pill:hover {
            border-color: #38bdf8;
            color: #ffffff;
            transform: translateX(-3px);
            box-shadow: 0 0 16px rgba(56, 189, 248, 0.2);
          }

          /* Segmented Tab Switcher */
          .tab-switcher {
            display: flex;
            gap: 8px;
            background: #09090b;
            padding: 5px;
            border-radius: 16px;
            border: 1px solid #1e293b;
            width: fit-content;
          }

          .tab-btn {
            padding: 9px 22px;
            font-size: 13px;
            font-weight: 700;
            border-radius: 11px;
            border: none;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .tab-btn-active {
            background: #18181b;
            color: #ffffff;
            border: 1px solid #27272a;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
          }

          .tab-btn-inactive {
            background: transparent;
            color: #71717a;
          }

          .tab-btn-inactive:hover {
            color: #ededed;
          }
        `}
      </style>

      <Navbar />

      <main className="wrap workspace-anim" style={{
        position: 'relative',
        zIndex: 1,
        paddingBottom: '80px',
        maxWidth: '1240px',
        margin: '0 auto',
        paddingLeft: '24px',
        paddingRight: '24px',
        paddingTop: '28px'
      }}>
        {/* Breadcrumb Navigation */}
        <div style={{ marginBottom: 20 }}>
          <Link to="/projects" className="btn-back-pill">
            <span>←</span>
            <span>All Workspaces</span>
          </Link>
        </div>

        {/* Header Obsidian Canvas Card */}
        <div className="obsidian-panel" style={{
          padding: '32px 36px',
          marginBottom: 28,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 24,
          flexWrap: 'wrap'
        }}>
          {/* Subtle Tri-Color Accent Line */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: 'linear-gradient(90deg, #38bdf8 0%, #10b981 40%, #f59e0b 75%, #f43f5e 100%)'
          }} />

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8, flexWrap: 'wrap' }}>
              <h1 style={{
                fontSize: '28px',
                fontWeight: '900',
                letterSpacing: '-0.03em',
                color: '#ffffff',
                margin: 0
              }}>
                {project.name}
              </h1>

              {/* Role Indicator Tag */}
              <span style={{
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                padding: '3px 12px',
                borderRadius: '9999px',
                background: role === 'admin' ? 'rgba(56, 189, 248, 0.12)' : 'rgba(255, 255, 255, 0.05)',
                color: role === 'admin' ? '#38bdf8' : '#94a3b8',
                fontWeight: '800',
                border: role === 'admin' ? '1px solid rgba(56, 189, 248, 0.4)' : '1px solid #27272a'
              }}>
                {role}
              </span>

              {/* Live Task Count Pill */}
              <span style={{
                fontSize: '11px',
                fontWeight: '700',
                padding: '3px 10px',
                borderRadius: '9999px',
                background: 'rgba(16, 185, 129, 0.12)',
                color: '#10b981',
                border: '1px solid rgba(16, 185, 129, 0.3)'
              }}>
                {tasks.length} {tasks.length === 1 ? 'Task' : 'Tasks'}
              </span>
            </div>

            {project.description ? (
              <p style={{
                color: '#94a3b8',
                fontSize: '14px',
                margin: 0,
                fontWeight: '500',
                maxWidth: '680px',
                lineHeight: '1.6'
              }}>
                {project.description}
              </p>
            ) : (
              <p style={{ color: '#52525b', fontSize: '13px', margin: 0, fontStyle: 'italic' }}>
                No project description provided.
              </p>
            )}
          </div>

          {/* Action Hub */}
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <Link to={`/projects/${projectId}/dashboard`} className="btn-action-amber">
              <span style={{ fontSize: '14px' }}>📊</span>
              <span>Telemetry</span>
            </Link>

            {role === 'admin' && activeTab === 'board' && (
              <button
                onClick={() => { setEditingTask(null); setShowTaskModal(true); }}
                className="btn-primary-cyan"
              >
                <span style={{ fontSize: '15px', lineHeight: 1 }}>+</span>
                <span>New Task</span>
              </button>
            )}

            {role === 'admin' && (
              <button onClick={handleDeleteProject} className="btn-action-destructive">
                <span style={{ fontSize: '14px' }}>✕</span>
                <span>Delete</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab Selection */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 14 }}>
          <div className="tab-switcher">
            <button
              onClick={() => setActiveTab('board')}
              className={`tab-btn ${activeTab === 'board' ? 'tab-btn-active' : 'tab-btn-inactive'}`}
            >
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: activeTab === 'board' ? '#38bdf8' : '#52525b' }} />
              <span>Sprint Board</span>
              <span style={{
                fontSize: '11px',
                padding: '2px 7px',
                borderRadius: '6px',
                background: activeTab === 'board' ? '#27272a' : 'transparent',
                color: activeTab === 'board' ? '#38bdf8' : '#71717a',
                fontWeight: '700'
              }}>
                {tasks.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('members')}
              className={`tab-btn ${activeTab === 'members' ? 'tab-btn-active' : 'tab-btn-inactive'}`}
            >
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: activeTab === 'members' ? '#10b981' : '#52525b' }} />
              <span>Contributors</span>
              <span style={{
                fontSize: '11px',
                padding: '2px 7px',
                borderRadius: '6px',
                background: activeTab === 'members' ? '#27272a' : 'transparent',
                color: activeTab === 'members' ? '#10b981' : '#71717a',
                fontWeight: '700'
              }}>
                {project.members.length}
              </span>
            </button>
          </div>
        </div>

       {/* Content Container */}
<div className="obsidian-panel" style={{ padding: '28px' }}>
  {activeTab === 'board' && (
    tasksLoading ? (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 0', gap: 14 }}>
        <div style={{
          width: '38px',
          height: '38px',
          border: '3px solid #1e293b',
          borderTopColor: '#38bdf8',
          borderRadius: '50%',
          animation: 'spin 0.7s linear infinite'
        }} />
        <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '700', letterSpacing: '0.05em' }}>
          FETCHING SPRINT CARDS...
        </span>
      </div>
    ) : (
      <>
        {/* Live Sprint Analytics Telemetry */}
        <SprintTelemetryDashboard tasks={tasks} project={project} />

        {/* Drag-and-Drop Kanban Board */}
        <TaskBoard
          tasks={tasks}
          role={role}
          currentUserId={user?._id}
          onUpdateStatus={handleUpdateStatus}
          onDelete={handleDelete}
          onEdit={handleEdit}
          onCreateTask={handleTaskSubmit}
        />
      </>
    )
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

      {/* Task Creation & Edit Modal */}
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