import React, { useState } from 'react';
import { useEvents } from '../../contexts/EventsContext';
import { generateEventReport } from '../../services/geminiService';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Card from '../../components/ui/Card';
import { CalendarIcon, UsersIcon, SparklesIcon } from '../../components/Icons';

interface GeneratedReport {
    executiveSummary: string;
    keyHighlights: string[];
    participantInsights: string;
    impactAnalysis: string;
    lessonsLearned: string[];
    recommendations: string[];
}

const Reports: React.FC = () => {
    const { events } = useEvents();
    const completedEvents = events.filter(e => e.status === 'Completed');

    const [selectedEventId, setSelectedEventId] = useState<string>('');
    const [generatedReport, setGeneratedReport] = useState<GeneratedReport | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<typeof events[0] | null>(null);

    const handleGenerateReport = async () => {
        if (!selectedEventId) {
            alert('Please select an event first');
            return;
        }

        const event = events.find(e => e.id === selectedEventId);
        if (!event) return;

        setSelectedEvent(event);
        setIsGenerating(true);

        try {
            const attendanceRate = event.totalSlots > 0
                ? Math.round((event.volunteers / event.totalSlots) * 100)
                : 0;

            const report = await generateEventReport({
                eventName: event.name,
                eventDate: new Date(event.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                }),
                location: event.location,
                description: event.description,
                totalVolunteers: event.volunteers,
                totalSlots: event.totalSlots,
                attendanceRate
            });

            setGeneratedReport(report);
        } catch (error) {
            console.error('Error generating report:', error);
            alert('Failed to generate report. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleExportPDF = () => {
        if (!selectedEvent || !generatedReport) return;

        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 20;
        let yPosition = 20;

        // Header
        doc.setFillColor(109, 40, 217); // Purple
        doc.rect(0, 0, pageWidth, 40, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.setFont('helvetica', 'bold');
        doc.text('Event Report', margin, 25);

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Generated on ${new Date().toLocaleDateString()}`, margin, 33);

        yPosition = 55;
        doc.setTextColor(0, 0, 0);

        // Event Details Section
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(109, 40, 217);
        doc.text('Event Details', margin, yPosition);
        yPosition += 10;

        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);

        const eventDetails = [
            ['Event Name', selectedEvent.name],
            ['Date', new Date(selectedEvent.date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })],
            ['Location', selectedEvent.location],
            ['Status', selectedEvent.status],
            ['Volunteers', `${selectedEvent.volunteers} / ${selectedEvent.totalSlots}`],
            ['Attendance Rate', `${Math.round((selectedEvent.volunteers / selectedEvent.totalSlots) * 100)}%`],
            ['Number of Shifts', selectedEvent.shifts.toString()]
        ];

        autoTable(doc, {
            startY: yPosition,
            head: [],
            body: eventDetails,
            theme: 'plain',
            styles: { fontSize: 10, cellPadding: 3 },
            columnStyles: {
                0: { fontStyle: 'bold', cellWidth: 50 },
                1: { cellWidth: 120 }
            },
            margin: { left: margin }
        });

        yPosition = (doc as any).lastAutoTable.finalY + 15;

        // Executive Summary
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(109, 40, 217);
        doc.text('Executive Summary', margin, yPosition);
        yPosition += 8;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);
        const summaryLines = doc.splitTextToSize(generatedReport.executiveSummary, pageWidth - 2 * margin);
        doc.text(summaryLines, margin, yPosition);
        yPosition += summaryLines.length * 5 + 10;

        // Check if we need a new page
        if (yPosition > 250) {
            doc.addPage();
            yPosition = 20;
        }

        // Key Highlights
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(109, 40, 217);
        doc.text('Key Highlights', margin, yPosition);
        yPosition += 8;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);
        generatedReport.keyHighlights.forEach((highlight, index) => {
            const bulletText = `• ${highlight}`;
            const lines = doc.splitTextToSize(bulletText, pageWidth - 2 * margin - 5);
            doc.text(lines, margin + 5, yPosition);
            yPosition += lines.length * 5 + 2;
        });
        yPosition += 8;

        // Check if we need a new page
        if (yPosition > 250) {
            doc.addPage();
            yPosition = 20;
        }

        // Participant Insights
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(109, 40, 217);
        doc.text('Participant Insights', margin, yPosition);
        yPosition += 8;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);
        const insightsLines = doc.splitTextToSize(generatedReport.participantInsights, pageWidth - 2 * margin);
        doc.text(insightsLines, margin, yPosition);
        yPosition += insightsLines.length * 5 + 10;

        // Check if we need a new page
        if (yPosition > 250) {
            doc.addPage();
            yPosition = 20;
        }

        // Impact Analysis
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(109, 40, 217);
        doc.text('Impact Analysis', margin, yPosition);
        yPosition += 8;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);
        const impactLines = doc.splitTextToSize(generatedReport.impactAnalysis, pageWidth - 2 * margin);
        doc.text(impactLines, margin, yPosition);
        yPosition += impactLines.length * 5 + 10;

        // Check if we need a new page
        if (yPosition > 250) {
            doc.addPage();
            yPosition = 20;
        }

        // Lessons Learned
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(109, 40, 217);
        doc.text('Lessons Learned', margin, yPosition);
        yPosition += 8;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);
        generatedReport.lessonsLearned.forEach((lesson, index) => {
            const bulletText = `• ${lesson}`;
            const lines = doc.splitTextToSize(bulletText, pageWidth - 2 * margin - 5);
            doc.text(lines, margin + 5, yPosition);
            yPosition += lines.length * 5 + 2;
        });
        yPosition += 8;

        // Check if we need a new page
        if (yPosition > 250) {
            doc.addPage();
            yPosition = 20;
        }

        // Recommendations
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(109, 40, 217);
        doc.text('Recommendations for Future Events', margin, yPosition);
        yPosition += 8;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);
        generatedReport.recommendations.forEach((rec, index) => {
            const bulletText = `• ${rec}`;
            const lines = doc.splitTextToSize(bulletText, pageWidth - 2 * margin - 5);
            doc.text(lines, margin + 5, yPosition);
            yPosition += lines.length * 5 + 2;
        });

        // Footer
        const pageCount = doc.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(128, 128, 128);
            doc.text(
                `Page ${i} of ${pageCount}`,
                pageWidth / 2,
                doc.internal.pageSize.getHeight() - 10,
                { align: 'center' }
            );
        }

        // Save the PDF

        const fileName = `${selectedEvent.name.replace(/[^a-z0-9]/gi, '_')}_Report_${new Date().toISOString().split('T')[0]}.pdf`;
        doc.save(fileName);
    };

    return (
        <div className="space-y-8 h-full flex flex-col max-w-7xl mx-auto">
            <div className="text-center max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Event Reports</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Generate and export comprehensive AI-powered insights for your completed events.</p>
            </div>

            {/* Event Selection - Centered */}
            <div className="max-w-4xl mx-auto w-full z-10">
                <Card className="overflow-visible shadow-lg shadow-slate-200/50 dark:shadow-none border-slate-200/60 dark:border-slate-700">
                    <div className="flex flex-col md:flex-row gap-6 items-start md:items-end">
                        <div className="flex-1 w-full relative">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 ml-1">
                                Select Completed Event
                            </label>
                            <div className="relative group">
                                <select
                                    value={selectedEventId}
                                    onChange={(e) => setSelectedEventId(e.target.value)}
                                    className="w-full p-3.5 pl-5 pr-12 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none appearance-none transition-all cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 font-medium"
                                >
                                    <option value="">Choose an event to analyze...</option>
                                    {completedEvents.map(event => (
                                        <option key={event.id} value={event.id}>
                                            {event.name}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-500 group-hover:text-purple-500 transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                            {selectedEventId && (
                                <div className="absolute -bottom-6 left-1">
                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
                                        <CalendarIcon className="w-3 h-3" />
                                        {completedEvents.find(e => e.id === selectedEventId)?.date &&
                                            new Date(completedEvents.find(e => e.id === selectedEventId)!.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
                                        }
                                    </p>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={handleGenerateReport}
                            disabled={!selectedEventId || isGenerating}
                            className={`w-full md:w-auto py-3.5 px-8 rounded-full font-bold text-white shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2 transition-all duration-300 transform active:scale-[0.98] flex-shrink-0 ${!selectedEventId || isGenerating
                                    ? 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed shadow-none text-slate-500 dark:text-slate-500'
                                    : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-pink-500 hover:to-rose-500 hover:shadow-pink-500/40'
                                }`}
                        >
                            <SparklesIcon className={`w-5 h-5 ${isGenerating ? 'animate-spin' : ''}`} />
                            {isGenerating ? 'Generating Report...' : 'Generate AI Report'}
                        </button>
                    </div>

                    {completedEvents.length === 0 && (
                        <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 rounded-lg text-sm text-center border border-amber-100 dark:border-amber-900/30">
                            No completed events found. Complete an event to generate reports.
                        </div>
                    )}
                </Card>
            </div>

            {/* Report Preview Area */}
            <div className="flex-1 w-full">
                {!generatedReport ? (
                    <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm p-12 text-center min-h-[400px] flex flex-col items-center justify-center border-dashed">
                        <div className="w-24 h-24 rounded-full bg-purple-50 dark:bg-purple-900/10 flex items-center justify-center mb-6 group relative overflow-hidden">
                            <div className="absolute inset-0 bg-purple-100 dark:bg-purple-900/20 rounded-full scale-0 group-hover:scale-100 transition-transform duration-500 ease-out"></div>
                            <svg className="w-10 h-10 text-purple-300 dark:text-purple-700/50 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Ready to Generate Insights</h3>
                        <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                            Select a completed event from the dropdown above and let our AI analyze the data to provide actionable insights.
                        </p>
                    </div>
                ) : (
                    <Card
                        title={
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                    <SparklesIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Event Report: {selectedEvent?.name}</h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-normal">Generated on {new Date().toLocaleDateString()}</p>
                                </div>
                            </div>
                        }
                        action={
                            <button
                                onClick={handleExportPDF}
                                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium text-sm flex items-center gap-2 transition-all shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/30"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Download PDF
                            </button>
                        }
                        className="overflow-hidden border-t-4 border-t-purple-500"
                    >
                        <div className="space-y-8 max-h-[calc(100vh-12rem)] overflow-y-auto pr-4 -mr-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                            {/* Event Stats Overview */}
                            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6 border border-slate-100 dark:border-slate-700/50">
                                <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Event Overview</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                    <div className="space-y-1">
                                        <p className="text-xs text-slate-500">Date</p>
                                        <div className="flex items-center gap-2 font-medium text-slate-900 dark:text-white">
                                            <CalendarIcon className="w-4 h-4 text-purple-500" />
                                            {new Date(selectedEvent!.date).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs text-slate-500">Location</p>
                                        <div className="flex items-center gap-2 font-medium text-slate-900 dark:text-white">
                                            <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <span className="truncate">{selectedEvent!.location}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs text-slate-500">Participation</p>
                                        <div className="flex items-center gap-2 font-medium text-slate-900 dark:text-white">
                                            <UsersIcon className="w-4 h-4 text-purple-500" />
                                            {selectedEvent!.volunteers} / {selectedEvent!.totalSlots}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs text-slate-500">Attendance</p>
                                        <div className="flex items-center gap-2 font-medium text-slate-900 dark:text-white">
                                            <div className="w-16 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-green-500 rounded-full"
                                                    style={{ width: `${Math.round((selectedEvent!.volunteers / selectedEvent!.totalSlots) * 100)}% ` }}
                                                />
                                            </div>
                                            <span className="text-sm">{Math.round((selectedEvent!.volunteers / selectedEvent!.totalSlots) * 100)}%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Report Sections */}
                            <div className="space-y-8">
                                <section>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                                        <span className="w-1 h-6 bg-purple-500 rounded-full"></span>
                                        Executive Summary
                                    </h3>
                                    <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-800/30 p-6 rounded-xl border border-slate-100 dark:border-slate-700/50">
                                        {generatedReport.executiveSummary}
                                    </div>
                                </section>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <section>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                                            <span className="w-1 h-5 bg-blue-500 rounded-full"></span>
                                            Key Highlights
                                        </h3>
                                        <ul className="space-y-3 bg-white dark:bg-slate-800/30 p-6 rounded-xl border border-slate-100 dark:border-slate-700/50 h-full">
                                            {generatedReport.keyHighlights.map((highlight, index) => (
                                                <li key={index} className="flex items-start gap-3 text-slate-600 dark:text-slate-300">
                                                    <span className="mt-1.5 w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0"></span>
                                                    <span className="leading-relaxed">{highlight}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </section>

                                    <section>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                                            <span className="w-1 h-5 bg-green-500 rounded-full"></span>
                                            Participant Insights
                                        </h3>
                                        <div className="bg-white dark:bg-slate-800/30 p-6 rounded-xl border border-slate-100 dark:border-slate-700/50 h-full text-slate-600 dark:text-slate-300 leading-relaxed">
                                            {generatedReport.participantInsights}
                                        </div>
                                    </section>
                                </div>

                                <section>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                                        <span className="w-1 h-5 bg-orange-500 rounded-full"></span>
                                        Impact Analysis
                                    </h3>
                                    <div className="bg-white dark:bg-slate-800/30 p-6 rounded-xl border border-slate-100 dark:border-slate-700/50 text-slate-600 dark:text-slate-300 leading-relaxed">
                                        {generatedReport.impactAnalysis}
                                    </div>
                                </section>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <section>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                                            <span className="w-1 h-5 bg-red-500 rounded-full"></span>
                                            Lessons Learned
                                        </h3>
                                        <ul className="space-y-3 bg-white dark:bg-slate-800/30 p-6 rounded-xl border border-slate-100 dark:border-slate-700/50 h-full">
                                            {generatedReport.lessonsLearned.map((lesson, index) => (
                                                <li key={index} className="flex items-start gap-3 text-slate-600 dark:text-slate-300">
                                                    <span className="mt-1.5 w-1.5 h-1.5 bg-red-500 rounded-full flex-shrink-0"></span>
                                                    <span className="leading-relaxed">{lesson}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </section>

                                    <section>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                                            <span className="w-1 h-5 bg-indigo-500 rounded-full"></span>
                                            Recommendations
                                        </h3>
                                        <ul className="space-y-3 bg-white dark:bg-slate-800/30 p-6 rounded-xl border border-slate-100 dark:border-slate-700/50 h-full">
                                            {generatedReport.recommendations.map((rec, index) => (
                                                <li key={index} className="flex items-start gap-3 text-slate-600 dark:text-slate-300">
                                                    <span className="mt-1.5 w-1.5 h-1.5 bg-indigo-500 rounded-full flex-shrink-0"></span>
                                                    <span className="leading-relaxed">{rec}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </section>
                                </div>
                            </div>
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default Reports;

