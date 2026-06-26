import React from 'react';

const StatsCards = ({ stats = { totalTasks: 0, pendingTasks: 0, inProgressTasks: 0, completedTasks: 0 } }) => {
  const total = stats.totalTasks || 0;
  const pending = stats.pendingTasks || 0;
  const inProgress = stats.inProgressTasks || 0;
  const completed = stats.completedTasks || 0;

  // Calculate percentages for progress bars
  const totalPercent = total > 0 ? 85 : 0; // Default styling from mockup is 85%
  const pendingPercent = total > 0 ? Math.round((pending / total) * 100) : 0;
  const inProgressPercent = total > 0 ? Math.round((inProgress / total) * 100) : 0;
  const completedPercent = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      
      {/* Metric 1: Total Tasks */}
      <div className="bg-surface border border-outline-variant p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow group">
        <div className="flex justify-between items-start mb-2">
          <span className="text-[11px] font-bold tracking-wider uppercase text-on-surface-variant">Total Tasks</span>
          <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">
            assignment
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold">{total}</span>
          <span className="text-primary text-xs font-bold">+12%</span>
        </div>
        <div className="mt-4 w-full bg-surface-container-low h-1.5 rounded-full overflow-hidden">
          <div 
            className="bg-primary h-full rounded-full transition-all duration-500" 
            style={{ width: `${totalPercent}%` }}
          ></div>
        </div>
      </div>

      {/* Metric 2: Pending */}
      <div className="bg-surface border border-outline-variant p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow group">
        <div className="flex justify-between items-start mb-2">
          <span className="text-[11px] font-bold tracking-wider uppercase text-on-surface-variant">Pending</span>
          <span className="material-symbols-outlined text-outline group-hover:text-tertiary transition-colors">
            pending_actions
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold">{pending}</span>
          <span className="text-tertiary text-xs font-bold">-2%</span>
        </div>
        <div className="mt-4 w-full bg-surface-container-low h-1.5 rounded-full overflow-hidden">
          <div 
            className="bg-tertiary h-full rounded-full transition-all duration-500" 
            style={{ width: `${pendingPercent}%` }}
          ></div>
        </div>
      </div>

      {/* Metric 3: In Progress */}
      <div className="bg-surface border border-outline-variant p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow group">
        <div className="flex justify-between items-start mb-2">
          <span className="text-[11px] font-bold tracking-wider uppercase text-on-surface-variant">In Progress</span>
          <span className="material-symbols-outlined text-outline group-hover:text-secondary transition-colors">
            sync
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold">{inProgress}</span>
          <span className="text-secondary text-xs font-bold">+5%</span>
        </div>
        <div className="mt-4 w-full bg-surface-container-low h-1.5 rounded-full overflow-hidden">
          <div 
            className="bg-secondary h-full rounded-full transition-all duration-500" 
            style={{ width: `${inProgressPercent}%` }}
          ></div>
        </div>
      </div>

      {/* Metric 4: Completed */}
      <div className="bg-surface border border-outline-variant p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow group">
        <div className="flex justify-between items-start mb-2">
          <span className="text-[11px] font-bold tracking-wider uppercase text-on-surface-variant">Completed</span>
          <span className="material-symbols-outlined text-outline group-hover:text-green-600 transition-colors">
            check_circle
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold">{completed}</span>
          <span className="text-green-600 text-xs font-bold">+22%</span>
        </div>
        <div className="mt-4 w-full bg-surface-container-low h-1.5 rounded-full overflow-hidden">
          <div 
            className="bg-green-600 h-full rounded-full transition-all duration-500" 
            style={{ width: `${completedPercent}%` }}
          ></div>
        </div>
      </div>

    </section>
  );
};

export default StatsCards;
