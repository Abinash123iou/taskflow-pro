import React, { useState, useEffect } from 'react';

const TaskModal = ({ isOpen, onClose, onSave, onDelete, task, mode = 'create' }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Pending');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && task) {
        setTitle(task.title || '');
        setDescription(task.description || '');
        setStatus(task.status || 'Pending');
        setPriority(task.priority || 'Medium');
        setDueDate(task.dueDate ? task.dueDate.substring(0, 10) : '');
      } else {
        // Reset for create mode
        setTitle('');
        setDescription('');
        setStatus('Pending');
        setPriority('Medium');
        setDueDate('');
      }
      setErrors([]);
    }
  }, [isOpen, mode, task]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = [];

    if (!title.trim()) {
      validationErrors.push('Title is required');
    } else if (title.trim().length < 3) {
      validationErrors.push('Title must be at least 3 characters');
    }

    if (!description.trim()) {
      validationErrors.push('Description is required');
    } else if (description.trim().length < 20) {
      validationErrors.push('Description must be at least 20 characters');
    }

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors([]);
    setLoading(true);
    
    const taskData = {
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      dueDate: dueDate || null
    };

    const success = await onSave(taskData);
    setLoading(false);
    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-surface-container-lowest border border-outline-variant rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <header className="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-lowest">
          <h2 className="text-lg font-bold text-on-surface">
            {mode === 'create' ? 'Create New Task' : 'Edit Task'}
          </h2>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-surface-container-high text-on-surface-variant transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined select-none text-[22px]">close</span>
          </button>
        </header>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-grow">
          
          {/* Validation Errors */}
          {errors.length > 0 && (
            <div className="p-3.5 bg-error-container text-on-error-container rounded-lg text-xs font-semibold border border-error/20 space-y-1">
              {errors.map((err, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">error</span>
                  <span>{err}</span>
                </div>
              ))}
            </div>
          )}

          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant block" htmlFor="task-title">
              Task Title
            </label>
            <input 
              id="task-title"
              type="text"
              className="w-full bg-white dark:bg-surface border border-outline-variant rounded-lg px-4 py-2 text-body-sm text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all"
              placeholder="e.g. Refactor authentication layout"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant block" htmlFor="task-desc">
              Description
            </label>
            <textarea 
              id="task-desc"
              rows="4"
              className="w-full bg-white dark:bg-surface border border-outline-variant rounded-lg px-4 py-2 text-body-sm text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all resize-none"
              placeholder="Provide a detailed description of the task (min 20 characters)..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>

          {/* Form Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Status */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant block" htmlFor="task-status">
                Status
              </label>
              <div className="relative">
                <select 
                  id="task-status"
                  className="w-full appearance-none bg-white dark:bg-surface border border-outline-variant rounded-lg pl-4 pr-10 py-2 text-body-sm text-on-surface focus:border-primary outline-none cursor-pointer"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none text-[18px]">
                  expand_more
                </span>
              </div>
            </div>

            {/* Priority */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant block" htmlFor="task-priority">
                Priority
              </label>
              <div className="relative">
                <select 
                  id="task-priority"
                  className="w-full appearance-none bg-white dark:bg-surface border border-outline-variant rounded-lg pl-4 pr-10 py-2 text-body-sm text-on-surface focus:border-primary outline-none cursor-pointer"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none text-[18px]">
                  expand_more
                </span>
              </div>
            </div>

            {/* Due Date */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant block" htmlFor="task-date">
                Due Date
              </label>
              <input 
                id="task-date"
                type="date"
                className="w-full bg-white dark:bg-surface border border-outline-variant rounded-lg px-4 py-2 text-body-sm text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>
        </form>

        {/* Footer Actions */}
        <footer className="px-6 py-4 border-t border-outline-variant bg-surface-container-lowest flex flex-wrap justify-between items-center gap-3">
          <div>
            {mode === 'edit' && (
              <button 
                type="button"
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete this task?')) {
                    onDelete(task.id);
                    onClose();
                  }
                }}
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-error hover:bg-error-container/20 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">delete</span>
                Delete Task
              </button>
            )}
          </div>

          <div className="flex gap-2">
            <button 
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold uppercase tracking-wider border border-outline-variant text-on-surface-variant hover:bg-surface-container-low rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button 
              type="submit"
              onClick={handleSubmit}
              disabled={loading}
              className="px-5 py-2 text-xs font-bold uppercase tracking-wider bg-primary hover:bg-primary-hover active:bg-primary-active disabled:bg-primary-disabled text-on-primary rounded-lg flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
            >
              {loading ? (
                <div className="h-4 w-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin"></div>
              ) : (
                mode === 'create' ? 'Create Task' : 'Save Changes'
              )}
            </button>
          </div>
        </footer>

      </div>
    </div>
  );
};

export default TaskModal;
