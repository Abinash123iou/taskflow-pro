import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import TaskModal from '../components/TaskModal';
import Sidebar from '../components/Sidebar';

const Tasks = () => {
  const { token } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // State for search and filters
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [priority, setPriority] = useState('All');
  
  // Tasks list and metadata
  const [tasks, setTasks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTasks, setTotalTasks] = useState(0);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // Modal Control state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  const [selectedTask, setSelectedTask] = useState(null);

  // Fetch Tasks with filters
  const fetchTasks = async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      
      const params = {
        page: currentPage,
        limit: 10,
      };

      if (search.trim()) {
        params.search = search.trim();
      }
      
      if (status !== 'All') {
        params.status = status;
      }

      if (priority !== 'All') {
        params.priority = priority;
      }

      const response = await axios.get('/api/tasks', {
        headers: { Authorization: `Bearer ${token}` },
        params
      });

      if (response.data.success) {
        const { tasks: fetchedTasks, totalPages: pages, totalTasks: count } = response.data.data;
        setTasks(fetchedTasks || []);
        setTotalPages(pages || 1);
        setTotalTasks(count || 0);
      }
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setErrorMsg('Failed to load tasks list. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Effect to refetch tasks when query criteria changes
  useEffect(() => {
    fetchTasks();
  }, [token, currentPage, status, priority]);

  // Debounced/Submit Search trigger
  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    setCurrentPage(1);
    fetchTasks();
  };

  // Handle direct changes in search input
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  // Query parameter watchers for deep links
  useEffect(() => {
    const isCreate = searchParams.get('create') === 'true';
    const editId = searchParams.get('edit');

    if (isCreate) {
      setModalMode('create');
      setSelectedTask(null);
      setModalOpen(true);
    } else if (editId) {
      // Find task in local list or fetch it
      const existing = tasks.find(t => String(t.id) === String(editId));
      if (existing) {
        setSelectedTask(existing);
        setModalMode('edit');
        setModalOpen(true);
      } else {
        // Fetch specific task
        axios.get(`/api/tasks`, {
          headers: { Authorization: `Bearer ${token}` }
        }).then(res => {
          if (res.data.success) {
            const list = res.data.data.tasks || [];
            const found = list.find(t => String(t.id) === String(editId));
            if (found) {
              setSelectedTask(found);
              setModalMode('edit');
              setModalOpen(true);
            }
          }
        }).catch(err => console.error(err));
      }
    }
  }, [searchParams, tasks, token]);

  const handleOpenCreate = () => {
    setSearchParams({ create: 'true' });
  };

  const handleOpenEdit = (task) => {
    setSearchParams({ edit: task.id });
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSearchParams({});
  };

  // Save task API wrapper
  const handleSaveTask = async (taskData) => {
    try {
      if (modalMode === 'create') {
        const res = await axios.post('/api/tasks', taskData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) {
          fetchTasks();
          return true;
        }
      } else if (modalMode === 'edit' && selectedTask) {
        const res = await axios.put(`/api/tasks/${selectedTask.id}`, taskData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) {
          fetchTasks();
          return true;
        }
      }
    } catch (err) {
      console.error('Error saving task:', err);
      const errors = err.response?.data?.errors;
      setErrorMsg(errors ? errors.join(', ') : 'Failed to save task.');
      return false;
    }
  };

  // Delete task API wrapper
  const handleDeleteTask = async (id) => {
    try {
      const res = await axios.delete(`/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        fetchTasks();
      }
    } catch (err) {
      console.error('Error deleting task:', err);
      setErrorMsg('Failed to delete task.');
    }
  };

  // Helpers
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'High':
        return (
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-error"></span>
            <span className="text-body-sm text-on-surface">High</span>
          </div>
        );
      case 'Medium':
        return (
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-tertiary"></span>
            <span className="text-body-sm text-on-surface">Medium</span>
          </div>
        );
      case 'Low':
      default:
        return (
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-outline"></span>
            <span className="text-body-sm text-on-surface">Low</span>
          </div>
        );
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'In Progress':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wider uppercase bg-primary-container/10 text-primary border border-primary/20">
            In Progress
          </span>
        );
      case 'Completed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wider uppercase bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200">
            Completed
          </span>
        );
      case 'Pending':
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wider uppercase bg-tertiary-container/10 text-tertiary border border-tertiary/20">
            Pending
          </span>
        );
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'No due date';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Pagination bounds
  const getShowingTasksCount = () => {
    if (tasks.length === 0) return 0;
    const start = (currentPage - 1) * 10 + 1;
    const end = start + tasks.length - 1;
    return `${start}-${end}`;
  };

  return (
    <>
      {/* Dynamic Left Sidebar Context Injector */}
      <Sidebar 
        activeFilter={status}
        setActiveFilter={(s) => { setStatus(s); setCurrentPage(1); }}
        activePriority={priority}
        setActivePriority={(p) => { setPriority(p); setCurrentPage(1); }}
      />

      <main className="lg:ml-64 pt-24 pb-8 px-6 max-w-container-max mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-bold tracking-tight text-on-surface mb-2">Tasks</h1>
            <p className="text-body-sm text-on-surface-variant">
              Manage and track your project deliverables and individual milestones.
            </p>
          </div>
          <div>
            <button 
              onClick={handleOpenCreate}
              className="flex items-center gap-2 bg-primary hover:bg-primary-hover active:bg-primary-active active:scale-95 disabled:bg-primary-disabled text-on-primary px-6 py-3 rounded-lg font-semibold text-xs tracking-wider uppercase shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              Create Task
            </button>
          </div>
        </div>

        {/* Error message banner */}
        {errorMsg && (
          <div className="p-4 bg-error-container text-on-error-container rounded-xl text-sm font-semibold border border-error/15 flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">error</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Controls Bar */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 flex flex-wrap items-center gap-4 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
          {/* Search form */}
          <form onSubmit={handleSearchSubmit} className="relative flex-grow min-w-[280px]">
            <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2 text-outline hover:text-primary outline-none select-none cursor-pointer">
              <span className="material-symbols-outlined text-[20px]">search</span>
            </button>
            <input 
              className="w-full pl-10 pr-4 py-2.5 bg-surface border border-outline-variant rounded-lg text-body-sm text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" 
              placeholder="Search across your workspace... (press Enter)" 
              type="text"
              value={search}
              onChange={handleSearchChange}
            />
          </form>

          {/* Filters Selectors */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Status Select */}
            <div className="relative">
              <select 
                className="appearance-none bg-surface border border-outline-variant rounded-lg pl-4 pr-10 py-2.5 text-xs font-semibold tracking-wider uppercase text-on-surface focus:border-primary outline-none cursor-pointer hover:bg-surface-container-low transition-colors"
                value={status}
                onChange={(e) => { setStatus(e.target.value); setCurrentPage(1); }}
              >
                <option value="All">Status: All</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none text-[18px]">
                expand_more
              </span>
            </div>

            {/* Priority Select */}
            <div className="relative">
              <select 
                className="appearance-none bg-surface border border-outline-variant rounded-lg pl-4 pr-10 py-2.5 text-xs font-semibold tracking-wider uppercase text-on-surface focus:border-primary outline-none cursor-pointer hover:bg-surface-container-low transition-colors"
                value={priority}
                onChange={(e) => { setPriority(e.target.value); setCurrentPage(1); }}
              >
                <option value="All">Priority: All</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none text-[18px]">
                expand_more
              </span>
            </div>

            <button 
              onClick={() => { setSearch(''); setStatus('All'); setPriority('All'); setCurrentPage(1); }}
              className="flex items-center gap-2 px-4 py-2.5 text-secondary hover:bg-surface-container-low rounded-lg transition-all text-xs font-semibold tracking-wider uppercase border border-outline-variant cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">filter_alt_off</span>
              Clear Filters
            </button>
          </div>
        </div>

        {/* Task Table Container */}
        <div className="bg-surface border border-outline-variant rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
          {loading ? (
            <div className="py-24 flex flex-col items-center justify-center gap-3">
              <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <span className="text-xs font-semibold text-on-surface-variant tracking-wider uppercase animate-pulse">
                Fetching Tasks...
              </span>
            </div>
          ) : tasks.length === 0 ? (
            <div className="py-24 text-center">
              <span className="material-symbols-outlined text-outline text-[64px] mb-4">assignment_late</span>
              <h3 className="text-lg font-bold text-on-surface mb-1">No tasks matching filters</h3>
              <p className="text-body-sm text-on-surface-variant max-w-xs mx-auto mb-6">
                Try clearing the search query or changing filter settings to locate your task.
              </p>
              <button 
                onClick={() => { setSearch(''); setStatus('All'); setPriority('All'); }}
                className="px-5 py-2.5 border border-outline-variant text-on-surface hover:bg-surface-container-low transition-all font-semibold rounded-lg text-xs tracking-wider uppercase cursor-pointer"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container-low border-b border-outline-variant">
                      <th className="px-6 py-4 text-[10px] font-bold text-outline uppercase tracking-wider">Task Details</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-outline uppercase tracking-wider w-36">Status</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-outline uppercase tracking-wider w-32">Priority</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-outline uppercase tracking-wider w-32">Due Date</th>
                      <th className="px-6 py-4 w-16"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant bg-surface">
                    {tasks.map((task) => (
                      <tr 
                        key={task.id} 
                        onClick={() => handleOpenEdit(task)}
                        className="task-row hover:bg-surface-container transition-colors cursor-pointer group"
                      >
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-body-sm text-on-surface font-semibold mb-0.5">
                              {task.title}
                            </span>
                            <span className="text-on-surface-variant text-xs line-clamp-1">
                              {task.description}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(task.status)}
                        </td>
                        <td className="px-6 py-4">
                          {getPriorityBadge(task.priority)}
                        </td>
                        <td className="px-6 py-4 text-xs font-semibold text-secondary">
                          {formatDate(task.dueDate)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleOpenEdit(task); }}
                            className="p-1.5 rounded-lg hover:bg-surface-container-high text-secondary transition-all cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[20px] select-none">edit</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination controls */}
              <div className="px-6 py-4 bg-surface-container-low flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-outline-variant">
                <span className="text-on-surface-variant text-xs font-semibold">
                  Showing <span className="text-on-surface">{getShowingTasksCount()}</span> of <span className="text-on-surface">{totalTasks}</span> tasks
                </span>
                
                <div className="flex items-center gap-1.5">
                  <button 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-outline-variant hover:bg-surface-container-high transition-all text-secondary disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px] select-none">chevron_left</span>
                  </button>

                  {Array.from({ length: totalPages }).map((_, idx) => {
                    const pageNum = idx + 1;
                    return (
                      <button 
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-9 h-9 flex items-center justify-center rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          currentPage === pageNum 
                            ? 'bg-primary text-on-primary' 
                            : 'hover:bg-surface-container-high text-secondary'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-outline-variant hover:bg-surface-container-high transition-all text-secondary disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px] select-none">chevron_right</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

      </main>

      {/* Task Modal Container */}
      <TaskModal 
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
        task={selectedTask}
        mode={modalMode}
      />
    </>
  );
};

export default Tasks;
