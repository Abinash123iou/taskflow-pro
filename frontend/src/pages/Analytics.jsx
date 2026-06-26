import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
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
  const [stats, setStats] = useState({ totalTasks: 0, pendingTasks: 0, inProgressTasks: 0, completedTasks: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('http://localhost:5000/tasks/stats', {
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
  const weeklyData = [
    { name: 'MON', Completed: 20, Projected: 30 },
    { name: 'TUE', Completed: 40, Projected: 35 },
    { name: 'WED', Completed: 35, Projected: 40 },
    { name: 'THU', Completed: 55, Projected: 45 },
    { name: 'FRI', Completed: 45, Projected: 50 },
    { name: 'SAT', Completed: 65, Projected: 55 },
    { name: 'SUN', Completed: 60, Projected: 60 }
  ];

  // Data 2: Monthly Productivity Trend
  const monthlyData = [
    { name: 'JAN', Productivity: 42 },
    { name: 'FEB', Productivity: 65 },
    { name: 'MAR', Productivity: 55 },
    { name: 'APR', Productivity: 92 },
    { name: 'MAY', Productivity: 75 },
    { name: 'JUN', Productivity: 82 }
  ];

  // Data 3: Task Distribution Donut Chart
  const total = stats.totalTasks || 100; // fallback for display
  const completedCount = stats.completedTasks || 60;
  const inProgressCount = stats.inProgressTasks || 25;
  const pendingCount = stats.pendingTasks || 10;
  const overdueCount = Math.round(total * 0.05); // 5% overdue representation

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
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-on-surface">Analytics Overview</h1>
          <p className="text-body-sm text-on-surface-variant mt-1">
            Real-time performance tracking and resource optimization.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="bg-surface-container-high text-on-surface px-4 py-2.5 rounded-lg font-bold text-xs tracking-wider uppercase flex items-center gap-2 hover:bg-surface-variant transition-all cursor-pointer">
            <span className="material-symbols-outlined text-[18px]">calendar_today</span>
            Last 30 Days
          </button>
          <button className="bg-primary text-on-primary px-4 py-2.5 rounded-lg font-bold text-xs tracking-wider uppercase flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all cursor-pointer">
            <span className="material-symbols-outlined text-[18px]">download</span>
            Export CSV
          </button>
        </div>
      </div>

      {/* KPI Cards (Stripe-inspired) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1 */}
        <div className="bg-surface-container-lowest border border-outline-variant p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] font-bold tracking-wider uppercase text-on-surface-variant">Total Tasks</span>
            <span className="material-symbols-outlined text-primary">assignment</span>
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
            <span className="material-symbols-outlined text-primary">check_circle</span>
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
            <span className="material-symbols-outlined text-primary">pending_actions</span>
          </div>
          <div className="text-3xl font-bold text-on-surface">
            {loading ? '...' : stats.pendingTasks}
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-outline">
            <span className="material-symbols-outlined text-[14px]">horizontal_rule</span>
            <span>Stable workload</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-surface-container-lowest border border-outline-variant p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow border-l-4 border-l-primary">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] font-bold tracking-wider uppercase text-on-surface-variant">Productivity Score</span>
            <span className="material-symbols-outlined text-primary">bolt</span>
          </div>
          <div className="text-3xl font-bold text-on-surface">92</div>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-tertiary font-bold">
            <span className="material-symbols-outlined text-[14px]">stars</span>
            <span>Top 5% of organizations</span>
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
                      <stop offset="5%" stopColor="#004ac6" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#004ac6" stopOpacity={0}/>
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

          {/* Smart Insights Panel */}
          <div className="bg-surface-container-high p-6 rounded-xl border border-outline-variant relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-[80px] select-none">lightbulb</span>
            </div>
            
            <h3 className="text-base font-bold text-on-surface mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-tertiary">psychology_alt</span>
              Smart Insights
            </h3>
            
            <div className="space-y-4">
              <div className="bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/30">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[9px] font-bold tracking-wider uppercase text-on-surface-variant">Avg. Completion Time</span>
                  <span className="text-xs font-mono font-bold text-primary">1.4 days</span>
                </div>
                <div className="w-full bg-surface-container-low h-1 rounded-full overflow-hidden">
                  <div className="bg-primary h-full w-[70%]"></div>
                </div>
              </div>

              <div className="bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/30">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[9px] font-bold tracking-wider uppercase text-on-surface-variant">On-Time Delivery</span>
                  <span className="text-xs font-mono font-bold text-primary">91%</span>
                </div>
                <div className="w-full bg-surface-container-low h-1 rounded-full overflow-hidden">
                  <div className="bg-primary h-full w-[91%]"></div>
                </div>
              </div>

              <div className="pt-2">
                <p className="text-xs text-on-surface mb-4 leading-relaxed">
                  Your team completed <span className="text-tertiary font-bold">12% more tasks</span> this month compared to the previous period. Velocity is trending upwards.
                </p>
                
                <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
                  <div className="flex gap-3">
                    <span className="material-symbols-outlined text-primary text-[20px]">info</span>
                    <div className="flex-1">
                      <p className="text-[9px] font-bold tracking-wider uppercase text-primary mb-1">RECOMMENDATION</p>
                      <p className="text-xs text-on-surface leading-snug">
                        Consider reallocating resources to the <strong className="text-primary">'Architecture'</strong> project to meet upcoming deadlines.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Resource Performance Table */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-lowest">
          <h3 className="text-base font-bold text-on-surface">Resource Performance</h3>
          <button className="text-primary font-bold text-xs tracking-wider uppercase hover:underline cursor-pointer">
            View All Members
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Member</th>
                <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider text-center">Tasks Done</th>
                <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Efficiency</th>
                <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Current Load</th>
                <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant bg-surface">
              <tr className="hover:bg-surface-container-low transition-colors group">
                <td className="px-6 py-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center font-bold text-on-secondary-container text-xs">
                    AL
                  </div>
                  <div>
                    <div className="font-bold text-xs text-on-surface">Alex Lindholm</div>
                    <div className="text-[10px] text-on-surface-variant">Senior Architect</div>
                  </div>
                </td>
                <td className="px-6 py-4 text-center font-mono text-xs font-semibold">142</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-semibold">98%</span>
                    <div className="w-16 h-1 bg-surface-container-high rounded-full overflow-hidden">
                      <div className="bg-primary h-full w-[98%]"></div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase">OPTIMAL</span>
                </td>
                <td className="px-6 py-4">
                  <span className="material-symbols-outlined text-tertiary">trending_up</span>
                </td>
              </tr>
              <tr className="hover:bg-surface-container-low transition-colors">
                <td className="px-6 py-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-tertiary-fixed-dim flex items-center justify-center font-bold text-on-tertiary-fixed-variant text-xs">
                    SC
                  </div>
                  <div>
                    <div className="font-bold text-xs text-on-surface">Sarah Chen</div>
                    <div className="text-[10px] text-on-surface-variant">Lead Developer</div>
                  </div>
                </td>
                <td className="px-6 py-4 text-center font-mono text-xs font-semibold">98</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-semibold">89%</span>
                    <div className="w-16 h-1 bg-surface-container-high rounded-full overflow-hidden">
                      <div className="bg-primary h-full w-[89%]"></div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="bg-tertiary/10 text-tertiary px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase">HEAVY</span>
                </td>
                <td className="px-6 py-4">
                  <span className="material-symbols-outlined text-outline">horizontal_rule</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </main>
  );
};

export default Analytics;
