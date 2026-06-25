import React from 'react';

/**
 * StatsCards Component
 * Renders a responsive grid of four cards displaying task statistics:
 * Total, Pending, In Progress, and Completed tasks.
 *
 * @param {Object} props
 * @param {number} props.totalTasks - Total number of tasks
 * @param {number} props.pendingTasks - Tasks with a pending status
 * @param {number} props.inProgressTasks - Tasks currently in progress
 * @param {number} props.completedTasks - Tasks that have been completed
 */
const StatsCards = ({
  totalTasks = 0,
  pendingTasks = 0,
  inProgressTasks = 0,
  completedTasks = 0
}) => {
  const cards = [
    {
      title: 'Total Tasks',
      value: totalTasks,
      iconColor: 'text-blue-600 bg-blue-50',
      borderColor: 'border-blue-100',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      )
    },
    {
      title: 'Pending Tasks',
      value: pendingTasks,
      iconColor: 'text-amber-600 bg-amber-50',
      borderColor: 'border-amber-100',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: 'In Progress Tasks',
      value: inProgressTasks,
      iconColor: 'text-indigo-600 bg-indigo-50',
      borderColor: 'border-indigo-100',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H17" />
        </svg>
      )
    },
    {
      title: 'Completed Tasks',
      value: completedTasks,
      iconColor: 'text-emerald-600 bg-emerald-50',
      borderColor: 'border-emerald-100',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className={`bg-white rounded-xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 flex items-center justify-between cursor-default`}
        >
          {/* Card Text Content */}
          <div className="space-y-1">
            <p className="text-sm font-medium text-slate-500 tracking-wide">{card.title}</p>
            <p className="text-3xl font-bold text-slate-900 tracking-tight">{card.value}</p>
          </div>

          {/* Card Icon Container */}
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.iconColor} transition-transform duration-200 hover:scale-105`}>
            {card.icon}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
