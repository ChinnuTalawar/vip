import React from 'react';
import Card from '../../components/ui/Card';
import { MOCK_USER } from '../../services/mockData';
import { ClockIcon } from '../../components/Icons';

const MySchedule: React.FC = () => {
    const upcomingShifts = [
        { id: 101, event: "City Park Cleanup", role: "Team Leader", date: "2024-06-15", time: "08:00 - 12:00", hours: 4 },
        { id: 102, event: "Food Bank Sort-a-thon", role: "Sorter", date: "2024-06-20", time: "10:00 - 14:00", hours: 4 },
    ];

    const pastShifts = [
        { id: 99, event: "Spring Gala", role: "Usher", date: "2024-05-10", hours: 5, verified: true },
        { id: 98, event: "Beach Clean", role: "General", date: "2024-04-22", hours: 3, verified: true },
    ];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Schedule */}
            <div className="lg:col-span-2 space-y-6">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Schedule</h1>

                <Card title="Upcoming Shifts">
                    <div className="space-y-4">
                        {upcomingShifts.map(shift => (
                            <div key={shift.id} className="flex items-start gap-4 p-4 border border-l-4 border-slate-200 border-l-primary rounded-lg bg-slate-50 dark:bg-slate-800/30 dark:border-slate-700">
                                <div className="flex-col items-center justify-center text-center w-16 hidden sm:flex">
                                    <span className="text-xs text-slate-500 uppercase font-bold">{new Date(shift.date).toLocaleString('default', { month: 'short' })}</span>
                                    <span className="text-2xl font-bold text-slate-800 dark:text-white">{new Date(shift.date).getDate()}</span>
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-lg font-bold text-slate-900 dark:text-white">{shift.event}</h4>
                                    <p className="text-primary font-medium text-sm">{shift.role}</p>
                                    <div className="flex items-center gap-2 mt-2 text-sm text-slate-500 dark:text-slate-400">
                                        <ClockIcon className="w-4 h-4" />
                                        <span>{shift.time}</span>
                                    </div>
                                </div>
                                <button className="text-sm text-slate-400 hover:text-red-500 underline decoration-dotted">Cancel</button>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card title="Hours Log">
                    <table className="w-full text-sm text-left text-slate-600 dark:text-slate-300">
                        <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-800 dark:text-slate-400">
                            <tr>
                                <th className="px-4 py-3 rounded-l-lg">Event</th>
                                <th className="px-4 py-3">Date</th>
                                <th className="px-4 py-3 text-center">Hours</th>
                                <th className="px-4 py-3 rounded-r-lg text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pastShifts.map(shift => (
                                <tr key={shift.id} className="border-b dark:border-slate-700">
                                    <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{shift.event}</td>
                                    <td className="px-4 py-3">{shift.date}</td>
                                    <td className="px-4 py-3 text-center">{shift.hours}</td>
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
                        src={MOCK_USER.avatar}
                        alt="Profile"
                        className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-slate-100 dark:border-slate-700"
                    />
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">{MOCK_USER.name}</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">{MOCK_USER.email}</p>

                    <div className="grid grid-cols-2 gap-4 border-t border-slate-100 dark:border-slate-700 pt-6">
                        <div>
                            <p className="text-xs text-slate-500 uppercase tracking-wide">Lifetime Hours</p>
                            <p className="text-2xl font-bold text-primary dark:text-slate-200">{MOCK_USER.totalHours}</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 uppercase tracking-wide">Events</p>
                            <p className="text-2xl font-bold text-primary dark:text-slate-200">12</p>
                        </div>
                    </div>
                </Card>

                <div className="bg-primary rounded-xl p-6 text-white shadow-lg">
                    <h3 className="font-bold text-lg mb-2">Sync to Calendar</h3>
                    <p className="text-blue-100 text-sm mb-4">Never miss a shift. Add your upcoming volunteer schedule to your personal calendar.</p>
                    <button className="w-full py-2 bg-white text-primary font-bold rounded-lg hover:bg-slate-100 transition-colors">
                        Download .iCal
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MySchedule;