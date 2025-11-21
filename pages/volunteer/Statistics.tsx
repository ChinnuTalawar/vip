import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { ChartIcon, ClockIcon, CalendarIcon, TrophyIcon } from '../../components/Icons';
import Card from '../../components/ui/Card';

const Statistics: React.FC = () => {
    // Mock Data
    const summaryData = {
        totalEvents: 12,
        totalHours: 48,
        completionRate: 92, // Percentage
        streak: 5 // Current streak in days or events
    };

    const monthlyData = [
        { name: 'Jan', hours: 4 },
        { name: 'Feb', hours: 8 },
        { name: 'Mar', hours: 6 },
        { name: 'Apr', hours: 12 },
        { name: 'May', hours: 10 },
        { name: 'Jun', hours: 8 },
    ];

    const statusData = [
        { name: 'Completed', value: 11, color: '#10b981' }, // emerald-500
        { name: 'Cancelled', value: 1, color: '#ef4444' }, // red-500
        { name: 'No Show', value: 0, color: '#f59e0b' }, // amber-500
    ];

    const growthData = [
        { name: 'Week 1', events: 1 },
        { name: 'Week 2', events: 2 },
        { name: 'Week 3', events: 2 },
        { name: 'Week 4', events: 3 },
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ChartIcon className="w-8 h-8 text-indigo-500" />
                My Statistics
            </h1>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border-l-4 border-l-blue-500">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400">
                            <CalendarIcon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Events Joined</p>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{summaryData.totalEvents}</h3>
                        </div>
                    </div>
                </Card>

                <Card className="border-l-4 border-l-indigo-500">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-full text-indigo-600 dark:text-indigo-400">
                            <ClockIcon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Hours Worked</p>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{summaryData.totalHours}</h3>
                        </div>
                    </div>
                </Card>

                <Card className="border-l-4 border-l-emerald-500">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-full text-emerald-600 dark:text-emerald-400">
                            <TrophyIcon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Completion Rate</p>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{summaryData.completionRate}%</h3>
                        </div>
                    </div>
                </Card>

                <Card className="border-l-4 border-l-amber-500">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-full text-amber-600 dark:text-amber-400">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Current Streak</p>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{summaryData.streak} Events</h3>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Monthly Hours Bar Chart */}
                <Card title="Monthly Hours Volunteered">
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={monthlyData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    cursor={{ fill: '#f1f5f9' }}
                                />
                                <Bar dataKey="hours" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Event Status Pie Chart */}
                <Card title="Event Completion Status">
                    <div className="h-80 w-full flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        {/* Legend */}
                        <div className="absolute bottom-4 right-4 flex flex-col gap-2">
                            {statusData.map((entry, index) => (
                                <div key={index} className="flex items-center gap-2 text-sm">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                                    <span className="text-slate-600 dark:text-slate-400">{entry.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>

                {/* Growth Line Chart */}
                <Card title="Cumulative Events Joined (This Month)" className="lg:col-span-2">
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={growthData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Line type="monotone" dataKey="events" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4, fill: '#8b5cf6', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Statistics;
