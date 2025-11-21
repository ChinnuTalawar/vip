import React, { useState } from 'react';
import { CalendarIcon, SparklesIcon, UsersIcon, GridIcon, ListIcon } from '../../components/Icons';
import { useEvents } from '../../contexts/EventsContext';

const BrowseEvents: React.FC = () => {
    const { events } = useEvents();
    const publishedEvents = events.filter(event => event.status === 'Published');
    const [toast, setToast] = useState<{ message: string, visible: boolean }>({ message: '', visible: false });
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    const handleSignUp = (eventName: string) => {
        // Show Toast
        setToast({ message: `Success! Signed up for ${eventName}.`, visible: true });

        // Hide Toast after 3 seconds
        setTimeout(() => {
            setToast(prev => ({ ...prev, visible: false }));
        }, 3000);
    };

    return (
        <div className="space-y-6 relative min-h-screen">
            {/* Background Decoration */}
            <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/40 dark:bg-blue-900/10 rounded-full blur-3xl opacity-50"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-100/40 dark:bg-purple-900/10 rounded-full blur-3xl opacity-50"></div>
            </div>

            {/* Toast Notification */}
            {toast.visible && (
                <div className="fixed bottom-6 right-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-4 rounded-xl shadow-2xl z-50 flex items-center gap-3 animate-bounce-up border border-white/10">
                    <div className="bg-green-500 rounded-full p-1">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <div className="font-medium">{toast.message}</div>
                </div>
            )}

            <div className="flex flex-col md:flex-row justify-between items-end gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <SparklesIcon className="w-8 h-8 text-blue-500" />
                        Opportunity Browser
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Find opportunities that match your skills and schedule.</p>
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
                    {publishedEvents.map(event => (
                        <div key={event.id} className="group flex flex-col h-full bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-blue-500/5 hover:border-blue-500/20 transition-all duration-300 overflow-hidden backdrop-blur-sm">
                            <div className="relative h-40 overflow-hidden">
                                <img
                                    src={event.imageUrl}
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
                                                {event.volunteers}/{event.totalSlots} volunteers
                                            </span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleSignUp(event.name)}
                                        className="w-full py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-blue-600 dark:hover:bg-blue-100 rounded-lg font-medium text-sm transition-colors"
                                    >
                                        Sign Up
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="space-y-4">
                    {publishedEvents.map(event => (
                        <div key={event.id} className="group flex flex-col md:flex-row bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl shadow-sm hover:shadow-lg hover:border-blue-500/20 transition-all duration-300 overflow-hidden backdrop-blur-sm">
                            <div className="relative h-48 md:h-auto md:w-64 flex-shrink-0 overflow-hidden">
                                <img
                                    src={event.imageUrl}
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
                                            <span>{event.volunteers}/{event.totalSlots} volunteers</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end">
                                    <button
                                        onClick={() => handleSignUp(event.name)}
                                        className="px-6 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-blue-600 dark:hover:bg-blue-100 rounded-lg font-medium text-sm transition-colors"
                                    >
                                        Sign Up
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {publishedEvents.length === 0 && (
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

export default BrowseEvents;