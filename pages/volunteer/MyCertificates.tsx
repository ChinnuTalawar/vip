import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import { DownloadIcon, FileTextIcon, SearchIcon, AwardIcon, ClockIcon, CalendarIcon } from '../../components/Icons';
import { useAuth } from '../../contexts/AuthContext';
import { getUserCompletedEvents } from '../../services/supabaseService';
import { generateCertificate } from '../../utils/certificateGenerator';

interface Certificate {
    id: string;
    eventName: string;
    date: string;
    role: string;
    hours: number;
}

const MyCertificates: React.FC = () => {
    const { user } = useAuth();
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [filteredCertificates, setFilteredCertificates] = useState<Certificate[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilter, setSelectedFilter] = useState<'all' | 'recent' | 'oldest'>('all');

    useEffect(() => {
        const fetchCertificates = async () => {
            if (user) {
                setLoading(true);
                const data = await getUserCompletedEvents(user.id);
                setCertificates(data);
                setFilteredCertificates(data);
                setLoading(false);
            }
        };
        fetchCertificates();
    }, [user]);

    useEffect(() => {
        let filtered = [...certificates];

        // Apply search filter
        if (searchQuery) {
            filtered = filtered.filter(cert =>
                cert.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                cert.role.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Apply sort filter
        if (selectedFilter === 'recent') {
            filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        } else if (selectedFilter === 'oldest') {
            filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        }

        setFilteredCertificates(filtered);
    }, [searchQuery, selectedFilter, certificates]);

    const handleDownload = (cert: Certificate) => {
        generateCertificate({
            eventName: cert.eventName,
            date: cert.date,
            role: cert.role,
            hours: cert.hours,
            volunteerName: user?.name || user?.email || 'Volunteer',
            progress: 100 // All completed events are 100%
        });
    };

    // Calculate statistics
    const totalHours = certificates.reduce((sum, cert) => sum + cert.hours, 0);
    const totalEvents = certificates.length;
    const averageHours = totalEvents > 0 ? (totalHours / totalEvents).toFixed(1) : '0';

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <FileTextIcon className="w-8 h-8 text-indigo-500" />
                    My Certificates
                </h1>
            </div>

            {/* Statistics Cards */}
            {certificates.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 border-indigo-200 dark:border-indigo-800">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-indigo-500 rounded-lg">
                                <AwardIcon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Total Certificates</p>
                                <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalEvents}</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-500 rounded-lg">
                                <ClockIcon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Total Hours</p>
                                <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalHours.toFixed(1)}</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 border-amber-200 dark:border-amber-800">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-amber-500 rounded-lg">
                                <CalendarIcon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Avg Hours/Event</p>
                                <p className="text-2xl font-bold text-slate-900 dark:text-white">{averageHours}</p>
                            </div>
                        </div>
                    </Card>
                </div>
            )}

            {/* Search and Filter Bar */}
            {certificates.length > 0 && (
                <Card>
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search by event name or role..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>

                        {/* Filter */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => setSelectedFilter('all')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedFilter === 'all'
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                                    }`}
                            >
                                All
                            </button>
                            <button
                                onClick={() => setSelectedFilter('recent')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedFilter === 'recent'
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                                    }`}
                            >
                                Recent
                            </button>
                            <button
                                onClick={() => setSelectedFilter('oldest')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedFilter === 'oldest'
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                                    }`}
                            >
                                Oldest
                            </button>
                        </div>
                    </div>
                </Card>
            )}

            {/* Certificates Grid */}
            {filteredCertificates.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCertificates.map(cert => (
                        <Card key={cert.id} className="hover:shadow-xl transition-all duration-300 border-l-4 border-l-indigo-500 group">
                            <div className="flex flex-col h-full">
                                {/* Certificate Icon/Badge */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/50 transition-colors">
                                        <AwardIcon className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                    <div className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-bold rounded-full">
                                        100% Complete
                                    </div>
                                </div>

                                {/* Event Details */}
                                <div className="flex-1 mb-4">
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-2">
                                        {cert.eventName}
                                    </h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 flex items-center gap-1">
                                        <CalendarIcon className="w-4 h-4" />
                                        {new Date(cert.date).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>

                                    {/* Info Grid */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                            <span className="text-sm text-slate-600 dark:text-slate-400">Role:</span>
                                            <span className="text-sm font-semibold text-slate-900 dark:text-white">{cert.role}</span>
                                        </div>
                                        <div className="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                            <span className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-1">
                                                <ClockIcon className="w-4 h-4" />
                                                Hours:
                                            </span>
                                            <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">{cert.hours}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Download Button */}
                                <button
                                    onClick={() => handleDownload(cert)}
                                    className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
                                >
                                    <DownloadIcon className="w-5 h-5" />
                                    Download Certificate
                                </button>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : certificates.length > 0 ? (
                // No results from search/filter
                <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                    <div className="w-16 h-16 bg-slate-50 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4">
                        <SearchIcon className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">No certificates found</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">Try adjusting your search or filter</p>
                    <button
                        onClick={() => {
                            setSearchQuery('');
                            setSelectedFilter('all');
                        }}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        Clear Filters
                    </button>
                </div>
            ) : (
                // No certificates at all
                <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 border-dashed">
                    <div className="w-20 h-20 bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 rounded-full flex items-center justify-center mb-6">
                        <FileTextIcon className="w-10 h-10 text-indigo-500" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Certificates Yet</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-center max-w-md mb-6">
                        Complete volunteer events to earn certificates of appreciation. Your achievements will be displayed here!
                    </p>
                    <div className="flex flex-col items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                            <span>Join volunteer events</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                            <span>Complete your shifts</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                            <span>Download your certificates</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyCertificates;
