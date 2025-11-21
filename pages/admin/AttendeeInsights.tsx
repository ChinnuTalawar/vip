import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { CalendarIcon, UsersIcon, ClockIcon, ChartIcon } from '../../components/Icons';

// Mock data for events with insights
const EVENT_INSIGHTS = [
    {
        id: '1',
        name: 'Summer Beach Cleanup',
        date: '2024-07-15',
        totalVolunteers: 24,
        totalSlots: 30,
        fillRate: 80,
        avgRating: 4.5,
        attendanceRate: 92,
        volunteersByRole: [
            { role: 'General', count: 12 },
            { role: 'Leadership', count: 6 },
            { role: 'Technical', count: 4 },
            { role: 'Logistics', count: 2 }
        ],
        attendanceTrend: [
            { time: '9:00 AM', volunteers: 5 },
            { time: '10:00 AM', volunteers: 15 },
            { time: '11:00 AM', volunteers: 22 },
            { time: '12:00 PM', volunteers: 24 },
            { time: '1:00 PM', volunteers: 20 },
            { time: '2:00 PM', volunteers: 12 }
        ],
        demographics: {
            ageGroups: [
                { group: '18-25', count: 8 },
                { group: '26-35', count: 10 },
                { group: '36-50', count: 4 },
                { group: '50+', count: 2 }
            ],
            experience: [
                { level: 'First Time', count: 6 },
                { level: 'Returning', count: 10 },
                { level: 'Regular', count: 8 }
            ]
        }
    },
    {
        id: '2',
        name: 'Food Bank Distribution',
        date: '2024-07-20',
        totalVolunteers: 15,
        totalSlots: 20,
        fillRate: 75,
        avgRating: 4.8,
        attendanceRate: 95,
        volunteersByRole: [
            { role: 'General', count: 8 },
            { role: 'Leadership', count: 3 },
            { role: 'Technical', count: 2 },
            { role: 'Logistics', count: 2 }
        ],
        attendanceTrend: [
            { time: '8:00 AM', volunteers: 3 },
            { time: '9:00 AM', volunteers: 10 },
            { time: '10:00 AM', volunteers: 14 },
            { time: '11:00 AM', volunteers: 15 },
            { time: '12:00 PM', volunteers: 12 },
            { time: '1:00 PM', volunteers: 8 }
        ],
        demographics: {
            ageGroups: [
                { group: '18-25', count: 4 },
                { group: '26-35', count: 6 },
                { group: '36-50', count: 3 },
                { group: '50+', count: 2 }
            ],
            experience: [
                { level: 'First Time', count: 3 },
                { level: 'Returning', count: 6 },
                { level: 'Regular', count: 6 }
            ]
        }
    },
    {
        id: '3',
        name: 'Tree Planting Initiative',
        date: '2024-08-05',
        totalVolunteers: 32,
        totalSlots: 40,
        fillRate: 80,
        avgRating: 4.7,
        attendanceRate: 88,
        volunteersByRole: [
            { role: 'General', count: 18 },
            { role: 'Leadership', count: 6 },
            { role: 'Technical', count: 5 },
            { role: 'Logistics', count: 3 }
        ],
        attendanceTrend: [
            { time: '7:00 AM', volunteers: 8 },
            { time: '8:00 AM', volunteers: 20 },
            { time: '9:00 AM', volunteers: 28 },
            { time: '10:00 AM', volunteers: 32 },
            { time: '11:00 AM', volunteers: 30 },
            { time: '12:00 PM', volunteers: 25 }
        ],
        demographics: {
            ageGroups: [
                { group: '18-25', count: 12 },
                { group: '26-35', count: 14 },
                { group: '36-50', count: 4 },
                { group: '50+', count: 2 }
            ],
            experience: [
                { level: 'First Time', count: 10 },
                { level: 'Returning', count: 12 },
                { level: 'Regular', count: 10 }
            ]
        }
    }
];

const ROLE_COLORS = ['#4338ca', '#64748b', '#94a3b8', '#cbd5e1'];
const AGE_COLORS = ['#4338ca', '#6366f1', '#8b5cf6', '#a78bfa'];
const EXP_COLORS = ['#10b981', '#3b82f6', '#f59e0b'];

