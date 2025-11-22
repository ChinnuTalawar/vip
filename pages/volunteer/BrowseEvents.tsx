import React, { useState, useEffect } from 'react';
import { CalendarIcon, SparklesIcon } from '../../components/Icons';
import { useAuth } from '../../contexts/AuthContext';

const BrowseEvents: React.FC = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate loading
        const timer = setTimeout(() => {
            setLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

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

            <div className="flex flex-col md:flex-row justify-between items-end gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <SparklesIcon className="w-8 h-8 text-blue-500" />
                        College Events
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Find opportunities that match your skills and schedule.</p>
                </div>
            </div>

            <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
                    <CalendarIcon className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No college events available</h3>
                <p className="text-slate-500 dark:text-slate-400">Please check back later for updates.</p>
            </div>
        </div>
    );
};

export default BrowseEvents;