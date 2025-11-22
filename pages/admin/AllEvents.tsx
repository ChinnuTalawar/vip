import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarIcon, UsersIcon, TrashIcon } from '../../components/Icons';
import { getEvents, deleteEvent } from '../../services/supabaseService';
import { Event } from '../../types';

const AllEvents: React.FC = () => {
    const navigate = useNavigate();
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

    useEffect(() => {
        fetchEvents();

        const handleClickOutside = () => setActiveMenuId(null);
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const fetchEvents = async () => {
        const data = await getEvents();
        setEvents(data);
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
            try {
                await deleteEvent(id);
                setEvents(prev => prev.filter(e => e.id !== id));
            } catch (error) {
                console.error('Error deleting event:', error);
                alert('Failed to delete event.');
            }
        }
    };

    const filteredEvents = events.filter(event => {
        const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.location.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || event.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    // Count events by status
    const allCount = events.length;
    const publishedCount = events.filter(e => e.status === 'Published').length;
    const ongoingCount = events.filter(e => e.status === 'Ongoing').length;
    const completedCount = events.filter(e => e.status === 'Completed').length;
    const draftCount = events.filter(e => e.status === 'Draft').length;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Published': return 'bg-blue-500/90 text-white';
            case 'Ongoing': return 'bg-green-500/90 text-white';
            case 'Completed': return 'bg-slate-500/90 text-white';
            case 'Draft': return 'bg-amber-500/90 text-white';
            default: return 'bg-slate-500/90 text-white';
        }
    };

    const getStatusLabel = (status: string) => {
        return status === 'Published' ? 'Upcoming' : status;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header with Actions */}
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={() => navigate('/admin/create')}
                        className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors shadow-lg shadow-purple-500/20"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        New Event
                    </button>
                    <button className="px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-medium flex items-center gap-2 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                        </svg>
                        Filter
                    </button>
                    <button className="px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-medium flex items-center gap-2 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Export
                    </button>
                </div>

                <div className="w-full md:w-auto">
                    <div className="relative">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search by title, status, date..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full md:w-80 pl-10 pr-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                        />
                    </div>
                </div>
            </div>

            {/* Status Filter Tabs */}
            <div className="flex gap-2 flex-wrap">
                {['All', 'Published', 'Ongoing', 'Completed', 'Draft'].map(status => (
                    <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={`px-4 py-2 rounded-full font-medium text-sm transition-colors ${statusFilter === status
                            ? 'bg-purple-600 text-white'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700'
                            }`}
                    >
                        {status === 'All' ? `All (${allCount})` :
                            status === 'Published' ? `Published (${publishedCount})` :
                                status === 'Ongoing' ? `Ongoing (${ongoingCount})` :
                                    status === 'Completed' ? `Completed (${completedCount})` :
                                        `Draft (${draftCount})`}
                    </button>
                ))}
            </div>

            {/* Events Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map((event) => (
                    <div
                        key={event.id}
                        className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 hover:shadow-xl hover:shadow-slate-900/5 dark:hover:shadow-black/20 transition-all duration-300 relative group"
                    >
                        {/* Event Image */}
                        <div className="relative h-56 bg-slate-200 dark:bg-slate-700 overflow-hidden">
                            <img
                                src={event.imageUrl}
                                alt={event.name}
                                className="w-full h-full object-cover"
                            />
                            {/* Overlay gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

                            {/* Status Badge */}
                            <div className="absolute top-4 left-4">
                                <span className={`px-3 py-1.5 rounded-lg text-xs font-bold ${getStatusColor(event.status)} backdrop-blur-sm`}>
                                    {getStatusLabel(event.status)}
                                </span>
                            </div>

                            {/* Three dots menu */}
                            <div className="absolute top-4 right-4">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveMenuId(activeMenuId === event.id ? null : event.id);
                                    }}
                                    className="p-2.5 bg-white/90 dark:bg-slate-800/90 rounded-xl hover:bg-white dark:hover:bg-slate-800 transition-colors backdrop-blur-sm shadow-sm"
                                >
                                    <svg className="w-5 h-5 text-slate-700 dark:text-slate-300" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                                    </svg>
                                </button>

                                {activeMenuId === event.id && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-20 animate-in fade-in zoom-in-95 duration-100">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/admin/create?eventId=${event.id}`);
                                                setActiveMenuId(null);
                                            }}
                                            className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center gap-3 transition-colors"
                                        >
                                            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                            </svg>
                                            Edit Event
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(event.id);
                                                setActiveMenuId(null);
                                            }}
                                            className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-3 transition-colors"
                                        >
                                            <TrashIcon className="w-4 h-4" />
                                            Delete Event
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Event Details */}
                        <div className="p-5 space-y-4">
                            <h3 className="font-bold text-xl text-slate-900 dark:text-white line-clamp-2 leading-tight">
                                {event.name}
                            </h3>

                            <div className="flex items-end justify-between gap-2">
                                <div className="space-y-2.5 text-sm text-slate-600 dark:text-slate-400">
                                    <div className="flex items-center gap-2.5">
                                        <CalendarIcon className="w-4 h-4 flex-shrink-0" />
                                        <span>{new Date(event.date).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}</span>
                                    </div>
                                    <div className="flex items-center gap-2.5">
                                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <span className="line-clamp-1">{event.location}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="flex items-center gap-4 pt-3 border-t border-slate-200 dark:border-slate-700">
                                <div className="flex items-center gap-2">
                                    <UsersIcon className="w-4 h-4 text-slate-500" />
                                    <div className="text-sm">
                                        <span className="font-semibold text-slate-900 dark:text-white">{event.volunteers}</span>
                                        <span className="text-slate-400"> / {event.totalSlots}</span>
                                    </div>
                                </div>
                                <div className="text-sm text-slate-600 dark:text-slate-400">
                                    Revenue: <span className="font-semibold text-slate-900 dark:text-white">$0</span>
                                </div>
                                <div className="ml-auto flex items-center gap-1.5 text-slate-500">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    <span className="text-xs font-medium">Views</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredEvents.length === 0 && (
                <div className="text-center py-16">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
                        <CalendarIcon className="w-10 h-10 text-slate-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">No Events Found</h3>
                    <p className="text-slate-500 dark:text-slate-400 mb-6">Try adjusting your search or filters.</p>
                    <button
                        onClick={() => navigate('/admin/create')}
                        className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
                    >
                        Create Your First Event
                    </button>
                </div>
            )}
        </div>
    );
};

export default AllEvents;
