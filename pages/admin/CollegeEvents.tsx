import React, { useState, useEffect } from 'react';
import { CalendarIcon, UsersIcon, GridIcon, ListIcon, PlusIcon, MapPinIcon } from '../../components/Icons';
import { useAuth } from '../../contexts/AuthContext';
import { getCollegeEvents, subscribeToEvents, createCollegeInfo, getAllColleges, createEvent, uploadEventImage } from '../../services/supabaseService';
import { Event, CollegeInfo } from '../../types';

const CollegeEvents: React.FC = () => {
    const { user } = useAuth();
    const [events, setEvents] = useState<Event[]>([]);
    const [colleges, setColleges] = useState<CollegeInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState<{ message: string, visible: boolean, type: 'success' | 'error' }>({ message: '', visible: false, type: 'success' });
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [showForm, setShowForm] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');
    const [uploading, setUploading] = useState(false);

    // Combined Form State
    const [formData, setFormData] = useState({
        // College Info
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
        contactPersonEmail: '',
        // Event Info
        eventName: '',
        eventDescription: '',
        eventDate: '',
        eventLocation: '',
        totalSlots: 30
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

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setUploading(true);

            // 1. Create college info
            const college = await createCollegeInfo({
                collegeName: formData.collegeName,
                collegeAddress: formData.collegeAddress,
                collegeCity: formData.collegeCity,
                collegeState: formData.collegeState,
                collegePincode: formData.collegePincode,
                collegePhone: formData.collegePhone,
                collegeEmail: formData.collegeEmail,
                collegeWebsite: formData.collegeWebsite,
                contactPersonName: formData.contactPersonName,
                contactPersonDesignation: formData.contactPersonDesignation,
                contactPersonPhone: formData.contactPersonPhone,
                contactPersonEmail: formData.contactPersonEmail
            });

            // 2. Upload image if provided
            let imageUrl = 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop';
            if (imageFile) {
                imageUrl = await uploadEventImage(imageFile);
            }

            // 3. Create event linked to college
            await createEvent({
                name: formData.eventName,
                description: formData.eventDescription,
                date: formData.eventDate,
                location: formData.eventLocation,
                imageUrl,
                status: 'Published',
                totalSlots: formData.totalSlots,
                shifts: 1,
                collegeId: college.id
            });

            setToast({ message: 'College and event created successfully!', visible: true, type: 'success' });
            setShowForm(false);
            resetForm();
            fetchData();
        } catch (error) {
            console.error('Error:', error);
            setToast({ message: 'Failed to create college event.', visible: true, type: 'error' });
        } finally {
            setUploading(false);
            setTimeout(() => {
                setToast(prev => ({ ...prev, visible: false }));
            }, 3000);
        }
    };

    const resetForm = () => {
        setFormData({
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
            contactPersonEmail: '',
            eventName: '',
            eventDescription: '',
            eventDate: '',
            eventLocation: '',
            totalSlots: 30
        });
        setImageFile(null);
        setImagePreview('');
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
                            <p className="text-slate-500 dark:text-slate-400">Manage college-organized volunteer opportunities</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowForm(true)}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors shadow-lg shadow-indigo-500/20"
                    >
                        <PlusIcon className="w-5 h-5" />
                        Add College Event
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

            {/* Combined Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-5xl w-full my-8">
                        <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-6 flex items-center justify-between rounded-t-2xl">
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Create College Event</h2>
                            <button
                                onClick={() => {
                                    setShowForm(false);
                                    resetForm();
                                }}
                                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-8 max-h-[calc(90vh-100px)] overflow-y-auto">
                            {/* College Details Section */}
                            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-6">
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                    <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
                                        <span className="text-indigo-600 dark:text-indigo-400 font-bold">1</span>
                                    </div>
                                    College Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                            College Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.collegeName}
                                            onChange={(e) => setFormData({ ...formData, collegeName: e.target.value })}
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
                                            rows={2}
                                            value={formData.collegeAddress}
                                            onChange={(e) => setFormData({ ...formData, collegeAddress: e.target.value })}
                                            className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                            placeholder="Complete address"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                            City <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.collegeCity}
                                            onChange={(e) => setFormData({ ...formData, collegeCity: e.target.value })}
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
                                            value={formData.collegeState}
                                            onChange={(e) => setFormData({ ...formData, collegeState: e.target.value })}
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
                                            value={formData.collegePincode}
                                            onChange={(e) => setFormData({ ...formData, collegePincode: e.target.value })}
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
                                            value={formData.collegePhone}
                                            onChange={(e) => setFormData({ ...formData, collegePhone: e.target.value })}
                                            className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                            placeholder="College phone"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            value={formData.collegeEmail}
                                            onChange={(e) => setFormData({ ...formData, collegeEmail: e.target.value })}
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
                                            value={formData.collegeWebsite}
                                            onChange={(e) => setFormData({ ...formData, collegeWebsite: e.target.value })}
                                            className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                            placeholder="https://college.edu"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Contact Person Section */}
                            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-6">
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                    <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
                                        <span className="text-indigo-600 dark:text-indigo-400 font-bold">2</span>
                                    </div>
                                    Contact Person
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                            Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.contactPersonName}
                                            onChange={(e) => setFormData({ ...formData, contactPersonName: e.target.value })}
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
                                            value={formData.contactPersonDesignation}
                                            onChange={(e) => setFormData({ ...formData, contactPersonDesignation: e.target.value })}
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
                                            value={formData.contactPersonPhone}
                                            onChange={(e) => setFormData({ ...formData, contactPersonPhone: e.target.value })}
                                            className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                            placeholder="Contact phone"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                            Email <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            required
                                            value={formData.contactPersonEmail}
                                            onChange={(e) => setFormData({ ...formData, contactPersonEmail: e.target.value })}
                                            className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                            placeholder="contact@example.com"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Event Details Section */}
                            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-6">
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                    <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
                                        <span className="text-indigo-600 dark:text-indigo-400 font-bold">3</span>
                                    </div>
                                    Event Details
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                            Event Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.eventName}
                                            onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
                                            className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                            placeholder="e.g., Campus Cleanup Drive"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                            Description <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            required
                                            rows={3}
                                            value={formData.eventDescription}
                                            onChange={(e) => setFormData({ ...formData, eventDescription: e.target.value })}
                                            className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                            placeholder="Describe the volunteer event..."
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                            Event Date <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            required
                                            value={formData.eventDate}
                                            onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                                            className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                            Location <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.eventLocation}
                                            onChange={(e) => setFormData({ ...formData, eventLocation: e.target.value })}
                                            className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                            placeholder="Event location"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                            Total Volunteer Slots <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            required
                                            min="1"
                                            value={formData.totalSlots}
                                            onChange={(e) => setFormData({ ...formData, totalSlots: parseInt(e.target.value) })}
                                            className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                            Event Image
                                        </label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                        />
                                    </div>

                                    {imagePreview && (
                                        <div className="md:col-span-2">
                                            <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Submit Buttons */}
                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowForm(false);
                                        resetForm();
                                    }}
                                    className="px-6 py-3 border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={uploading}
                                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium shadow-lg shadow-indigo-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {uploading ? 'Creating...' : 'Create College Event'}
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
                    <p className="text-slate-500 dark:text-slate-400 mb-6">Create your first college event to get started.</p>
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
                                        <MapPinIcon className="w-4 h-4" />
                                        <span className="truncate">{event.location}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                        <UsersIcon className="w-4 h-4" />
                                        <span>{event.volunteers || 0} / {event.totalSlots} volunteers</span>
                                    </div>
                                </div>

                                <div className="px-3 py-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg text-sm font-medium text-center">
                                    Published
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CollegeEvents;
