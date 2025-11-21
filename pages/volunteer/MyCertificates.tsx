import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import Card from '../../components/ui/Card';
import { DownloadIcon, FileTextIcon } from '../../components/Icons';
import { useAuth } from '../../contexts/AuthContext';
import { getUserCompletedEvents } from '../../services/supabaseService';

interface Certificate {
    id: string;
    eventName: string;
    date: string;
    role: string;
    hours: number;
}

const MOCK_CERTIFICATES: Certificate[] = [
    { id: '1', eventName: 'City Park Cleanup', date: '2024-06-15', role: 'Team Leader', hours: 4 },
    { id: '2', eventName: 'Food Bank Sort-a-thon', date: '2024-06-20', role: 'Sorter', hours: 4 },
];

const MyCertificates: React.FC = () => {
    const { user } = useAuth();
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [loading, setLoading] = useState(true);

    React.useEffect(() => {
        const fetchCertificates = async () => {
            if (user) {
                const data = await getUserCompletedEvents(user.id);
                setCertificates(data);
            }
            setLoading(false);
        };
        fetchCertificates();
    }, [user]);

    const generateCertificate = (cert: Certificate) => {
        const doc = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a4'
        });

        // Background
        doc.setFillColor(248, 250, 252); // slate-50
        doc.rect(0, 0, 297, 210, 'F');

        // Border
        doc.setLineWidth(2);
        doc.setDrawColor(79, 70, 229); // indigo-600
        doc.rect(10, 10, 277, 190);

        // Header
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(40);
        doc.setTextColor(79, 70, 229);
        doc.text('Certificate of Appreciation', 148.5, 50, { align: 'center' });

        // Content
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(16);
        doc.setTextColor(51, 65, 85); // slate-700
        doc.text('This certificate is proudly presented to', 148.5, 80, { align: 'center' });

        // Volunteer Name
        doc.setFont('times', 'bolditalic');
        doc.setFontSize(30);
        doc.setTextColor(15, 23, 42); // slate-900
        doc.text(user?.email || 'Volunteer', 148.5, 100, { align: 'center' });

        // Details
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(16);
        doc.setTextColor(51, 65, 85);
        doc.text('For their outstanding contribution and dedication as a', 148.5, 120, { align: 'center' });

        doc.setFont('helvetica', 'bold');
        doc.text(cert.role, 148.5, 130, { align: 'center' });

        doc.setFont('helvetica', 'normal');
        doc.text(`at the ${cert.eventName} event on ${new Date(cert.date).toLocaleDateString()}.`, 148.5, 140, { align: 'center' });

        doc.text(`Total Hours Volunteered: ${cert.hours}`, 148.5, 155, { align: 'center' });

        // Footer
        doc.setFontSize(12);
        doc.setTextColor(100, 116, 139); // slate-500
        doc.text('Thank you for making a difference!', 148.5, 180, { align: 'center' });

        doc.text('Eventure Management Team', 148.5, 190, { align: 'center' });

        doc.save(`${cert.eventName.replace(/\s+/g, '_')}_Certificate.pdf`);
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileTextIcon className="w-8 h-8 text-indigo-500" />
                My Certificates
            </h1>

            {certificates.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {certificates.map(cert => (
                        <Card key={cert.id} className="hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-indigo-500">
                            <div className="flex flex-col h-full">
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{cert.eventName}</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{new Date(cert.date).toLocaleDateString()}</p>

                                    <div className="space-y-2 mb-6">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500">Role:</span>
                                            <span className="font-medium text-slate-700 dark:text-slate-300">{cert.role}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500">Hours:</span>
                                            <span className="font-medium text-slate-700 dark:text-slate-300">{cert.hours}</span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => generateCertificate(cert)}
                                    className="w-full flex items-center justify-center gap-2 py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-300 dark:hover:bg-indigo-900/50 rounded-lg font-medium transition-colors"
                                >
                                    <DownloadIcon className="w-4 h-4" />
                                    Download PDF
                                </button>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 border-dashed">
                    <div className="w-16 h-16 bg-slate-50 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4">
                        <FileTextIcon className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">No certificate to display</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Complete volunteer events to earn certificates.</p>
                </div>
            )}
        </div>
    );
};

export default MyCertificates;
