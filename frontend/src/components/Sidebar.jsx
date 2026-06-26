import React from 'react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ activeFilter, setActiveFilter, activePriority, setActivePriority }) => {
  const { logout } = useAuth();

  const handleMyTasks = (e) => {
    e.preventDefault();
    if (setActiveFilter) setActiveFilter('All');
    if (setActivePriority) setActivePriority('All');
  };

  const handleCompleted = (e) => {
    e.preventDefault();
    if (setActiveFilter) setActiveFilter('Completed');
  };

  const handlePriority = (e) => {
    e.preventDefault();
    if (setActivePriority) setActivePriority('High');
  };

  return (
    <>
      {/* Desktop Left Sidebar */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-16 h-[calc(100vh-64px)] w-64 py-8 px-4 bg-surface-container-low border-r border-outline-variant transition-colors duration-200">
        <div className="flex flex-col gap-1 flex-grow">
          <a 
            href="#"
            onClick={handleMyTasks}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-transform hover:translate-x-1 ${
              activeFilter === 'All' && activePriority === 'All'
                ? 'text-primary font-bold bg-secondary-container/30'
                : 'text-secondary hover:bg-surface-container-high'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">task_alt</span>
            <span className="font-semibold text-xs tracking-wider uppercase">My Tasks</span>
          </a>

          <a 
            href="#"
            className="flex items-center gap-3 px-3 py-2 text-secondary hover:bg-surface-container-high transition-transform hover:translate-x-1 rounded-lg"
          >
            <span className="material-symbols-outlined text-[20px]">inbox</span>
            <span className="font-semibold text-xs tracking-wider uppercase">Inbox</span>
          </a>

          <a 
            href="#"
            onClick={handlePriority}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-transform hover:translate-x-1 ${
              activePriority === 'High'
                ? 'text-primary font-bold bg-secondary-container/30'
                : 'text-secondary hover:bg-surface-container-high'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">priority_high</span>
            <span className="font-semibold text-xs tracking-wider uppercase">Priority</span>
          </a>

          <a 
            href="#"
            onClick={handleCompleted}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-transform hover:translate-x-1 ${
              activeFilter === 'Completed'
                ? 'text-primary font-bold bg-secondary-container/30'
                : 'text-secondary hover:bg-surface-container-high'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">check_circle</span>
            <span className="font-semibold text-xs tracking-wider uppercase">Completed</span>
          </a>

          <a 
            href="#"
            className="flex items-center gap-3 px-3 py-2 text-secondary hover:bg-surface-container-high transition-transform hover:translate-x-1 rounded-lg"
          >
            <span className="material-symbols-outlined text-[20px]">archive</span>
            <span className="font-semibold text-xs tracking-wider uppercase">Archive</span>
          </a>
        </div>

        <div className="mt-auto flex flex-col gap-1 border-t border-outline-variant pt-4">
          <a 
            href="#"
            className="flex items-center gap-3 px-3 py-2 text-secondary hover:bg-surface-container-high transition-transform hover:translate-x-1 rounded-lg"
          >
            <span className="material-symbols-outlined text-[20px]">help</span>
            <span className="font-semibold text-xs tracking-wider uppercase">Help</span>
          </a>

          <button 
            onClick={logout}
            className="flex items-center w-full gap-3 px-3 py-2 text-secondary hover:bg-surface-container-high hover:text-error transition-transform hover:translate-x-1 rounded-lg text-left cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
            <span className="font-semibold text-xs tracking-wider uppercase">Logout</span>
          </button>

          <button className="mt-4 w-full bg-secondary text-on-secondary px-4 py-2.5 rounded-lg font-semibold text-xs tracking-wider uppercase hover:bg-on-surface-variant transition-all active:scale-95 cursor-pointer">
            Upgrade Plan
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 w-full bg-surface-container-low border-t border-outline-variant flex justify-around items-center h-16 z-40 px-4">
        <a 
          href="#"
          onClick={handleMyTasks}
          className={`flex flex-col items-center gap-1 ${
            activeFilter === 'All' && activePriority === 'All' ? 'text-primary font-semibold' : 'text-secondary'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">task_alt</span>
          <span className="text-[10px]">Tasks</span>
        </a>
        
        <a 
          href="#"
          onClick={handlePriority}
          className={`flex flex-col items-center gap-1 ${
            activePriority === 'High' ? 'text-primary font-semibold' : 'text-secondary'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">priority_high</span>
          <span className="text-[10px]">Priority</span>
        </a>

        <a 
          href="#"
          onClick={handleCompleted}
          className={`flex flex-col items-center gap-1 ${
            activeFilter === 'Completed' ? 'text-primary font-semibold' : 'text-secondary'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">check_circle</span>
          <span className="text-[10px]">Completed</span>
        </a>

        <button 
          onClick={logout}
          className="flex flex-col items-center gap-1 text-secondary"
        >
          <span className="material-symbols-outlined text-[20px]">logout</span>
          <span className="text-[10px]">Logout</span>
        </button>
      </nav>
    </>
  );
};

export default Sidebar;
