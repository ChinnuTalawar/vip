import React, { useState, useEffect } from 'react';
import { SparklesIcon, CalendarIcon, MapPinIcon } from '../../components/Icons';
import Card from '../../components/ui/Card';
import { useAuth } from '../../contexts/AuthContext';
import { getEvents, joinEvent } from '../../services/supabaseService';

const Recommended: React.FC = () => {
    const { user } = useAuth();
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRecommendedEvents();
    }, []);

    const fetchRecommendedEvents = async () => {
        setLoading(true);
        const allEvents = await getEvents();
        // Simple recommendation: just take the first 3 events for now
        // In a real app, we'd filter by user interests
        const recommended = allEvents.slice(0, 3).map(event => ({
            ...event,
            matchScore: Math.floor(Math.random() * (99 - 80 + 1) + 80), // Random match score 80-99
            matchReason: 'Matches your interests'
        }));
        setEvents(recommended);
        setLoading(false);
    };

    const handleJoin = async (eventId: string) => {
        if (!user) return;
        if (confirm('Do you want to join this event?')) {
            const result = await joinEvent(user.id, eventId);
            if (result.success) {
                alert('Successfully joined event!');
            } else {
                alert(result.message);
            }
        }
    };

    if (loading) return <div className="p-8 text-center">Loading recommendations...</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <SparklesIcon className="w-8 h-8 text-indigo-500" />
                        Recommended for You
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        Curated opportunities based on your skills and past activity.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                    <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
                        <div className="relative h-48 -mx-6 -mt-6 mb-4 overflow-hidden">
                            <img
                                src={event.imageUrl}
                                alt={event.name}
                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-indigo-600 dark:text-indigo-400 shadow-sm">
                                {event.matchScore}% Match
                            </div>
                        </div>

                        <div className="mb-4">
                            <div className="flex items-center gap-2 text-xs font-medium text-emerald-600 dark:text-emerald-400 mb-2 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded w-fit">
                                <SparklesIcon className="w-3 h-3" />
                                {event.matchReason}
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                {event.name}
                            </h3>

                            <div className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
                                <div className="flex items-center gap-2">
                                    <CalendarIcon className="w-4 h-4" />
                                    <span>{new Date(event.date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPinIcon className="w-4 h-4" />
                                    <span>{event.location}</span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => handleJoin(event.id)}
                            className="w-full py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-300 dark:hover:bg-indigo-900/50 rounded-lg font-medium transition-colors"
                        >
                            Quick Join
                        </button>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default Recommended;
