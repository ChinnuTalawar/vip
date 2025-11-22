import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { CalendarIcon, SparklesIcon, UsersIcon, GridIcon, ListIcon, ClockIcon, TrophyIcon, CheckCircleIcon } from '../../components/Icons';
import { useAuth } from '../../contexts/AuthContext';
import { getCollegeEvents, joinEvent, subscribeToEvents, getVolunteerStats } from '../../services/supabaseService';
import { Event } from '../../types';
import Card from '../../components/ui/Card';

const VolunteerDashboard: React.FC = () => {
    const { user } = useAuth();
    const [events, setEvents] = useState<Event[]>([]);
    const [stats, setStats] = useState({
        eventsJoined: 0,
        eventsCompleted: 0,
        hoursWorked: 0,
        certificatesGained: 0,
        monthlyHours: [] as { name: string; hours: number }[],
        statusDistribution: [] as { name: string; value: number; color: string }[]
    });
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState<{ message: string, visible: boolean, type: 'success' | 'error' }>({ message: '', visible: false, type: 'success' });
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    useEffect(() => {
        const fetchData = async () => {
            const eventsData = await getCollegeEvents();
            setEvents(eventsData);

            if (user) {
                const statsData = await getVolunteerStats(user.id);
                setStats(statsData);
            }

            setLoading(false);
        };
        fetchData();

        const unsubscribe = subscribeToEvents(() => {
            fetchData();
        });

        return () => {
            unsubscribe();
        };
    }, [user]);

    const handleSignUp = async (eventId: string, eventName: string) => {
        if (!user) {
            setToast({ message: 'Please log in to sign up.', visible: true, type: 'error' });
            setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000);
            return;
        }

        const result = await joinEvent(user.id, eventId);

        if (result.success) {
            setToast({ message: `Success! Signed up for ${eventName}.`, visible: true, type: 'success' });
            // Refresh events to update counts and stats
            const eventsData = await getCollegeEvents();
            setEvents(eventsData);
            const statsData = await getVolunteerStats(user.id);
            setStats(statsData);
        } else {
            setToast({ message: result.message || 'Failed to sign up.', visible: true, type: 'error' });
        }

        setTimeout(() => {
            setToast(prev => ({ ...prev, visible: false }));
        }, 3000);
    };

    const getEventStats = (event: Event) => {
        const totalSlots = event.shifts?.reduce((acc, shift) => acc + shift.requiredCount, 0) || 0;
        const volunteers = event.shifts?.reduce((acc, shift) => acc + shift.filledCount, 0) || 0;
        return { totalSlots, volunteers };
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 relative min-h-screen">
            {/* Background Decoration */}
            <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/40 dark:bg-blue-900/10 rounded-full blur-3xl opacity-50"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-100/40 dark:bg-purple-900/10 rounded-full blur-3xl opacity-50"></div>
            </div>

            {/* Toast Notification */}
            {toast.visible && (
                <div className={`fixed bottom-6 right-6 px-6 py-4 rounded-xl shadow-2xl z-50 flex items-center gap-3 animate-bounce-up border border-white/10 ${toast.type === 'success' ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900' : 'bg-red-500 text-white'}`}>
                    <div className={`${toast.type === 'success' ? 'bg-green-500' : 'bg-white/20'} rounded-full p-1`}>
                        {toast.type === 'success' ? (
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                        ) : (
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path></svg>
                        )}
                    </div>
                    <div className="font-medium">{toast.message}</div>
                </div>
            )}

            {/* Dashboard Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400">
                            <CalendarIcon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Events Joined</p>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{stats.eventsJoined}</h3>
                        </div>
                    </div>
                </Card>

                <Card className="border-l-4 border-l-indigo-500 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-full text-indigo-600 dark:text-indigo-400">
                            <ClockIcon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Hours Worked</p>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{stats.hoursWorked}</h3>
                        </div>
                    </div>
                </Card>

                <Card className="border-l-4 border-l-emerald-500 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-full text-emerald-600 dark:text-emerald-400">
                            <CheckCircleIcon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Events Completed</p>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{stats.eventsCompleted}</h3>
                        </div>
                    </div>
                </Card>

                <Card className="border-l-4 border-l-purple-500 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full text-purple-600 dark:text-purple-400">
                            <TrophyIcon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Certificates</p>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{stats.certificatesGained}</h3>
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
                            <BarChart data={stats.monthlyHours}>
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
                                    data={stats.statusDistribution}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {stats.statusDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        {/* Legend */}
                        <div className="absolute bottom-4 right-4 flex flex-col gap-2">
                            {stats.statusDistribution.map((entry, index) => (
                                <div key={index} className="flex items-center gap-2 text-sm">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                                    <span className="text-slate-600 dark:text-slate-400">{entry.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-end gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <SparklesIcon className="w-8 h-8 text-blue-500" />
                        Volunteer Dashboard
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Your activity overview and available opportunities.</p>
                </div>

                {/* View Toggle */}
                <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}
                        title="Grid View"
                    >
                        <GridIcon className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}
                        title="List View"
                    >
                        <ListIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {events.map(event => {
                        const { totalSlots, volunteers } = getEventStats(event);
                        return (
                            <div key={event.id} className="group flex flex-col h-full bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-blue-500/5 hover:border-blue-500/20 transition-all duration-300 overflow-hidden backdrop-blur-sm">
                                <div className="relative h-40 overflow-hidden">
                                    <img
                                        src={event.imageUrl || 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop'}
                                        alt={event.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                                    <div className="absolute bottom-3 left-3 text-white">
                                        <div className="flex items-center gap-1.5 text-xs font-medium opacity-90">
                                            <CalendarIcon className="w-3.5 h-3.5" />
                                            <span>{new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 flex-1 flex flex-col">
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 leading-tight group-hover:text-blue-500 transition-colors">{event.name}</h3>
                                    <p className="text-slate-500 dark:text-slate-400 text-xs mb-4 line-clamp-2 leading-relaxed">{event.description}</p>

                                    <div className="mt-auto space-y-3">
                                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <span className="line-clamp-1">{event.location}</span>
                                        </div>

                                        <div className="flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-2">
                                                <UsersIcon className="w-4 h-4 text-slate-500" />
                                                <span className="text-slate-600 dark:text-slate-400">
                                                    {volunteers}/{totalSlots} volunteers
                                                </span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => handleSignUp(event.id, event.name)}
                                            className="w-full py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-blue-600 dark:hover:bg-blue-100 rounded-lg font-medium text-sm transition-colors"
                                        >
                                            Sign Up
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="space-y-4">
                    {events.map(event => {
                        const { totalSlots, volunteers } = getEventStats(event);
                        return (
                            <div key={event.id} className="group flex flex-col md:flex-row bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl shadow-sm hover:shadow-lg hover:border-blue-500/20 transition-all duration-300 overflow-hidden backdrop-blur-sm">
                                <div className="relative h-48 md:h-auto md:w-64 flex-shrink-0 overflow-hidden">
                                    <img
                                        src={event.imageUrl || 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop'}
                                        alt={event.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 md:hidden"></div>
                                    <div className="absolute bottom-3 left-3 text-white md:hidden">
                                        <div className="flex items-center gap-1.5 text-xs font-medium opacity-90">
                                            <CalendarIcon className="w-3.5 h-3.5" />
                                            <span>{new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors">{event.name}</h3>
                                            <div className="hidden md:flex items-center gap-1.5 text-sm font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700/50 px-3 py-1 rounded-full">
                                                <CalendarIcon className="w-4 h-4" />
                                                <span>{new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                            </div>
                                        </div>
                                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 leading-relaxed">{event.description}</p>

                                        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-400 mb-4">
                                            <div className="flex items-center gap-2">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                <span>{event.location}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <UsersIcon className="w-4 h-4" />
                                                <span>{volunteers}/{totalSlots} volunteers</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-end">
                                        <button
                                            onClick={() => handleSignUp(event.id, event.name)}
                                            className="px-6 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-blue-600 dark:hover:bg-blue-100 rounded-lg font-medium text-sm transition-colors"
                                        >
                                            Sign Up
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {events.length === 0 && (
                <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
                        <CalendarIcon className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No Events Available</h3>
                    <p className="text-slate-500 dark:text-slate-400">Check back later for new volunteer opportunities!</p>
                </div>
            )}
        </div>
    );
};

export default VolunteerDashboard;
