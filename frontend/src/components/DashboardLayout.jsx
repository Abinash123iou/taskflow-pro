import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const DashboardLayout = ({ children }) => {
  const location = useLocation();
  const isTasksPage = location.pathname.startsWith('/tasks');

  // We can pass down layout controls if children want to interact with the sidebar state
  // For standard pages, we render without sidebar. For tasks, we show the sidebar.
  return (
    <div className="min-h-screen bg-background text-on-background transition-colors duration-200">
      <Navbar />

      <div className="flex">
        {/* Content canvas */}
        <div 
          className={`flex-grow transition-all duration-200 ${
            isTasksPage 
              ? 'pb-20 lg:pb-0' // Add padding on mobile to account for the bottom nav bar
              : ''
          }`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