const AttendeeInsights: React.FC = () => {
    const [selectedEvent, setSelectedEvent] = useState(EVENT_INSIGHTS[0]);

    const totalVolunteersAllEvents = EVENT_INSIGHTS.reduce((sum, e) => sum + e.totalVolunteers, 0);
    const avgFillRate = Math.round(EVENT_INSIGHTS.reduce((sum, e) => sum + e.fillRate, 0) / EVENT_INSIGHTS.length);
    const avgAttendance = Math.round(EVENT_INSIGHTS.reduce((sum, e) => sum + e.attendanceRate, 0) / EVENT_INSIGHTS.length);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Attendee Insights</h1>
                <p className="text-slate-500 dark:text-slate-400">Analyze volunteer participation and engagement metrics across your events.</p>
            </div>

            {/* Overall Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="border-l-4 border-l-blue-500">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                            <CalendarIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Total Events</p>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">{EVENT_INSIGHTS.length}</p>
                        </div>
                    </div>
                </Card>

                <Card className="border-l-4 border-l-green-500">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                            <UsersIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Total Volunteers</p>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalVolunteersAllEvents}</p>
                        </div>
                    </div>
                </Card>

                <Card className="border-l-4 border-l-purple-500">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                            <ChartIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Avg Fill Rate</p>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">{avgFillRate}%</p>
                        </div>
                    </div>
                </Card>

                <Card className="border-l-4 border-l-amber-500">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                            <ClockIcon className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Avg Attendance</p>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">{avgAttendance}%</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Event Selector */}
            <Card>
                <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Select Event to View Insights
                    </label>
                    <select
                        value={selectedEvent.id}
                        onChange={(e) => setSelectedEvent(EVENT_INSIGHTS.find(ev => ev.id === e.target.value) || EVENT_INSIGHTS[0])}
                        className="w-full md:w-96 px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none"
                    >
                        {EVENT_INSIGHTS.map(event => (
                            <option key={event.id} value={event.id}>
                                {event.name} - {new Date(event.date).toLocaleDateString()}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Event-Specific Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg">
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Volunteers</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">
                            {selectedEvent.totalVolunteers}/{selectedEvent.totalSlots}
                        </p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg">
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Fill Rate</p>
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">{selectedEvent.fillRate}%</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg">
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Attendance</p>
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{selectedEvent.attendanceRate}%</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg">
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Avg Rating</p>
                        <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">⭐ {selectedEvent.avgRating}</p>
                    </div>
                </div>
            </Card>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Volunteers by Role */}
                <Card title="Volunteers by Role">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={selectedEvent.volunteersByRole}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                            <XAxis dataKey="role" stroke="#94a3b8" style={{ fontSize: '12px' }} />
                            <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1e293b',
                                    border: 'none',
                                    borderRadius: '8px',
                                    color: '#fff'
                                }}
                            />
                            <Bar dataKey="count" fill="#4338ca" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>

                {/* Attendance Trend */}
                <Card title="Attendance Trend">
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={selectedEvent.attendanceTrend}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                            <XAxis dataKey="time" stroke="#94a3b8" style={{ fontSize: '12px' }} />
                            <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1e293b',
                                    border: 'none',
                                    borderRadius: '8px',
                                    color: '#fff'
                                }}
                            />
                            <Line type="monotone" dataKey="volunteers" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 4 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </Card>

                {/* Age Distribution */}
                <Card title="Age Distribution">
                    <div className="flex items-center justify-center">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={selectedEvent.demographics.ageGroups}
                                    dataKey="count"
                                    nameKey="group"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    label={(entry) => `${entry.group}: ${entry.count}`}
                                >
                                    {selectedEvent.demographics.ageGroups.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={AGE_COLORS[index % AGE_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Experience Level */}
                <Card title="Volunteer Experience">
                    <div className="flex items-center justify-center">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={selectedEvent.demographics.experience}
                                    dataKey="count"
                                    nameKey="level"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    label={(entry) => `${entry.level}: ${entry.count}`}
                                >
                                    {selectedEvent.demographics.experience.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={EXP_COLORS[index % EXP_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>

            {/* Key Insights */}
            <Card title="Key Insights">
                <div className="space-y-4">
                    <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                        </div>
                        <div>
                            <h4 className="font-semibold text-slate-900 dark:text-white mb-1">High Engagement</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                {selectedEvent.attendanceRate}% attendance rate indicates strong volunteer commitment for this event.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                        <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-lg">
                            <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <h4 className="font-semibold text-slate-900 dark:text-white mb-1">Capacity Utilization</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                {selectedEvent.fillRate}% of available slots filled - {selectedEvent.fillRate >= 80 ? 'excellent' : 'good'} volunteer recruitment.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/40 rounded-lg">
                            <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <div>
                            <h4 className="font-semibold text-slate-900 dark:text-white mb-1">Diverse Participation</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                Mix of {selectedEvent.demographics.experience.find(e => e.level === 'First Time')?.count} first-time and {selectedEvent.demographics.experience.find(e => e.level === 'Regular')?.count} regular volunteers shows healthy community growth.
                            </p>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default AttendeeInsights;
