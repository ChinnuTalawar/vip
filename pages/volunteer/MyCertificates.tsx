import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getUserCompletedEvents } from '../../services/supabaseService';
import { generateCertificate } from '../../utils/certificateGenerator';
import { FileTextIcon, DownloadIcon, CalendarIcon, ClockIcon, TrophyIcon } from '../../components/Icons';
import Card from '../../components/ui/Card';

interface Certificate {
    id: string;
    eventName: string;
    eventDate: string;
    role: string;
    hours: number;
    status: string;
}

const MyCertificates: React.FC = () => {
    const { user } = useAuth();
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCertificates = async () => {
            if (user) {
                const data = await getUserCompletedEvents(user.id);
                setCertificates(data);
            }
            setLoading(false);
        };
        fetchCertificates();
    }, [user]);

    const handleDownload = (cert: Certificate) => {
        generateCertificate({
            eventName: cert.eventName,
            date: cert.eventDate,
            role: cert.role,
            hours: cert.hours,
            volunteerName: user?.name || user?.email || 'Volunteer',
            progress: 100 // Completed events are 100% done
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <FileTextIcon className="w-8 h-8 text-indigo-500" />
                    My Certificates
                </h1>
            </div>

            {certificates.length === 0 ? (
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 p-12 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mb-4">
                        <FileTextIcon className="w-8 h-8 text-indigo-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No certificates to display</h3>
                    <p className="text-slate-500 dark:text-slate-400 max-w-md">
                        Complete volunteer events to earn certificates. Once your attendance is verified and the event is completed, your certificates will appear here.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {certificates.map((cert) => (
                        <div key={cert.id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
                            <div className="h-2 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
                                        <TrophyIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium rounded-full">
                                        Completed
                                    </span>
                                </div>

                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-1" title={cert.eventName}>
                                    {cert.eventName}
                                </h3>

                                <div className="space-y-2 mb-6">
                                    <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                                        <CalendarIcon className="w-4 h-4 mr-2" />
                                        {new Date(cert.eventDate).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                                        <ClockIcon className="w-4 h-4 mr-2" />
                                        {cert.hours} Hours Contributed
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleDownload(cert)}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-700/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg transition-colors font-medium text-sm border border-slate-200 dark:border-slate-600 hover:border-indigo-200 dark:hover:border-indigo-800"
                                >
                                    <DownloadIcon className="w-4 h-4" />
                                    Download Certificate
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyCertificates;
