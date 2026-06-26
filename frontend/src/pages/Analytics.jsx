import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import totalTaskIcon from '../assets/total task.png';
import pendingIcon from '../assets/pending.png';
import completedIcon from '../assets/completed.png';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie
} from 'recharts';

const Analytics = () => {
  const { token } = useAuth();
  const [stats, setStats] = useState({
    totalTasks: 0,
    pendingTasks: 0,
    inProgressTasks: 0,
    completedTasks: 0,
    overdueTasks: 0,
    weeklyData: [],
    monthlyData: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/api/tasks/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.success) {
          setStats(response.data.data);
        }
      } catch (err) {
        console.error('Error fetching analytics stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [token]);

  // Data 1: Weekly Completion Trend (Completed & Projected)
  const weeklyData = stats.weeklyData && stats.weeklyData.length > 0
    ? stats.weeklyData
    : [
        { name: 'MON', Completed: 0, Projected: 0 },
        { name: 'TUE', Completed: 0, Projected: 0 },
        { name: 'WED', Completed: 0, Projected: 0 },
        { name: 'THU', Completed: 0, Projected: 0 },
        { name: 'FRI', Completed: 0, Projected: 0 },
        { name: 'SAT', Completed: 0, Projected: 0 },
        { name: 'SUN', Completed: 0, Projected: 0 }
      ];

  // Data 2: Monthly Productivity Trend
  const monthlyData = stats.monthlyData && stats.monthlyData.length > 0
    ? stats.monthlyData
    : [
        { name: 'JAN', Productivity: 0 },
        { name: 'FEB', Productivity: 0 },
        { name: 'MAR', Productivity: 0 },
        { name: 'APR', Productivity: 0 },
        { name: 'MAY', Productivity: 0 },
        { name: 'JUN', Productivity: 0 }
      ];

  // Data 3: Task Distribution Donut Chart
  const total = stats.totalTasks || 0;
  const completedCount = stats.completedTasks || 0;
  const inProgressCount = stats.inProgressTasks || 0;
  const pendingCount = stats.pendingTasks || 0;
  const overdueCount = stats.overdueTasks || 0;

  const distributionData = [
    { name: 'Completed', value: completedCount, color: '#004ac6' },
    { name: 'In Progress', value: inProgressCount, color: '#b7c8e1' },
    { name: 'Pending', value: pendingCount, color: '#943700' },
    { name: 'Overdue', value: overdueCount, color: '#737686' }
  ];

  // Custom tooltips to match premium design system style
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-inverse-surface text-inverse-on-surface px-3 py-2 rounded-lg border border-outline-variant shadow-lg text-xs font-mono">
          <p className="font-semibold mb-1">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color || entry.fill }}></span>
              <span>{entry.name}: {entry.value}%</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <main className="max-w-container-max mx-auto px-8 py-8 pt-24 space-y-8">

      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-on-surface">Analytics Overview</h1>
        <p className="text-body-sm text-on-surface-variant mt-1">
          Real-time performance tracking and resource optimization.
        </p>
      </div>

      {/* KPI Cards (Stripe-inspired) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Card 1 */}
        <div className="bg-surface-container-lowest border border-outline-variant p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] font-bold tracking-wider uppercase text-on-surface-variant">Total Tasks</span>
            <img src={totalTaskIcon} alt="Total Tasks" className="w-8 h-8 object-contain" />
          </div>
          <div className="text-3xl font-bold text-on-surface">
            {loading ? '...' : stats.totalTasks}
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-tertiary">
            <span className="material-symbols-outlined text-[14px]">trending_up</span>
            <span>+12.5% from last month</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-surface-container-lowest border border-outline-variant p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] font-bold tracking-wider uppercase text-on-surface-variant">Completion Rate</span>
            <img src={completedIcon} alt="Completion Rate" className="w-8 h-8 object-contain" />
          </div>
          <div className="text-3xl font-bold text-on-surface">
            {loading ? '...' : stats.totalTasks > 0 ? `${Math.round((stats.completedTasks / stats.totalTasks) * 1000) / 10}%` : '0%'}
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-tertiary">
            <span className="material-symbols-outlined text-[14px]">trending_up</span>
            <span>+2.1% efficiency gain</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-surface-container-lowest border border-outline-variant p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] font-bold tracking-wider uppercase text-on-surface-variant">Pending Tasks</span>
            <img src={pendingIcon} alt="Pending Tasks" className="w-8 h-8 object-contain" />
          </div>
          <div className="text-3xl font-bold text-on-surface">
            {loading ? '...' : stats.pendingTasks}
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-outline">
            <span className="material-symbols-outlined text-[14px]">horizontal_rule</span>
            <span>Stable workload</span>
          </div>
        </div>

      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Grid Content (8/12) */}
        <div className="lg:col-span-8 space-y-6">

          {/* Weekly Completion Trend */}
          <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-base font-bold text-on-surface">Weekly Completion Trend</h3>
              <div className="flex items-center gap-4 text-[10px] font-bold tracking-wider uppercase text-on-surface-variant">
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-primary rounded-full"></span> Completed
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-secondary-container rounded-full"></span> Projected
                </div>
              </div>
            </div>

            <div className="h-64 w-full bg-surface-container-low rounded-lg p-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#004ac6" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#004ac6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-outline-variant)" opacity={0.3} />
                  <XAxis dataKey="name" stroke="var(--color-outline)" fontSize={10} tickLine={false} />
                  <YAxis stroke="var(--color-outline)" fontSize={10} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="Completed" stroke="#004ac6" strokeWidth={3} fillOpacity={1} fill="url(#colorCompleted)" name="Completed" />
                  <Area type="monotone" dataKey="Projected" stroke="#b7c8e1" strokeWidth={2} strokeDasharray="5 5" fill="none" name="Projected" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Monthly Productivity Trend */}
          <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-xl">
            <h3 className="text-base font-bold text-on-surface mb-6">Monthly Productivity Trend</h3>
            <div className="h-56 w-full bg-surface-container-low rounded-lg p-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-outline-variant)" opacity={0.3} />
                  <XAxis dataKey="name" stroke="var(--color-outline)" fontSize={10} tickLine={false} />
                  <YAxis stroke="var(--color-outline)" fontSize={10} tickLine={false} />
                  <Tooltip cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }} content={<CustomTooltip />} />
                  <Bar dataKey="Productivity" fill="#b7c8e1" radius={[4, 4, 0, 0]}>
                    {monthlyData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={index === 3 ? '#004ac6' : '#b7c8e1'}
                        className="hover:opacity-85 transition-opacity cursor-pointer"
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Right Grid Content (4/12) */}
        <div className="lg:col-span-4 space-y-6">

          {/* Task Distribution (Donut Chart) */}
          <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-xl">
            <h3 className="text-base font-bold text-on-surface mb-6">Task Distribution</h3>
            <div className="flex flex-col items-center">
              <div className="relative w-48 h-48 mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={distributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {distributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold leading-none">{total}</span>
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mt-1">TASKS</span>
                </div>
              </div>

              <div className="w-full grid grid-cols-2 gap-4 border-t border-outline-variant/30 pt-6">
                {distributionData.map((entry, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: entry.color }}></div>
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider leading-none mb-0.5">{entry.name}</span>
                      <span className="text-xs font-mono font-semibold">{entry.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
};

export default Analytics;
