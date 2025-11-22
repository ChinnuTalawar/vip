import React, { useState, useEffect } from 'react';
import { CalendarIcon, UsersIcon, GridIcon, ListIcon, PlusIcon } from '../../components/Icons';
import { useAuth } from '../../contexts/AuthContext';
import { getCollegeEvents, joinEvent, subscribeToEvents, createCollegeInfo, getAllColleges } from '../../services/supabaseService';
import { Event, CollegeInfo } from '../../types';

const CollegeEvents: React.FC = () => {
    const { user } = useAuth();
    const [events, setEvents] = useState<Event[]>([]);
    const [colleges, setColleges] = useState<CollegeInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState<{ message: string, visible: boolean, type: 'success' | 'error' }>({ message: '', visible: false, type: 'success' });
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [showCollegeForm, setShowCollegeForm] = useState(false);

    // College Form State
    const [collegeForm, setCollegeForm] = useState({
        collegeName: '',
        collegeAddress: '',
        collegeCity: '',
        collegeState: '',
        collegePincode: '',
        collegePhone: '',
        collegeEmail: '',
        collegeWebsite: '',
        contactPersonName: '',
        contactPersonDesignation: '',
        contactPersonPhone: '',
        contactPersonEmail: ''
    });

    useEffect(() => {
        fetchData();

        const unsubscribe = subscribeToEvents(() => {
            fetchData();
        });

        return () => {
            unsubscribe();
        };
    }, []);

    const fetchData = async () => {
        const [eventsData, collegesData] = await Promise.all([
            getCollegeEvents(),
            getAllColleges()
        ]);
        setEvents(eventsData);
        setColleges(collegesData);
        setLoading(false);
    };

    const handleSignUp = async (eventId: string, eventName: string) => {
        if (!user) {
            setToast({ message: 'Please log in to sign up.', visible: true, type: 'error' });
            setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000);
            return;
        }

        const result = await joinEvent(user.id, eventId);

        if (result.success) {
            setToast({ message: `Success! Signed up for ${eventName}.`, visible: true, type: 'success' });
            fetchData();
        } else {
            setToast({ message: result.message || 'Failed to sign up.', visible: true, type: 'error' });
        }

        setTimeout(() => {
            setToast(prev => ({ ...prev, visible: false }));
        }, 3000);
    };

    const handleSubmitCollege = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await createCollegeInfo(collegeForm);
            setToast({ message: 'College information added successfully!', visible: true, type: 'success' });
            setShowCollegeForm(false);
            setCollegeForm({
                collegeName: '',
                collegeAddress: '',
                collegeCity: '',
                collegeState: '',
                collegePincode: '',
                collegePhone: '',
                collegeEmail: '',
                collegeWebsite: '',
                contactPersonName: '',
                contactPersonDesignation: '',
                contactPersonPhone: '',
                contactPersonEmail: ''
            });
            fetchData();
        } catch (error) {
            setToast({ message: 'Failed to add college information.', visible: true, type: 'error' });
        }

        setTimeout(() => {
            setToast(prev => ({ ...prev, visible: false }));
        }, 3000);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Toast Notification */}
            {toast.visible && (
                <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg animate-in slide-in-from-top ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
                    } text-white`}>
                    {toast.message}
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                            <CalendarIcon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">College Events</h1>
                            <p className="text-slate-500 dark:text-slate-400">Discover and join college-organized volunteer opportunities</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowCollegeForm(true)}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors shadow-lg shadow-indigo-500/20"
                    >
                        <PlusIcon className="w-5 h-5" />
                        Add College
                    </button>

                    <div className="flex bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-1">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-md transition-colors ${viewMode === 'grid'
                                    ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                }`}
                        >
                            <GridIcon className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-md transition-colors ${viewMode === 'list'
                                    ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                }`}
                        >
                            <ListIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* College Form Modal */}
            {showCollegeForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-6 flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Add College Information</h2>
                            <button
                                onClick={() => setShowCollegeForm(false)}
                                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmitCollege} className="p-6 space-y-6">
                            {/* College Details */}
                            <div>
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">College Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                            College Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={collegeForm.collegeName}
                                            onChange={(e) => setCollegeForm({ ...collegeForm, collegeName: e.target.value })}
                                            className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                            placeholder="Enter college name"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                            Address <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            required
                                            rows={3}
                                            value={collegeForm.collegeAddress}
                                            onChange={(e) => setCollegeForm({ ...collegeForm, collegeAddress: e.target.value })}
                                            className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                            placeholder="Enter complete address"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                            City <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={collegeForm.collegeCity}
                                            onChange={(e) => setCollegeForm({ ...collegeForm, collegeCity: e.target.value })}
                                            className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                            placeholder="City"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                            State <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={collegeForm.collegeState}
                                            onChange={(e) => setCollegeForm({ ...collegeForm, collegeState: e.target.value })}
                                            className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                            placeholder="State"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                            Pincode <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            pattern="[0-9]{6}"
                                            value={collegeForm.collegePincode}
                                            onChange={(e) => setCollegeForm({ ...collegeForm, collegePincode: e.target.value })}
                                            className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                            placeholder="6-digit pincode"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                            Phone
                                        </label>
                                        <input
                                            type="tel"
                                            value={collegeForm.collegePhone}
                                            onChange={(e) => setCollegeForm({ ...collegeForm, collegePhone: e.target.value })}
                                            className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                            placeholder="College phone number"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            value={collegeForm.collegeEmail}
                                            onChange={(e) => setCollegeForm({ ...collegeForm, collegeEmail: e.target.value })}
                                            className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                            placeholder="college@example.com"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                            Website
                                        </label>
                                        <input
                                            type="url"
                                            value={collegeForm.collegeWebsite}
                                            onChange={(e) => setCollegeForm({ ...collegeForm, collegeWebsite: e.target.value })}
                                            className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                            placeholder="https://college.edu"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Contact Person Details */}
                            <div>
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Contact Person Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                            Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={collegeForm.contactPersonName}
                                            onChange={(e) => setCollegeForm({ ...collegeForm, contactPersonName: e.target.value })}
                                            className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                            placeholder="Contact person name"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                            Designation
                                        </label>
                                        <input
                                            type="text"
                                            value={collegeForm.contactPersonDesignation}
                                            onChange={(e) => setCollegeForm({ ...collegeForm, contactPersonDesignation: e.target.value })}
                                            className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                            placeholder="e.g., Event Coordinator"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                            Phone <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            required
                                            value={collegeForm.contactPersonPhone}
                                            onChange={(e) => setCollegeForm({ ...collegeForm, contactPersonPhone: e.target.value })}
                                            className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                            placeholder="Contact phone number"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                            Email <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            required
                                            value={collegeForm.contactPersonEmail}
                                            onChange={(e) => setCollegeForm({ ...collegeForm, contactPersonEmail: e.target.value })}
                                            className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                            placeholder="contact@example.com"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Submit Buttons */}
                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                                <button
                                    type="button"
                                    onClick={() => setShowCollegeForm(false)}
                                    className="px-6 py-3 border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium shadow-lg shadow-indigo-500/20 transition-colors"
                                >
                                    Add College
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Events Grid/List */}
            {events.length === 0 ? (
                <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <div className="w-20 h-20 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CalendarIcon className="w-10 h-10 text-slate-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">No College Events Yet</h3>
                    <p className="text-slate-500 dark:text-slate-400 mb-6">College events will appear here once they are created.</p>
                </div>
            ) : (
                <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
                    {events.map((event: any) => (
                        <div
                            key={event.id}
                            className={`bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300 ${viewMode === 'list' ? 'flex' : ''
                                }`}
                        >
                            <div className={`relative ${viewMode === 'list' ? 'w-48 flex-shrink-0' : 'h-48'} bg-slate-200 dark:bg-slate-700`}>
                                <img
                                    src={event.imageUrl}
                                    alt={event.name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                {event.collegeInfo && (
                                    <div className="absolute bottom-3 left-3 right-3">
                                        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-lg px-3 py-1.5">
                                            <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                                                {event.collegeInfo.collegeName}
                                            </p>
                                            <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
                                                {event.collegeInfo.collegeCity}, {event.collegeInfo.collegeState}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="p-5 flex-1">
                                <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-2 line-clamp-2">
                                    {event.name}
                                </h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                                    {event.description}
                                </p>

                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                        <CalendarIcon className="w-4 h-4" />
                                        <span>{new Date(event.date).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                        <UsersIcon className="w-4 h-4" />
                                        <span>{event.volunteers} / {event.totalSlots} volunteers</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleSignUp(event.id, event.name)}
                                    disabled={event.volunteers >= event.totalSlots}
                                    className={`w-full py-2.5 rounded-lg font-medium transition-colors ${event.volunteers >= event.totalSlots
                                            ? 'bg-slate-100 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
                                            : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20'
                                        }`}
                                >
                                    {event.volunteers >= event.totalSlots ? 'Event Full' : 'Sign Up'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CollegeEvents;
