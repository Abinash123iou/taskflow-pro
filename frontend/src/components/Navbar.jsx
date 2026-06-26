import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';
import logo from '../assets/logo.png';

const Navbar = () => {
  const { user, token, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [profileOpen, setProfileOpen] = React.useState(false);
  const [notificationsOpen, setNotificationsOpen] = React.useState(false);
  const [notifications, setNotifications] = React.useState([]);  const fetchNotifications = React.useCallback(async () => {
    if (!token) return;
    try {
      const response = await axios.get('/api/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setNotifications(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  }, [token]);

  React.useEffect(() => {
    fetchNotifications();
    // Refresh notifications every 30 seconds for live feel
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const markAllAsRead = async () => {
    if (!token) return;
    try {
      const response = await axios.put('/api/notifications/read-all', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      }
    } catch (err) {
      console.error('Error marking all as read:', err);
    }
  };

  const markSingleAsRead = async (id) => {
    if (!token) return;
    try {
      const response = await axios.put(`/api/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
      }
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const deleteNotification = async (id, e) => {
    e.stopPropagation();
    if (!token) return;
    try {
      const response = await axios.delete(`/api/notifications/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const seconds = Math.floor((now - date) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const hasUnread = notifications.some(n => !n.isRead);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-surface border-b border-outline-variant shadow-sm transition-colors duration-200">
      <div className="flex justify-between items-center px-6 h-16 max-w-container-max mx-auto">
        {/* Left branding and nav */}
        <div className="flex items-center gap-12">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center">
              <img 
                src={logo} 
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

            {/* Notifications Button & Dropdown */}
            <div className="relative">
              <button 
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen);
                  setProfileOpen(false);
                }}
                className="p-2 rounded-full hover:bg-surface-container-high transition-all text-on-surface-variant relative cursor-pointer active:scale-90"
                title="Notifications"
              >
                <span className="material-symbols-outlined select-none text-[22px]">
                  notifications
                </span>
                {hasUnread && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-surface"></span>
                )}
              </button>

              {notificationsOpen && (
                <>
                  <div className="fixed inset-0 z-40 cursor-default" onClick={() => setNotificationsOpen(false)} />
                  <div className="absolute right-0 top-12 mt-2 w-80 bg-surface border border-outline-variant rounded-xl shadow-lg z-50 p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-bold text-sm text-on-surface">Notifications</h4>
                      {hasUnread && (
                        <button 
                          onClick={markAllAsRead}
                          className="text-[10px] font-bold text-primary hover:underline uppercase tracking-wider cursor-pointer"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                    
                    {notifications.length === 0 ? (
                      <div className="text-center py-6 text-on-surface-variant text-xs">
                        <span className="material-symbols-outlined text-[32px] text-outline mb-2 select-none">
                          notifications_off
                        </span>
                        <p>No notifications yet</p>
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                        {notifications.map(n => {
                          let typeColor = 'text-primary';
                          let typeBg = 'bg-primary/10';
                          let typeIcon = 'info';
                          
                          if (n.type === 'Warning') {
                            typeColor = 'text-error';
                            typeBg = 'bg-error/10';
                            typeIcon = 'warning';
                          } else if (n.type === 'Success') {
                            typeColor = 'text-success';
                            typeBg = 'bg-success/10';
                            typeIcon = 'check_circle';
                          }
                          
                          return (
                            <div 
                              key={n.id}
                              onClick={() => !n.isRead && markSingleAsRead(n.id)}
                              className={`p-2.5 rounded-lg border transition-all cursor-pointer relative group flex gap-3 ${
                                n.isRead 
                                  ? 'bg-surface border-outline-variant/30 hover:bg-surface-container-low' 
                                  : 'bg-primary/5 border-primary/20 hover:bg-primary/10'
                              }`}
                            >
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${typeBg} ${typeColor}`}>
                                <span className="material-symbols-outlined text-[18px]">
                                  {typeIcon}
                                </span>
                              </div>
                              <div className="flex-1 min-w-0 pr-4">
                                <div className="flex justify-between items-start gap-1">
                                  <span className={`text-xs truncate ${n.isRead ? 'font-medium text-on-surface' : 'font-bold text-primary'}`}>
                                    {n.title}
                                  </span>
                                  <span className="text-[9px] text-outline whitespace-nowrap pt-0.5">
                                    {formatTimeAgo(n.createdAt)}
                                  </span>
                                </div>
                                <p className="text-[11px] text-on-surface-variant leading-relaxed mt-0.5 break-words">
                                  {n.message}
                                </p>
                              </div>
                              
                              <button 
                                onClick={(e) => deleteNotification(n.id, e)}
                                className="absolute top-2.5 right-2 opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-surface-container-high text-outline hover:text-error transition-all cursor-pointer animate-fade-in"
                                title="Delete notification"
                              >
                                <span className="material-symbols-outlined text-[14px]">
                                  close
                                </span>
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Profile Button & Dropdown */}
            <div className="relative">
              <button 
                onClick={() => {
                  setProfileOpen(!profileOpen);
                  setNotificationsOpen(false);
                }}
                className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant cursor-pointer active:scale-95 duration-100 flex items-center justify-center bg-primary-container text-on-primary-container font-semibold text-xs ml-1"
                title={user?.username || 'User Profile'}
              >
                {user?.username ? (
                  user.username.substring(0, 2).toUpperCase()
                ) : (
                  'AB'
                )}
              </button>

              {profileOpen && (
                <>
                  <div className="fixed inset-0 z-40 cursor-default" onClick={() => setProfileOpen(false)} />
                  <div className="absolute right-0 top-12 mt-2 w-64 bg-surface border border-outline-variant rounded-xl shadow-lg z-50 p-2">
                    <div className="px-3 py-2 border-b border-outline-variant mb-1">
                      <div className="font-bold text-xs text-on-surface">{user?.username || 'Alex Lindholm'}</div>
                      <div className="text-[10px] text-on-surface-variant truncate">{user?.email || 'demo@taskflow.pro'}</div>
                    </div>
                    <button 
                      onClick={() => {
                        setProfileOpen(false);
                        logout();
                      }}
                      className="flex items-center gap-3 px-3 py-2 text-secondary hover:bg-surface-container-high hover:text-error transition-all rounded-lg text-left w-full cursor-pointer text-xs font-semibold uppercase tracking-wider"
                    >
                      <span className="material-symbols-outlined text-[18px]">logout</span>
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
