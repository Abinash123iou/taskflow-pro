import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import StatsCards from '../components/StatsCards';

const Dashboard = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalTasks: 0, pendingTasks: 0, inProgressTasks: 0, completedTasks: 0 });
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const [statsRes, tasksRes] = await Promise.all([
        axios.get('/api/tasks/stats', config),
        axios.get('/api/tasks?limit=5', config)
      ]);

      if (statsRes.data.success) {
        setStats(statsRes.data.data);
      }
      if (tasksRes.data.success) {
        setRecentTasks(tasksRes.data.data.tasks || []);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to fetch dashboard overview data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [token]);

  // Priority indicator dots mapping
  const getPriorityDot = (priority) => {
    switch (priority) {
      case 'High':
      case 'Urgent':
      case 'Critical':
        return 'bg-error active-dot';
      case 'Medium':
        return 'bg-primary-container active-dot';
      case 'Low':
      default:
        return 'bg-outline active-dot';
    }
  };

  // Status badge styling mapping
  const getStatusBadge = (status) => {
    switch (status) {
      case 'In Progress':
        return 'bg-secondary-container text-on-secondary-fixed-variant';
      case 'Completed':
        return 'bg-primary-fixed text-on-primary-fixed-variant';
      case 'Pending':
      default:
        return 'bg-tertiary-fixed text-on-tertiary-fixed-variant';
    }
  };

  // Helper to format date
  const formatDate = (dateStr) => {
    if (!dateStr) return 'No due date';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <main className="pt-24 pb-8 px-6 max-w-container-max mx-auto space-y-8">
      {/* Hero / Greeting Section */}
      <section className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="space-y-1.5">
          <h1 className="text-3xl font-bold tracking-tight text-on-surface">
            Welcome back, {user?.username || 'Alexander'}
          </h1>
          <p className="text-body-sm text-on-surface-variant">
            Track progress, manage tasks, and improve productivity.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/tasks')}
            className="px-5 py-2 border border-outline-variant text-on-surface hover:bg-surface-container-low transition-all font-semibold rounded-lg flex items-center gap-2 text-xs tracking-wider uppercase cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">list</span>
            All Tasks
          </button>

          <button
            onClick={fetchDashboardData}
            className="px-5 py-2 border border-outline-variant text-on-surface hover:bg-surface-container-low transition-all font-semibold rounded-lg flex items-center gap-2 text-xs tracking-wider uppercase cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">refresh</span>
            Refresh
          </button>

          <button
            onClick={() => navigate('/tasks?create=true')}
            className="px-5 py-2 bg-primary hover:bg-primary-hover active:bg-primary-active disabled:bg-primary-disabled text-on-primary transition-all font-semibold rounded-lg shadow-md flex items-center gap-2 text-xs tracking-wider uppercase cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Create Task
          </button>
        </div>
      </section>

      {/* Metrics Section */}
      <StatsCards stats={stats} />

      {/* Error display */}
      {error && (
        <div className="p-4 bg-error-container text-on-error-container rounded-xl text-sm font-semibold border border-error/15 flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px]">error</span>
          <span>{error}</span>
        </div>
      )}

      {/* Main Grid: Recent Tasks */}
      <div className="w-full">

        {/* Left Column: Recent Tasks Table */}
        <section className="w-full space-y-4">
          <div className="bg-surface border border-outline-variant rounded-xl overflow-hidden shadow-sm">

            <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-surface">
              <h2 className="text-lg font-bold text-on-surface">Recent Tasks</h2>
              <button
                onClick={() => navigate('/tasks')}
                className="text-primary font-bold hover:underline text-xs tracking-wider uppercase cursor-pointer"
              >
                View all tasks
              </button>
            </div>

            {loading ? (
              <div className="p-12 flex flex-col items-center justify-center gap-3">
                <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <span className="text-xs font-semibold text-on-surface-variant tracking-wider uppercase animate-pulse">Loading tasks...</span>
              </div>
            ) : recentTasks.length === 0 ? (
              <div className="p-12 text-center">
                <span className="material-symbols-outlined text-outline text-[48px] mb-2">assignment_late</span>
                <p className="text-on-surface-variant text-body-sm font-medium">No tasks found. Create a new task to get started!</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container-low border-b border-outline-variant">
                      <th className="px-6 py-3 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Title</th>
                      <th className="px-6 py-3 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Priority</th>
                      <th className="px-6 py-3 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Due Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant bg-surface">
                    {recentTasks.map((task) => (
                      <tr
                        key={task.id}
                        onClick={() => navigate(`/tasks?edit=${task.id}`)}
                        className="hover:bg-surface-container transition-colors cursor-pointer group"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors text-[20px]">
                              description
                            </span>
                            <span className="font-semibold text-body-sm text-on-surface">
                              {task.title}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase ${getStatusBadge(task.status)}`}>
                            {task.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${getPriorityDot(task.priority)}`}></span>
                            <span className="text-body-sm text-on-surface">{task.priority}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs font-semibold text-on-surface-variant">
                          {formatDate(task.dueDate)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

export default Dashboard;
