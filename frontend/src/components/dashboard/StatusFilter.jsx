import React from 'react';

/**
 * StatusFilter Component
 * Renders modern pill-shaped buttons to filter tasks by status:
 * All, Pending, In Progress, and Completed.
 *
 * @param {Object} props
 * @param {string} props.statusFilter - Currently selected status filter
 * @param {Function} props.setStatusFilter - Callback to change the status filter state
 */
const StatusFilter = ({ 
  statusFilter = 'All', 
  setStatusFilter 
}) => {
  const options = [
    { 
      label: 'All', 
      value: 'All',
      activeClass: 'bg-slate-900 text-white shadow-md shadow-slate-200' 
    },
    { 
      label: 'Pending', 
      value: 'Pending',
      activeClass: 'bg-amber-600 text-white shadow-md shadow-amber-100' 
    },
    { 
      label: 'In Progress', 
      value: 'In Progress',
      activeClass: 'bg-indigo-600 text-white shadow-md shadow-indigo-100' 
    },
    { 
      label: 'Completed', 
      value: 'Completed',
      activeClass: 'bg-emerald-600 text-white shadow-md shadow-emerald-100' 
    }
  ];

  return (
    <div className="flex items-center space-x-2 p-1 bg-slate-50 border border-slate-200/60 rounded-xl max-w-full overflow-x-auto no-scrollbar">
      {options.map((option) => {
        const isActive = statusFilter === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => setStatusFilter && setStatusFilter(option.value)}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer select-none focus:outline-none whitespace-nowrap ${
              isActive 
                ? option.activeClass 
                : 'text-slate-600 bg-transparent hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
};

export default StatusFilter;
