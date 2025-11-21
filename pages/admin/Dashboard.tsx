import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Card from '../../components/ui/Card';
import { ADMIN_STATS, CHART_DATA_HOURS, CHART_DATA_ROLES } from '../../services/mockData';
import { BriefcaseIcon, ClockIcon, UsersIcon } from '../../components/Icons';

const COLORS = ['#435663', '#64748b', '#94a3b8', '#cbd5e1'];

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400">Real-time overview of volunteer impact and needs.</p>
        </div>
        <button className="bg-primary text-white px-4 py-2 rounded-lg shadow-md text-sm font-medium hover:bg-slate-700 transition-colors">
          Generate Report
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="flex items-center gap-4 border-l-4 border-l-primary">
          <div className="p-3 bg-primary/10 rounded-full text-primary">
            <ClockIcon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Total Hours</p>
            <p className="text-2xl font-bold dark:text-white">{ADMIN_STATS.totalHours}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4 border-l-4 border-l-blue-500">
          <div className="p-3 bg-blue-100 rounded-full text-blue-600">
             <UsersIcon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Active Volunteers</p>
            <p className="text-2xl font-bold dark:text-white">{ADMIN_STATS.activeVolunteers}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4 border-l-4 border-l-amber-500">
          <div className="p-3 bg-amber-100 rounded-full text-amber-600">
            <BriefcaseIcon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Open Shifts</p>
            <p className="text-2xl font-bold dark:text-white">{ADMIN_STATS.openShifts}</p>
          </div>
        </Card>
         <Card className="flex items-center gap-4 border-l-4 border-l-green-500">
          <div className="p-3 bg-green-100 rounded-full text-green-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Growth</p>
            <p className="text-2xl font-bold dark:text-white">+12%</p>
          </div>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Volunteer Hours Trend" className="lg:col-span-2 h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={CHART_DATA_HOURS}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}h`} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                cursor={{ fill: 'transparent' }}
              />
              <Bar dataKey="value" fill="#435663" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Role Distribution" className="h-96">
          <div className="h-full flex flex-col justify-center">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={CHART_DATA_ROLES}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {CHART_DATA_ROLES.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
                {CHART_DATA_ROLES.map((entry, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                      <span className="text-slate-600 dark:text-slate-300">{entry.name}</span>
                    </div>
                    <span className="font-semibold text-slate-800 dark:text-white">{entry.value}%</span>
                  </div>
                ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;