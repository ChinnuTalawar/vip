import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import { ROSTER_DATA } from '../../services/mockData';
import { UsersIcon, BriefcaseIcon } from '../../components/Icons';

const Roster: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredRoster = ROSTER_DATA.filter(entry => {
    const matchesSearch = entry.volunteerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.eventName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || entry.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Pending': return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300';
      case 'Completed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      default: return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Volunteer Roster</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage assignments and track attendance.</p>
        </div>

        <div className="flex gap-3">
          <button className="bg-primary hover:bg-slate-700 text-white px-4 py-2 rounded-lg shadow-sm text-sm font-medium transition-colors flex items-center gap-2">
            <UsersIcon className="w-4 h-4" />
            <span>Add Volunteer</span>
          </button>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search volunteers or events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none"
          >
            <option value="All">All Status</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-600 dark:text-slate-300">
            <thead className="text-xs text-slate-700 uppercase bg-slate-100 dark:bg-slate-800 dark:text-slate-400">
              <tr>
                <th className="px-4 py-3">Volunteer</th>
                <th className="px-4 py-3">Event & Role</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRoster.map((entry) => (
                <tr key={entry.id} className="border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img className="w-8 h-8 rounded-full" src={entry.avatar} alt={entry.volunteerName} />
                      <div>
                        <div className="font-medium text-slate-900 dark:text-white">{entry.volunteerName}</div>
                        <div className="text-xs text-slate-500">{entry.volunteerEmail}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-900 dark:text-white">{entry.eventName}</div>
                    <div className="text-xs text-slate-500 flex items-center gap-1">
                      <BriefcaseIcon className="w-3 h-3" /> {entry.shiftRole}
                    </div>
                  </td>
                  <td className="px-4 py-3">{new Date(entry.date).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(entry.status)}`}>
                      {entry.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="text-slate-400 hover:text-primary dark:hover:text-white font-medium text-xs transition-colors">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
              {filteredRoster.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                    No roster entries found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Roster;