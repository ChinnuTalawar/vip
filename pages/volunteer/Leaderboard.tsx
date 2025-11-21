import React, { useState, useEffect } from 'react';
import { TrophyIcon, UsersIcon } from '../../components/Icons';
import Card from '../../components/ui/Card';
import { getAllVolunteers } from '../../services/supabaseService';

interface LeaderboardEntry {
    rank: number;
    name: string;
    hours: number;
    events: number;
    avatar: string;
}

const Leaderboard: React.FC = () => {
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLeaderboard();
    }, []);

    const fetchLeaderboard = async () => {
        setLoading(true);
        const volunteers = await getAllVolunteers();

        // Sort by hours
        const sorted = volunteers.sort((a, b) => (b.totalHours || 0) - (a.totalHours || 0));

        const mapped = sorted.map((v, index) => ({
            rank: index + 1,
            name: v.name,
            hours: v.totalHours || 0,
            events: v.eventsCount || 0,
            avatar: v.avatar
        }));

        setLeaderboard(mapped);
        setLoading(false);
    };

    if (loading) return <div className="p-8 text-center">Loading leaderboard...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <TrophyIcon className="w-8 h-8 text-amber-500" />
                Volunteer Leaderboard
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Top 3 Podium */}
                <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                    {/* 2nd Place */}
                    {leaderboard.length > 1 && (
                        <Card className="md:mt-8 border-t-4 border-t-slate-400 relative overflow-visible">
                            <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-slate-400 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                                2
                            </div>
                            <div className="text-center pt-6">
                                <img
                                    src={leaderboard[1].avatar || `https://ui-avatars.com/api/?name=${leaderboard[1].name}`}
                                    alt={leaderboard[1].name}
                                    className="w-20 h-20 rounded-full mx-auto mb-3 border-4 border-slate-100"
                                />
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{leaderboard[1].name}</h3>
                                <p className="text-indigo-600 dark:text-indigo-400 font-bold">{leaderboard[1].hours} Hours</p>
                                <p className="text-slate-500 text-sm">{leaderboard[1].events} Events</p>
                            </div>
                        </Card>
                    )}

                    {/* 1st Place */}
                    {leaderboard.length > 0 && (
                        <Card className="border-t-4 border-t-amber-500 relative overflow-visible transform md:-translate-y-4 z-10">
                            <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                                <TrophyIcon className="w-6 h-6 text-white" />
                            </div>
                            <div className="text-center pt-8">
                                <img
                                    src={leaderboard[0].avatar || `https://ui-avatars.com/api/?name=${leaderboard[0].name}`}
                                    alt={leaderboard[0].name}
                                    className="w-24 h-24 rounded-full mx-auto mb-3 border-4 border-amber-50"
                                />
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{leaderboard[0].name}</h3>
                                <p className="text-amber-600 dark:text-amber-400 font-bold text-lg">{leaderboard[0].hours} Hours</p>
                                <p className="text-slate-500 text-sm">{leaderboard[0].events} Events</p>
                            </div>
                        </Card>
                    )}

                    {/* 3rd Place */}
                    {leaderboard.length > 2 && (
                        <Card className="md:mt-12 border-t-4 border-t-amber-700 relative overflow-visible">
                            <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-amber-700 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                                3
                            </div>
                            <div className="text-center pt-6">
                                <img
                                    src={leaderboard[2].avatar || `https://ui-avatars.com/api/?name=${leaderboard[2].name}`}
                                    alt={leaderboard[2].name}
                                    className="w-20 h-20 rounded-full mx-auto mb-3 border-4 border-slate-100"
                                />
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{leaderboard[2].name}</h3>
                                <p className="text-indigo-600 dark:text-indigo-400 font-bold">{leaderboard[2].hours} Hours</p>
                                <p className="text-slate-500 text-sm">{leaderboard[2].events} Events</p>
                            </div>
                        </Card>
                    )}
                </div>

                {/* Full List */}
                <div className="lg:col-span-3">
                    <Card title="Top Contributors">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-200 dark:border-slate-700">
                                        <th className="py-3 px-4 text-sm font-semibold text-slate-600 dark:text-slate-400">Rank</th>
                                        <th className="py-3 px-4 text-sm font-semibold text-slate-600 dark:text-slate-400">Volunteer</th>
                                        <th className="py-3 px-4 text-sm font-semibold text-slate-600 dark:text-slate-400 text-right">Hours</th>
                                        <th className="py-3 px-4 text-sm font-semibold text-slate-600 dark:text-slate-400 text-right">Events</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                    {leaderboard.map((entry) => (
                                        <tr key={entry.rank} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                            <td className="py-3 px-4">
                                                <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${entry.rank === 1 ? 'bg-amber-100 text-amber-700' :
                                                    entry.rank === 2 ? 'bg-slate-200 text-slate-700' :
                                                        entry.rank === 3 ? 'bg-amber-700/20 text-amber-800 dark:text-amber-600' :
                                                            'text-slate-500'
                                                    }`}>
                                                    {entry.rank}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={entry.avatar || `https://ui-avatars.com/api/?name=${entry.name}`}
                                                        alt={entry.name}
                                                        className="w-8 h-8 rounded-full"
                                                    />
                                                    <span className="font-medium text-slate-900 dark:text-white">{entry.name}</span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 text-right font-bold text-indigo-600 dark:text-indigo-400">
                                                {entry.hours}
                                            </td>
                                            <td className="py-3 px-4 text-right text-slate-500 dark:text-slate-400">
                                                {entry.events}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Leaderboard;
