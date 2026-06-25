import React from 'react';

/**
 * TaskTable Component
 * Renders task records in a responsive list grid.
 * Integrates visual status badges, actionable buttons, skeleton loading states,
 * and empty placeholders.
 *
 * @param {Object} props
 * @param {Array} props.tasks - Array of task objects to display
 * @param {Function} props.onEdit - Callback when clicking the edit button
 * @param {Function} props.onDelete - Callback when clicking the delete button
 * @param {boolean} props.isLoading - Visual toggle for loading skeleton state
 */
const TaskTable = ({
  tasks = [],
  onEdit,
  onDelete,
  isLoading = false
}) => {
  
  // Renders animated placeholder rows during data loading
  const renderLoadingSkeletons = () => {
    return Array.from({ length: 4 }).map((_, idx) => (
      <tr key={idx} className="animate-pulse border-b border-slate-100 last:border-0">
        <td className="px-6 py-4">
          <div className="h-4 bg-slate-200 rounded w-3/4"></div>
        </td>
        <td className="px-6 py-4">
          <div className="h-4 bg-slate-100 rounded w-5/6 mb-1.5"></div>
          <div className="h-3 bg-slate-100 rounded w-1/2"></div>
        </td>
        <td className="px-6 py-4">
          <div className="h-6 bg-slate-100 rounded-full w-20"></div>
        </td>
        <td className="px-6 py-4">
          <div className="flex space-x-2">
            <div className="h-8 w-8 bg-slate-100 rounded-lg"></div>
            <div className="h-8 w-8 bg-slate-100 rounded-lg"></div>
          </div>
        </td>
      </tr>
    ));
  };

  // Helper mapping to stylize status badges
  const getStatusBadgeClass = (status = '') => {
    const norm = status.toLowerCase();
    switch (norm) {
      case 'completed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200/60';
      case 'in progress':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200/60';
      case 'pending':
      default:
        return 'bg-amber-50 text-amber-700 border-amber-200/60';
    }
  };

  return (
    <div className="w-full overflow-x-auto border border-slate-100 rounded-lg">
      <table className="min-w-full divide-y divide-slate-200 text-left border-collapse">
        {/* Table Header Section */}
        <thead className="bg-slate-50/75">
          <tr>
            <th 
              scope="col" 
              className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider w-1/4"
            >
              Title
            </th>
            <th 
              scope="col" 
              className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider w-5/12"
            >
              Description
            </th>
            <th 
              scope="col" 
              className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider w-1/6"
            >
              Status
            </th>
            <th 
              scope="col" 
              className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider w-1/6"
            >
              Actions
            </th>
          </tr>
        </thead>

        {/* Table Body Section */}
        <tbody className="bg-white divide-y divide-slate-100 text-sm">
          {isLoading ? (
            renderLoadingSkeletons()
          ) : tasks.length === 0 ? (
            // Full-row Empty State Layout
            <tr>
              <td colSpan="4" className="px-6 py-12 text-center">
                <div className="flex flex-col items-center justify-center space-y-3">
                  {/* Document Empty Icon */}
                  <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 13h6m-3-3v6m-9 1V4a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-base font-semibold text-slate-900">No tasks found</p>
                    <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">
                      There are no tasks here. Try adjusting your search query, status filters, or add a new task to get started.
                    </p>
                  </div>
                </div>
              </td>
            </tr>
          ) : (
            // Active Tasks Rendering
            tasks.map((task) => (
              <tr 
                key={task.id} 
                className="hover:bg-slate-50/50 transition-colors duration-150 last:border-0"
              >
                {/* Task Title */}
                <td className="px-6 py-4 font-semibold text-slate-900 truncate max-w-[180px]">
                  {task.title}
                </td>

                {/* Task Description */}
                <td className="px-6 py-4 text-slate-500 truncate max-w-xs" title={task.description}>
                  {task.description || <span className="text-slate-350 italic">No description provided</span>}
                </td>

                {/* Task Status Badge */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusBadgeClass(task.status)}`}>
                    {task.status}
                  </span>
                </td>

                {/* Task Action Controls */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-1">
                    {/* Edit Control Button */}
                    <button
                      type="button"
                      onClick={() => onEdit && onEdit(task)}
                      className="p-1.5 rounded-lg text-blue-600 hover:text-blue-900 hover:bg-blue-50 transition-colors duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                      title="Edit task"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>

                    {/* Delete Control Button */}
                    <button
                      type="button"
                      onClick={() => onDelete && onDelete(task.id)}
                      className="p-1.5 rounded-lg text-rose-600 hover:text-rose-900 hover:bg-rose-50 transition-colors duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-1"
                      title="Delete task"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TaskTable;
