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
        axios.get('http://localhost:5000/tasks/stats', config),
        axios.get('http://localhost:5000/tasks?limit=5', config)
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
            className="px-5 py-2 bg-primary text-on-primary hover:bg-primary-container transition-all font-semibold rounded-lg shadow-md flex items-center gap-2 text-xs tracking-wider uppercase cursor-pointer"
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

      {/* Main Grid: Recent Tasks & Right Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Recent Tasks Table (8/12) */}
        <section className="lg:col-span-8 space-y-4">
          <div className="bg-surface border border-outline-variant rounded-xl overflow-hidden shadow-sm">
            
            <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-lowest">
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

        {/* Right Column: Timeline & Upcoming Deadlines (4/12) */}
        <aside className="lg:col-span-4 space-y-6">
          
          {/* Upcoming Deadlines */}
          <div className="bg-surface border border-outline-variant rounded-xl shadow-sm p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-on-surface">Upcoming Deadlines</h3>
              <span className="material-symbols-outlined text-outline">event</span>
            </div>
            
            <div className="space-y-4">
              <div className="flex gap-4 group cursor-pointer">
                <div className="flex flex-col items-center bg-surface-container-low px-3 py-2 rounded-lg border border-outline-variant min-w-[56px] transition-colors group-hover:bg-primary-fixed">
                  <span className="text-[10px] font-bold text-on-surface-variant group-hover:text-primary uppercase tracking-wider">OCT</span>
                  <span className="text-lg font-bold text-on-surface">25</span>
                </div>
                <div className="flex flex-col justify-center">
                  <p className="font-semibold text-body-sm text-on-surface group-hover:text-primary transition-colors">Client Onboarding Call</p>
                  <p className="text-xs text-on-surface-variant">10:00 AM • Enterprise Plan</p>
                </div>
              </div>
              
              <div className="flex gap-4 group cursor-pointer">
                <div className="flex flex-col items-center bg-surface-container-low px-3 py-2 rounded-lg border border-outline-variant min-w-[56px] transition-colors group-hover:bg-primary-fixed">
                  <span className="text-[10px] font-bold text-on-surface-variant group-hover:text-primary uppercase tracking-wider">OCT</span>
                  <span className="text-lg font-bold text-on-surface">27</span>
                </div>
                <div className="flex flex-col justify-center">
                  <p className="font-semibold text-body-sm text-on-surface group-hover:text-primary transition-colors">Security Patch Deployment</p>
                  <p className="text-xs text-on-surface-variant">02:30 PM • Critical</p>
                </div>
              </div>
              
              <div className="flex gap-4 group cursor-pointer">
                <div className="flex flex-col items-center bg-surface-container-low px-3 py-2 rounded-lg border border-outline-variant min-w-[56px] transition-colors group-hover:bg-primary-fixed">
                  <span className="text-[10px] font-bold text-on-surface-variant group-hover:text-primary uppercase tracking-wider">OCT</span>
                  <span className="text-lg font-bold text-on-surface">30</span>
                </div>
                <div className="flex flex-col justify-center">
                  <p className="font-semibold text-body-sm text-on-surface group-hover:text-primary transition-colors">Alpha Launch V4.2</p>
                  <p className="text-xs text-on-surface-variant">All Day • Product Team</p>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => navigate('/tasks')}
              className="w-full mt-6 py-2 border border-outline-variant rounded-lg text-on-surface-variant font-bold text-xs tracking-wider uppercase hover:bg-surface-container-low transition-all cursor-pointer"
            >
              Full Calendar View
            </button>
          </div>

          {/* Activity Timeline */}
          <div className="bg-surface border border-outline-variant rounded-xl shadow-sm p-4">
            <h3 className="text-base font-bold text-on-surface mb-4">Activity Timeline</h3>
            
            <div className="relative space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[1px] before:bg-outline-variant">
              
              <div className="relative pl-8 group">
                <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-primary-container border-2 border-surface flex items-center justify-center z-10 transition-transform group-hover:scale-110">
                  <span className="material-symbols-outlined text-[12px] text-on-primary-container">edit</span>
                </div>
                <p className="text-xs text-on-surface">
                  <span className="font-bold">Sarah Chen</span> updated the <span className="font-semibold text-primary">Landing Page Re-design</span>
                </p>
                <span className="text-[10px] font-semibold text-outline">2 hours ago</span>
              </div>
              
              <div className="relative pl-8 group">
                <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-secondary-container border-2 border-surface flex items-center justify-center z-10 transition-transform group-hover:scale-110">
                  <span className="material-symbols-outlined text-[12px] text-on-secondary-container">add_comment</span>
                </div>
                <p className="text-xs text-on-surface">
                  <span className="font-bold">James Wilson</span> left a comment on <span className="font-semibold text-primary">API Implementation</span>
                </p>
                <span className="text-[10px] font-semibold text-outline">4 hours ago</span>
              </div>
              
              <div className="relative pl-8 group">
                <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-green-100 dark:bg-green-950 border-2 border-surface flex items-center justify-center z-10 transition-transform group-hover:scale-110">
                  <span className="material-symbols-outlined text-[12px] text-green-700 dark:text-green-300">task_alt</span>
                </div>
                <p className="text-xs text-on-surface">
                  <span className="font-bold">You</span> marked <span className="font-semibold text-primary">Budget Analysis</span> as completed
                </p>
                <span className="text-[10px] font-semibold text-outline">Yesterday</span>
              </div>
              
              <div className="relative pl-8 group">
                <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-tertiary-fixed border-2 border-surface flex items-center justify-center z-10 transition-transform group-hover:scale-110">
                  <span className="material-symbols-outlined text-[12px] text-on-tertiary-fixed-variant">attachment</span>
                </div>
                <p className="text-xs text-on-surface">
                  <span className="font-bold">Marcus Frey</span> attached 4 files to <span className="font-semibold text-primary">Investor Pitch Deck</span>
                </p>
                <span className="text-[10px] font-semibold text-outline">Yesterday</span>
              </div>

            </div>
          </div>

        </aside>
      </div>
    </main>
  );
};

export default Dashboard;
