import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import { useAuth } from '../../contexts/AuthContext';
import { ClockIcon, CalendarIcon, MapPinIcon, UserGroupIcon, QrCodeIcon, ArrowsRightLeftIcon, DownloadIcon } from '../../components/Icons';
import { getUserSchedule, getEventShifts, updateRosterShift, cancelRosterEntry, getAllVolunteers, createSwapRequest, getPendingSwapRequests, respondToSwapRequest, getOutgoingSwapRequests } from '../../services/supabaseService';
import QRCode from 'qrcode';
import { generateCertificate } from '../../utils/certificateGenerator';


const MySchedule: React.FC = () => {
    const { user } = useAuth();
    const [upcomingShifts, setUpcomingShifts] = useState<any[]>([]);
    const [pastShifts, setPastShifts] = useState<any[]>([]);
    const [swapRequests, setSwapRequests] = useState<any[]>([]);
    const [outgoingRequests, setOutgoingRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Modals State
    const [showQRModal, setShowQRModal] = useState(false);
    const [qrCodeUrl, setQrCodeUrl] = useState('');
    const [selectedShift, setSelectedShift] = useState<any>(null);

    const [showChangeShiftModal, setShowChangeShiftModal] = useState(false);
    const [availableShifts, setAvailableShifts] = useState<any[]>([]);
    const [selectedNewShiftId, setSelectedNewShiftId] = useState('');

    const [showSwapModal, setShowSwapModal] = useState(false);
    const [volunteers, setVolunteers] = useState<any[]>([]);
    const [selectedVolunteerId, setSelectedVolunteerId] = useState('');

    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [user]);

    const fetchData = async () => {
        if (!user) return;
        setLoading(true);
        const schedule = await getUserSchedule(user.id);
        setUpcomingShifts(schedule.filter(s => ['Confirmed', 'Pending', 'CheckIn'].includes(s.status)));
        setPastShifts(schedule.filter(s => s.status === 'Completed'));

        const requests = await getPendingSwapRequests(user.id);
        setSwapRequests(requests);

        const outgoing = await getOutgoingSwapRequests(user.id);
        setOutgoingRequests(outgoing);

        setLoading(false);
    };

    const handleShowQR = async (shift: any) => {
        try {
            const url = await QRCode.toDataURL(shift.id);
            setQrCodeUrl(url);
            setSelectedShift(shift);
            setShowQRModal(true);
        } catch (err) {
            console.error(err);
        }
    };

    const handleShowChangeShift = async (shift: any) => {
        setSelectedShift(shift);
        const shifts = await getEventShifts(shift.eventId);
        // Filter out current shift
        setAvailableShifts(shifts.filter(s => s.id !== shift.shiftId));
        setShowChangeShiftModal(true);
    };

    const handleChangeShift = async () => {
        if (!selectedShift || !selectedNewShiftId) return;
        const success = await updateRosterShift(selectedShift.id, selectedNewShiftId);
        if (success) {
            alert('Shift changed successfully!');
            setShowChangeShiftModal(false);
            fetchData();
        } else {
            alert('Failed to change shift.');
        }
    };

    const handleShowSwap = async (shift: any) => {
        setSelectedShift(shift);
        const vols = await getAllVolunteers();
        setVolunteers(vols.filter(v => v.id !== user?.id));
        setShowSwapModal(true);
    };

    const handleSwapRequest = async () => {
        if (!selectedShift || !selectedVolunteerId || !user) return;
        const success = await createSwapRequest(user.id, selectedVolunteerId, selectedShift.id);
        if (success) {
            alert('Swap request sent!');
            setShowSwapModal(false);
            fetchData(); // Refresh to show in outgoing
        } else {
            alert('Failed to send swap request.');
        }
    };

    const handleCancelShift = async (shiftId: string) => {
        if (confirm('Are you sure you want to cancel this shift?')) {
            const success = await cancelRosterEntry(shiftId);
            if (success) fetchData();
        }
    };

    const handleRespondToSwap = async (requestId: string, status: 'Accepted' | 'Declined') => {
        const success = await respondToSwapRequest(requestId, status);
        if (success) {
            alert(`Request ${status.toLowerCase()}.`);
            fetchData();
        } else {
            alert('Failed to respond to request.');
        }
    };

    const handleDownloadCalendar = () => {
        if (upcomingShifts.length === 0) {
            alert('No upcoming shifts to sync.');
            return;
        }

        let icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Voluntier//NONSGML v1.0//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
`;

        upcomingShifts.forEach(shift => {
            const startDateTime = new Date(`${shift.eventDate}T${shift.startTime}`);
            const endDateTime = new Date(`${shift.eventDate}T${shift.endTime}`);

            const formatDate = (date: Date) => {
                return date.toISOString().replace(/-|:|\.\d\d\d/g, "");
            };

            icsContent += `BEGIN:VEVENT
UID:${shift.id}@voluntier.com
DTSTAMP:${formatDate(new Date())}
DTSTART:${formatDate(startDateTime)}
DTEND:${formatDate(endDateTime)}
SUMMARY:Volunteer Shift: ${shift.eventName}
DESCRIPTION:Role: ${shift.role}
LOCATION:${shift.eventLocation}
STATUS:CONFIRMED
END:VEVENT
`;
        });

        icsContent += 'END:VCALENDAR';

        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.setAttribute('download', 'volunteer_schedule.ics');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) return <div className="p-8 text-center">Loading schedule...</div>;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
            {/* Modals Overlay */}
            {(showQRModal || showChangeShiftModal || showSwapModal) && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    {/* QR Modal */}
                    {showQRModal && (
                        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 max-w-sm w-full text-center space-y-4">
                            <h3 className="text-xl font-bold dark:text-white">Your Ticket</h3>
                            <p className="text-sm text-slate-500">{selectedShift?.eventName}</p>
                            <img src={qrCodeUrl} alt="QR Code" className="mx-auto w-48 h-48" />
                            <p className="text-xs text-slate-400">Scan this code at the event check-in.</p>
                            <button onClick={() => setShowQRModal(false)} className="w-full py-2 bg-slate-100 dark:bg-slate-700 rounded-lg">Close</button>
                        </div>
                    )}

                    {/* Change Shift Modal */}
                    {showChangeShiftModal && (
                        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 max-w-md w-full space-y-4">
                            <h3 className="text-xl font-bold dark:text-white">Change Shift</h3>
                            <p className="text-sm text-slate-500">Select a new date/time for {selectedShift?.eventName}</p>
                            <select
                                className="w-full p-2 rounded border dark:bg-slate-700 dark:border-slate-600"
                                value={selectedNewShiftId}
                                onChange={(e) => setSelectedNewShiftId(e.target.value)}
                            >
                                <option value="">Select a shift...</option>
                                {availableShifts.map(s => (
                                    <option key={s.id} value={s.id}>
                                        {new Date(s.start_time).toLocaleDateString()} ({s.start_time} - {s.end_time})
                                    </option>
                                ))}
                            </select>
                            <div className="flex gap-3">
                                <button onClick={() => setShowChangeShiftModal(false)} className="flex-1 py-2 bg-slate-100 dark:bg-slate-700 rounded-lg">Cancel</button>
                                <button onClick={handleChangeShift} className="flex-1 py-2 bg-indigo-600 text-white rounded-lg">Confirm Change</button>
                            </div>
                        </div>
                    )}

                    {/* Swap Modal */}
                    {showSwapModal && (
                        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 max-w-md w-full space-y-4">
                            <h3 className="text-xl font-bold dark:text-white">Request Swap</h3>
                            <p className="text-sm text-slate-500">Select a volunteer to swap {selectedShift?.eventName} with.</p>
                            <select
                                className="w-full p-2 rounded border dark:bg-slate-700 dark:border-slate-600"
                                value={selectedVolunteerId}
                                onChange={(e) => setSelectedVolunteerId(e.target.value)}
                            >
                                <option value="">Select a volunteer...</option>
                                {volunteers.map(v => (
                                    <option key={v.id} value={v.id}>{v.name} ({v.email})</option>
                                ))}
                            </select>
                            <div className="flex gap-3">
                                <button onClick={() => setShowSwapModal(false)} className="flex-1 py-2 bg-slate-100 dark:bg-slate-700 rounded-lg">Cancel</button>
                                <button onClick={handleSwapRequest} className="flex-1 py-2 bg-indigo-600 text-white rounded-lg">Send Request</button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Left Column: Schedule */}
            <div className="lg:col-span-2 space-y-6">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Schedule</h1>

                {/* Incoming Swap Requests Section */}
                {swapRequests.length > 0 && (
                    <Card title="Incoming Swap Requests" className="border-l-4 border-l-amber-500">
                        <div className="space-y-4">
                            {swapRequests.map(req => (
                                <div key={req.id} className="flex items-center justify-between p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                                    <div>
                                        <p className="font-bold text-slate-900 dark:text-white">{req.sender.name} wants to swap</p>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">
                                            {req.roster_entry.shifts.events.name} on {new Date(req.roster_entry.shifts.events.date).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleRespondToSwap(req.id, 'Accepted')} className="px-3 py-1 bg-green-600 text-white rounded text-sm">Accept</button>
                                        <button onClick={() => handleRespondToSwap(req.id, 'Declined')} className="px-3 py-1 bg-red-600 text-white rounded text-sm">Decline</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                )}

                {/* Outgoing Swap Requests Section */}
                {outgoingRequests.length > 0 && (
                    <Card title="Outgoing Swap Requests" className="border-l-4 border-l-blue-500">
                        <div className="space-y-4">
                            {outgoingRequests.map(req => (
                                <div key={req.id} className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                    <div>
                                        <p className="font-bold text-slate-900 dark:text-white">Request to {req.receiver.name}</p>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">
                                            {req.roster_entry.shifts.events.name} on {new Date(req.roster_entry.shifts.events.date).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`px-3 py-1 rounded text-sm font-bold ${req.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                            req.status === 'Accepted' ? 'bg-green-100 text-green-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                            {req.status}
                                        </span>
                                        {req.status === 'Declined' && (
                                            <button
                                                onClick={() => handleShowSwap({
                                                    id: req.roster_entry_id, // Use roster_entry_id from request
                                                    eventName: req.roster_entry.shifts.events.name
                                                })}
                                                className="text-xs text-blue-600 underline"
                                            >
                                                Try Again
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                )}

                <Card title="Upcoming Shifts">
                    <div className="space-y-4">
                        {upcomingShifts.length === 0 ? (
                            <p className="text-slate-500 text-center py-4">No upcoming shifts.</p>
                        ) : (
                            upcomingShifts.map(shift => (
                                <div key={shift.id} className="flex flex-col md:flex-row md:items-start gap-4 p-4 border border-l-4 border-slate-200 border-l-indigo-500 rounded-lg bg-slate-50 dark:bg-slate-800/30 dark:border-slate-700">
                                    <div className="flex-col items-center justify-center text-center w-16 hidden md:flex">
                                        <span className="text-xs text-slate-500 uppercase font-bold">{new Date(shift.eventDate).toLocaleString('default', { month: 'short' })}</span>
                                        <span className="text-2xl font-bold text-slate-800 dark:text-white">{new Date(shift.eventDate).getDate()}</span>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-lg font-bold text-slate-900 dark:text-white">{shift.eventName}</h4>
                                        <p className="text-indigo-600 dark:text-indigo-400 font-medium text-sm">{shift.role}</p>
                                        <div className="flex items-center gap-2 mt-2 text-sm text-slate-500 dark:text-slate-400">
                                            <ClockIcon className="w-4 h-4" />
                                            <span>{shift.startTime} - {shift.endTime}</span>
                                        </div>
                                        <div className="flex items-center gap-2 mt-1 text-sm text-slate-500 dark:text-slate-400">
                                            <MapPinIcon className="w-4 h-4" />
                                            <span>{shift.eventLocation}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2 w-full md:w-auto">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleShowQR(shift)}
                                                className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded text-xs font-medium hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                                            >
                                                <QrCodeIcon className="w-3 h-3" />
                                                QR Code
                                            </button>
                                            <button
                                                onClick={() => handleCancelShift(shift.id)}
                                                className="flex-1 px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded text-xs font-medium hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleShowChangeShift(shift)}
                                                className="flex-1 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded text-xs font-medium hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                                            >
                                                Change Shift
                                            </button>
                                            <button
                                                onClick={() => handleShowSwap(shift)}
                                                className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded text-xs font-medium hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors"
                                            >
                                                <ArrowsRightLeftIcon className="w-3 h-3" />
                                                Swap
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </Card>

                <Card title="Hours Log">
                    <table className="w-full text-sm text-left text-slate-600 dark:text-slate-300">
                        <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-800 dark:text-slate-400">
                            <tr>
                                <th className="px-4 py-3 rounded-l-lg">Event</th>
                                <th className="px-4 py-3">Date</th>
                                <th className="px-4 py-3 text-center">Hours</th>
                                <th className="px-4 py-3 text-center">Certificate</th>
                                <th className="px-4 py-3 rounded-r-lg text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pastShifts.map(shift => (
                                <tr key={shift.id} className="border-b dark:border-slate-700">
                                    <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{shift.eventName}</td>
                                    <td className="px-4 py-3">{new Date(shift.eventDate).toLocaleDateString()}</td>
                                    <td className="px-4 py-3 text-center">
                                        {(() => {
                                            const start = new Date(`1970-01-01T${shift.startTime}`);
                                            const end = new Date(`1970-01-01T${shift.endTime}`);
                                            return parseFloat((Math.max(0, (end.getTime() - start.getTime()) / (1000 * 60 * 60))).toFixed(1));
                                        })()}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <button
                                            onClick={() => {
                                                const start = new Date(`1970-01-01T${shift.startTime}`);
                                                const end = new Date(`1970-01-01T${shift.endTime}`);
                                                const hours = parseFloat((Math.max(0, (end.getTime() - start.getTime()) / (1000 * 60 * 60))).toFixed(1));

                                                generateCertificate({
                                                    eventName: shift.eventName,
                                                    date: shift.eventDate,
                                                    role: shift.role,
                                                    hours: hours,
                                                    volunteerName: user?.name || user?.email || 'Volunteer',
                                                    progress: 100
                                                });
                                            }}
                                            className="inline-flex items-center justify-center text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
                                            title="Download Certificate"
                                        >
                                            <DownloadIcon className="w-5 h-5" />
                                        </button>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">Verified</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Card>
            </div>

            {/* Right Column: Profile Summary */}
            <div className="space-y-6">
                <Card className="text-center">
                    <img
                        src={user?.avatar || "https://ui-avatars.com/api/?name=" + user?.name}
                        alt="Profile"
                        className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-slate-100 dark:border-slate-700"
                    />
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">{user?.name}</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">{user?.email}</p>

                    <div className="grid grid-cols-2 gap-4 border-t border-slate-100 dark:border-slate-700 pt-6">
                        <div>
                            <p className="text-xs text-slate-500 uppercase tracking-wide">Lifetime Hours</p>
                            <p className="text-2xl font-bold text-indigo-600 dark:text-slate-200">{user?.totalHours || 0}</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 uppercase tracking-wide">Events</p>
                            <p className="text-2xl font-bold text-indigo-600 dark:text-slate-200">{pastShifts.length}</p>
                        </div>
                    </div>
                </Card>

                <div className="bg-indigo-600 rounded-xl p-6 text-white shadow-lg">
                    <h3 className="font-bold text-lg mb-2">Sync to Calendar</h3>
                    <p className="text-blue-100 text-sm mb-4">Never miss a shift. Add your upcoming volunteer schedule to your personal calendar.</p>
                    <button
                        onClick={handleDownloadCalendar}
                        className="w-full py-2 bg-white text-indigo-600 font-bold rounded-lg hover:bg-slate-100 transition-colors"
                    >
                        Download .iCal
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MySchedule;