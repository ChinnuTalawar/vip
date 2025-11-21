import React, { useState } from 'react';
import { EVENTS } from '../../services/mockData';
import { CalendarIcon } from '../../components/Icons';

const BrowseEvents: React.FC = () => {
    const [filter, setFilter] = useState('All');
    const [signedUpShifts, setSignedUpShifts] = useState<string[]>([]);
    const [toast, setToast] = useState<{ message: string, visible: boolean }>({ message: '', visible: false });

    const filteredEvents = filter === 'All'
        ? EVENTS
        : EVENTS.filter(e => e.category === filter);

    const categories = ['All', 'Environment', 'Community', 'Education'];

    const handleSignUp = (shiftId: string, shiftRole: string, eventName: string) => {
        // Mock API call simulation
        setSignedUpShifts([...signedUpShifts, shiftId]);

        // Show Toast
        setToast({ message: `Success! Signed up for ${shiftRole} at ${eventName}.`, visible: true });

        // Hide Toast after 3 seconds
        setTimeout(() => {
            setToast(prev => ({ ...prev, visible: false }));
        }, 3000);
    };

    return (
        <div className="space-y-8 relative">
            {/* Toast Notification */}
            {toast.visible && (
                <div className="fixed bottom-6 right-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-4 rounded-lg shadow-2xl z-50 flex items-center gap-3 animate-bounce-up">
                    <svg className="w-6 h-6 text-green-400 dark:text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    <div className="font-medium">{toast.message}</div>
                </div>
            )}

            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Opportunity Browser</h1>
                    <p className="text-slate-500 dark:text-slate-400">Find opportunities that match your skills and schedule.</p>
                </div>

                <div className="flex gap-2 bg-white dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${filter === cat
                                ? 'bg-primary text-white shadow-sm'
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map(event => (
                    <div key={event.id} className="group flex flex-col h-full bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden">
                        <div className="relative h-48 overflow-hidden">
                            <img
                                src={event.imageUrl}
                                alt={event.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute top-3 right-3 bg-white/90 dark:bg-black/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wide shadow-sm">
                                {event.category}
                            </div>
                        </div>

                        <div className="p-6 flex-1 flex flex-col">
                            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm mb-2">
                                <CalendarIcon className="w-4 h-4" />
                                <span>{new Date(event.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}</span>
                                <span className="mx-1">•</span>
                                <span>{event.location}</span>
                            </div>

                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-primary transition-colors">{event.name}</h3>
                            <p className="text-slate-600 dark:text-slate-300 text-sm mb-6 line-clamp-3">{event.description}</p>

                            <div className="mt-auto space-y-3">
                                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Available Shifts</div>
                                {event.shifts.map(shift => {
                                    const isSignedUp = signedUpShifts.includes(shift.id);
                                    const isFull = shift.filledCount >= shift.requiredCount && !isSignedUp;
                                    const percentFull = Math.round((shift.filledCount / shift.requiredCount) * 100);

                                    return (
                                        <div key={shift.id} className={`border rounded-lg p-3 transition-colors ${isSignedUp ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50'}`}>
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="font-medium text-slate-800 dark:text-white">{shift.role}</span>
                                                <span className="text-xs bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded text-slate-600 dark:text-slate-300">
                                                    {shift.startTime} - {shift.endTime}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                {!isSignedUp && (
                                                    <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full rounded-full ${isFull ? 'bg-red-400' : 'bg-green-500'}`}
                                                            style={{ width: `${percentFull}%` }}
                                                        />
                                                    </div>
                                                )}
                                                {isSignedUp ? (
                                                    <div className="w-full text-center text-sm font-bold text-green-600 dark:text-green-400 flex items-center justify-center gap-2">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                                        <span>Signed Up</span>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => handleSignUp(shift.id, shift.role, event.name)}
                                                        disabled={isFull}
                                                        className={`text-xs font-bold px-3 py-1 rounded transition-colors ${isFull
                                                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                                            : 'bg-primary text-white hover:bg-slate-700 shadow-sm'
                                                            }`}
                                                    >
                                                        {isFull ? 'FULL' : 'SIGN UP'}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BrowseEvents;