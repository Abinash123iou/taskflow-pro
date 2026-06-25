import React from 'react';
import StatsCards from '../components/dashboard/StatsCards';
import SearchBar from '../components/dashboard/SearchBar';
import StatusFilter from '../components/dashboard/StatusFilter';
import TaskTable from '../components/dashboard/TaskTable';

/**
 * Dashboard Component
 * Serves as the primary page container for TaskFlow Pro's task management portal.
 * Handles the responsive layout grid and renders the key section placeholders.
 */
const Dashboard = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans transition-colors duration-200">
      {/* SaaS Navigation/Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-slate-200 shadow-sm backdrop-blur-md bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Branding/Logo */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-600 text-white shadow-md shadow-blue-200 font-bold text-xl">
                T
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">TaskFlow Pro</h1>
                <p className="text-xs text-slate-500 hidden sm:block">Project Management Portal</p>
              </div>
            </div>

            {/* Header Right Actions */}
            <div className="flex items-center space-x-4">
              {/* Add Task Button Placeholder */}
              <button 
                type="button"
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm hover:shadow transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {/* SVG Plus Icon */}
                <svg 
                  className="w-5 h-5 mr-1.5 -ml-1 stroke-current" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Add Task
              </button>

              {/* User Avatar Placeholder */}
              <div className="w-9 h-9 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center overflow-hidden cursor-pointer hover:border-blue-500 transition-colors duration-200">
                <span className="text-sm font-semibold text-slate-600">JD</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Dashboard Layout Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* 1. Statistics Cards Section */}
        <section aria-labelledby="statistics-heading">
          <h2 id="statistics-heading" className="sr-only">Task Statistics</h2>
          <StatsCards />
        </section>

        {/* 2. Controls & Actions Section (Search, Filters, Layout Grid) */}
        <section 
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 bg-white rounded-xl border border-slate-200/80 shadow-sm"
          aria-labelledby="controls-heading"
        >
          <h2 id="controls-heading" className="sr-only">Search and Filters</h2>
          
          {/* Search Box Wrapper */}
          <div className="w-full md:max-w-md">
            <SearchBar />
          </div>

          {/* Status Filters Wrapper */}
          <div className="flex items-center justify-start md:justify-end overflow-x-auto no-scrollbar">
            <StatusFilter />
          </div>
        </section>

        {/* 3. Task Table Section */}
        <section 
          className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden"
          aria-labelledby="tasks-heading"
        >
          <div className="border-b border-slate-100 px-6 py-4 flex justify-between items-center">
            <div>
              <h2 id="tasks-heading" className="text-lg font-bold text-slate-900">Task List</h2>
              <p className="text-sm text-slate-500">Manage, prioritize, and update your project tasks.</p>
            </div>
          </div>
          
          <div className="p-6">
            <TaskTable />
          </div>
        </section>
        
      </main>
    </div>
  );
};

export default Dashboard;
