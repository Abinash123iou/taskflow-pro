import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-surface border-b border-outline-variant shadow-sm transition-colors duration-200">
      <div className="flex justify-between items-center px-6 h-16 max-w-container-max mx-auto">
        {/* Left branding and nav */}
        <div className="flex items-center gap-12">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCvMrEze63qEsqVPTvNfoOduCPHY0kUL7sFcR3W2WxQAKVXHowLlYRnzGCkuEF-FKG6oxS0_5sVARdnyEXLSGSNY-4bRFHeapbXO9SdB9dYqhPKZdTKivLWndZ9XhLXjIk9Goifi46iEE9PfjbLOorNB1_0RBdrIgPLCM3vUPocnfoOBz5DBWXTiaLH87G-ak-ehQz4OTvG7Te8s7Zld3Kt4anuwKecXPnhW4dwVeXzxUAQ2IsMuE0PVoeTdpBmq_QeLmlo-Zpdn2K1" 
                alt="TaskFlow Pro Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-xl font-bold text-primary tracking-tight">TaskFlow Pro</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8 h-full">
            <NavLink 
              to="/dashboard" 
              className={({ isActive }) => 
                `text-body-sm font-semibold pb-1 border-b-2 transition-colors duration-200 ${
                  isActive 
                    ? 'text-primary border-primary font-bold' 
                    : 'text-on-surface-variant border-transparent hover:text-primary'
                }`
              }
            >
              Overview
            </NavLink>
            <NavLink 
              to="/tasks" 
              className={({ isActive }) => 
                `text-body-sm font-semibold pb-1 border-b-2 transition-colors duration-200 ${
                  isActive 
                    ? 'text-primary border-primary font-bold' 
                    : 'text-on-surface-variant border-transparent hover:text-primary'
                }`
              }
            >
              Tasks
            </NavLink>
            <NavLink 
              to="/analytics" 
              className={({ isActive }) => 
                `text-body-sm font-semibold pb-1 border-b-2 transition-colors duration-200 ${
                  isActive 
                    ? 'text-primary border-primary font-bold' 
                    : 'text-on-surface-variant border-transparent hover:text-primary'
                }`
              }
            >
              Analytics
            </NavLink>
          </nav>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-4">
          {/* Mock search for visual fidelity */}
          <div className="relative hidden lg:block group">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors text-[20px]">
              search
            </span>
            <input 
              className="pl-10 pr-4 py-1.5 bg-surface-container-low border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all w-64 text-body-sm text-on-surface placeholder:text-outline" 
              placeholder="Search tasks..." 
              type="text"
            />
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-surface-container-high transition-all text-on-surface-variant cursor-pointer active:scale-90"
              title="Toggle Theme"
            >
              <span className="material-symbols-outlined select-none text-[22px]">
                {theme === 'light' ? 'dark_mode' : 'light_mode'}
              </span>
            </button>

            <button 
              className="p-2 rounded-full hover:bg-surface-container-high transition-all text-on-surface-variant relative cursor-pointer active:scale-90"
              title="Notifications"
            >
              <span className="material-symbols-outlined select-none text-[22px]">
                notifications
              </span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-surface"></span>
            </button>

            <div 
              className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant cursor-pointer active:scale-95 duration-100 flex items-center justify-center bg-primary-container text-on-primary-container font-semibold text-xs ml-1"
              title={user?.username || 'User Profile'}
            >
              {user?.username ? (
                user.username.substring(0, 2).toUpperCase()
              ) : (
                'JD'
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
